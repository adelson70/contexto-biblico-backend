import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PesquisaRequestDto } from './dto/pesquisa-request.dto';
import { PesquisaResponseDto } from './dto/pesquisa-response.dto';
import { LivroBiblicaloResponseDto } from './dto/livro-biblico-response.dto';
import { LivroBiblicaloInfoResponseDto } from './dto/livro-info-response.dto';
import { LivroNaoEncontradoException } from './exceptions/livro-nao-encontrado.exception';
import { CapituloInvalidoException } from './exceptions/capitulo-invalido.exception';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { BibliaService } from '../../common/services/biblia.service';
import * as livrosInfo from '../../data/livros-info.json';

@Injectable()
export class PesquisaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bibliaService: BibliaService,
  ) {}

  // Regex para validar formato de capítulo
  private readonly REGEX_CAPITULO = /^\d+$/;

  async buscarVersiculos(pesquisaDto: PesquisaRequestDto): Promise<PesquisaResponseDto> {
    // Valida formato do capítulo
    const capituloTrimmed = pesquisaDto.capitulo.trim();
    if (!this.REGEX_CAPITULO.test(capituloTrimmed)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Capítulo deve ser um número inteiro positivo',
          error: 'Formato inválido',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const numeroCapitulo = parseInt(capituloTrimmed, 10);

    // Busca inteligente do livro
    const livro = this.bibliaService.buscarLivro(pesquisaDto.livro);

    if (!livro) {
      const sugestoes = this.bibliaService.sugerirLivros(pesquisaDto.livro);
      throw new LivroNaoEncontradoException(pesquisaDto.livro, sugestoes);
    }

    // Valida range do capítulo
    if (numeroCapitulo < 1 || numeroCapitulo > livro.chapters.length) {
      throw new CapituloInvalidoException(
        numeroCapitulo,
        livro.name,
        livro.chapters.length,
      );
    }

    // Retorna apenas o capítulo solicitado
    const versiculos = livro.chapters[numeroCapitulo - 1];

    // Busca comentários do banco de dados
    const comentariosDoBanco = await this.prisma.comentarios.findMany({
      where: { 
        livro: livro.name, 
        capitulo: numeroCapitulo, 
        isDeleted: false 
      },
      select: { 
        versiculo: true,
        texto: true 
      }
    });

    // Busca referências do banco de dados
    const referenciasDoBanco = await this.prisma.referencias.findMany({
      where: { 
        livro: livro.name, 
        capitulo: numeroCapitulo, 
        isDeleted: false 
      },
      select: { 
        versiculo: true,
        referencia: true 
      }
    });

    // Agrupa comentários por versículo
    const comentariosPorVersiculo = new Map<number, string[]>();
    comentariosDoBanco.forEach(comentario => {
      if (!comentariosPorVersiculo.has(comentario.versiculo)) {
        comentariosPorVersiculo.set(comentario.versiculo, []);
      }
      comentariosPorVersiculo.get(comentario.versiculo)!.push(comentario.texto);
    });

    // Agrupa referências por versículo
    const referenciasPorVersiculo = new Map<number, string[]>();
    referenciasDoBanco.forEach(referencia => {
      if (!referenciasPorVersiculo.has(referencia.versiculo)) {
        referenciasPorVersiculo.set(referencia.versiculo, []);
      }
      referenciasPorVersiculo.get(referencia.versiculo)!.push(referencia.referencia);
    });

    // Estrutura a resposta com versículos contendo texto, comentários e referências
    const versiculosComDados = versiculos.map((texto, index) => {
      const numeroVersiculo = index + 1;
      return {
        numero: numeroVersiculo,
        texto,
        comentarios: comentariosPorVersiculo.get(numeroVersiculo) || [],
        referencias: referenciasPorVersiculo.get(numeroVersiculo) || []
      };
    });

    return {
      livro: livro.name,
      abreviacao: livro.abbrev,
      capitulo: numeroCapitulo,
      versiculos: versiculosComDados,
      totalVersiculos: versiculos.length
    };
  }

  async listarLivrosBiblicalos(): Promise<LivroBiblicaloResponseDto[]> {
    const todosLivros = this.bibliaService.getTodosLivros();
    
    return todosLivros.map((livro, index) => {
      // Navegação cíclica: o último livro aponta para o primeiro e vice-versa
      const livroAnterior = index > 0 
        ? todosLivros[index - 1].name 
        : todosLivros[todosLivros.length - 1].name; // Apocalipse para Gênesis
      
      const proximoLivro = index < todosLivros.length - 1 
        ? todosLivros[index + 1].name 
        : todosLivros[0].name; // Gênesis para Apocalipse
      
      return {
        nome: livro.name,
        quantidadeCapitulos: livro.chapters.length,
        livroAnterior,
        proximoLivro
      };
    });
  }

  async obterInfoLivroBiblicalo(livroId: string): Promise<LivroBiblicaloInfoResponseDto> {
    const livroInfo = livrosInfo[livroId as keyof typeof livrosInfo];
    
    if (!livroInfo) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Livro com ID ${livroId} não encontrado`,
          error: 'Livro não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Converte o objeto de capítulos em array ordenado numericamente
    const capitulos = Object.entries(livroInfo).map(([capitulo, versiculos]) => ({
      capitulo: Number(capitulo), // Mais rápido que parseInt
      versiculos: Number(versiculos) // Garante número
    })).sort((a, b) => a.capitulo - b.capitulo); // Ordem garantida

    return {
      livro_id: livroId,
      capitulos,
      totalCapitulos: capitulos.length
    };
  }
}
