import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PicoPesquisaResponseDTO, PicoPesquisaSemanalResponseDTO, PicoPesquisaMensalResponseDTO, PicoPesquisaTotalResponseDTO, PicoPesquisaEstadoResponseDTO, PicoPesquisaCidadeResponseDTO, PicoPesquisaHorarioResponseDTO } from './dto/pico-pesquisa.dto';
import { LivrosPesquisadosResponseDTO } from './dto/livros-pesquisados.dto';
import { LivrosCapituloPesquisadosResponseDTO } from './dto/livros-capitulo-pesquisados.dto';
import { ComentariosTotalResponseDTO, ComentariosPorLivroResponseDTO, ComentariosPorCapituloResponseDTO, ComentariosPorVersiculoResponseDTO } from './dto/livro-comentarios.dto';
import { ReferenciasTotalResponseDTO, ReferenciasPorLivroResponseDTO, ReferenciasPorCapituloResponseDTO, ReferenciasPorVersiculoResponseDTO } from './dto/livro-referencias.dto';

@Injectable()
export class StatsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async picoPesquisa(): Promise<PicoPesquisaResponseDTO> {
    // Busca todas as pesquisas
    const pesquisas = await this.prisma.pesquisas.findMany({
      select: {
        createdAt: true,
      },
    });
    
    // Cria um objeto para contar as pesquisas por horário
    const contagemPorHora: Record<string, number> = {};
    
    // Inicializa todas as 24 horas com 0
    for (let i = 0; i < 24; i++) {
      const hora = i.toString().padStart(2, '0');
      contagemPorHora[hora] = 0;
    }
    
    // Conta as pesquisas por hora
    pesquisas.forEach(pesquisa => {
      const hora = pesquisa.createdAt.getHours().toString().padStart(2, '0');
      contagemPorHora[hora]++;
    });
    
    // Converte o objeto em array de objetos
    const dados = Object.entries(contagemPorHora).map(([horario, quantidade]) => ({
      horario,
      quantidade,
    }));
    
    return { dados, message: 'Pico de horário de pesquisa recuperado com sucesso' };
  }

  async picoPesquisaComPeriodo(dataInicio?: string, dataFim?: string): Promise<PicoPesquisaHorarioResponseDTO> {
    // Se não foram fornecidas datas, usa padrão de 7 dias atrás até hoje
    let dataInicioFiltro: Date;
    let dataFimFiltro: Date;

    if (dataInicio && dataFim) {
      // Converte as datas para o início e fim do dia
      dataInicioFiltro = new Date(dataInicio + 'T00:00:00.000Z');
      dataFimFiltro = new Date(dataFim + 'T23:59:59.999Z');
    } else {
      // Padrão: 7 dias atrás até hoje
      dataFimFiltro = new Date();
      dataFimFiltro.setHours(23, 59, 59, 999); // Fim do dia atual
      
      dataInicioFiltro = new Date();
      dataInicioFiltro.setDate(dataInicioFiltro.getDate() - 7);
      dataInicioFiltro.setHours(0, 0, 0, 0); // Início do dia há 7 dias
    }

    // Busca pesquisas no período especificado
    const pesquisas = await this.prisma.pesquisas.findMany({
      where: {
        createdAt: {
          gte: dataInicioFiltro,
          lte: dataFimFiltro,
        },
      },
      select: {
        createdAt: true,
      },
    });
    
    // Conta o total de pesquisas no período
    const totalPeriodo = pesquisas.length;
    
    // Cria um objeto para contar as pesquisas por horário
    const contagemPorHora: Record<string, number> = {};
    
    // Inicializa todas as 24 horas com 0
    for (let i = 0; i < 24; i++) {
      const hora = i.toString().padStart(2, '0');
      contagemPorHora[hora] = 0;
    }
    
    // Conta as pesquisas por hora
    pesquisas.forEach(pesquisa => {
      const hora = pesquisa.createdAt.getHours().toString().padStart(2, '0');
      contagemPorHora[hora]++;
    });
    
    // Converte o objeto em array de objetos
    const dados = Object.entries(contagemPorHora).map(([horario, quantidade]) => ({
      horario,
      quantidade,
    }));
    
    return { 
      dados, 
      total_periodo: totalPeriodo,
      message: 'Pico de horário de pesquisa recuperado com sucesso' 
    };
  }

  async picoPesquisaSemanal(): Promise<PicoPesquisaSemanalResponseDTO> {
    const pesquisas = await this.prisma.pesquisas.findMany({
      select: {
        createdAt: true,
      },
    });

    // Mapeamento de números para nomes dos dias da semana
    const diasDaSemana = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];

    // Inicializa todos os 7 dias da semana com 0
    const contagemPorDia: Record<string, number> = {};
    diasDaSemana.forEach(dia => {
      contagemPorDia[dia] = 0;
    });

    // Conta as pesquisas por dia da semana
    pesquisas.forEach(pesquisa => {
      const numeroDia = pesquisa.createdAt.getDay();
      const nomeDia = diasDaSemana[numeroDia];
      contagemPorDia[nomeDia]++;
    });

    // Converte o objeto em array de objetos na ordem correta dos dias
    const dados = diasDaSemana.map(dia => ({
      dia,
      quantidade: contagemPorDia[dia],
    }));

    return { dados, message: 'Pico de semana de pesquisa recuperado com sucesso' };
  }

  async picoPesquisaMensal(): Promise<PicoPesquisaMensalResponseDTO> {
    const pesquisas = await this.prisma.pesquisas.findMany({
      select: {
        createdAt: true,
      },
    });

    // Mapeamento de números para nomes dos meses
    const mesesDoAno = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    // Inicializa todos os 12 meses com 0
    const contagemPorMes: Record<string, number> = {};
    mesesDoAno.forEach(mes => {
      contagemPorMes[mes] = 0;
    });

    // Conta as pesquisas por mês
    pesquisas.forEach(pesquisa => {
      const numeroMes = pesquisa.createdAt.getMonth();
      const nomeMes = mesesDoAno[numeroMes];
      contagemPorMes[nomeMes]++;
    });

    // Converte o objeto em array de objetos na ordem correta dos meses
    const dados = mesesDoAno.map(mes => ({
      mes,
      quantidade: contagemPorMes[mes],
    }));

    return { dados, message: 'Pico mensal de pesquisa recuperado com sucesso' };
  }

  async picoPesquisaTotal(): Promise<PicoPesquisaTotalResponseDTO> {
    // Conta o total de pesquisas
    const total = await this.prisma.pesquisas.count();

    return { total, message: 'Pesquisas totais recuperado com sucesso' };
  }

  async picoPesquisaEstado(): Promise<PicoPesquisaEstadoResponseDTO> {
    // Busca todas as pesquisas com estado
    const pesquisas = await this.prisma.pesquisas.findMany({
      where: {
        estado: {
          not: null,
        },
      },
      select: {
        estado: true,
      },
    });

    // Agrupa e conta por estado
    const contagemPorEstado: Record<string, number> = {};

    pesquisas.forEach(pesquisa => {
      const estado = pesquisa.estado || 'Desconhecido';
      
      // Filtra Localhost e Desconhecido
      if (estado !== 'Localhost' && estado !== 'Desconhecido') {
        contagemPorEstado[estado] = (contagemPorEstado[estado] || 0) + 1;
      }
    });

    // Converte para array e ordena por quantidade (descendente)
    const dados = Object.entries(contagemPorEstado)
      .map(([estado, quantidade]) => ({
        estado,
        quantidade,
      }))
      .sort((a, b) => b.quantidade - a.quantidade);

    return { dados, message: 'Pesquisas por estado recuperado com sucesso' };
  }

  async picoPesquisaCidade(): Promise<PicoPesquisaCidadeResponseDTO> {
    // Busca todas as pesquisas com cidade
    const pesquisas = await this.prisma.pesquisas.findMany({
      where: {
        cidade: {
          not: null,
        },
      },
      select: {
        cidade: true,
      },
    });

    // Agrupa e conta por cidade
    const contagemPorCidade: Record<string, number> = {};

    pesquisas.forEach(pesquisa => {
      const cidade = pesquisa.cidade || 'Desconhecido';

      // Filtra Localhost e Desconhecido
      if (cidade !== 'Localhost' && cidade !== 'Desconhecido') {
        contagemPorCidade[cidade] = (contagemPorCidade[cidade] || 0) + 1;
      }
    });

    // Converte para array e ordena por quantidade (descendente)
    const dados = Object.entries(contagemPorCidade)
      .map(([cidade, quantidade]) => ({
        cidade,
        quantidade,
      }))
      .sort((a, b) => b.quantidade - a.quantidade);

    return { dados, message: 'Pesquisas por cidade recuperado com sucesso' };
  }

  async livrosPesquisados(top: number = 10): Promise<LivrosPesquisadosResponseDTO> {
    // Agrupa diretamente no banco de dados usando livro_encontrado
    const resultados = await this.prisma.pesquisas.groupBy({
      by: ['livro_encontrado'],
      _count: {
        livro_encontrado: true,
      },
      where: {
        livro_encontrado: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          livro_encontrado: 'desc',
        },
      },
      take: top,
    });

    // Formata os dados para o DTO
    const dados = resultados.map((resultado) => ({
      livro: resultado.livro_encontrado!,
      quantidade: resultado._count.livro_encontrado,
    }));

    return { dados, message: `Top ${top} livros mais pesquisados recuperado com sucesso` };
  }

  async livrosCapitulosPesquisados(top: number = 10): Promise<LivrosCapituloPesquisadosResponseDTO> {
    // Agrupa por livro_encontrado E capitulo_livro
    const resultados = await this.prisma.pesquisas.groupBy({
      by: ['livro_encontrado', 'capitulo_livro'],
      _count: {
        livro_encontrado: true,
      },
      orderBy: {
        _count: {
          livro_encontrado: 'desc',
        },
      },
      take: top,
    });

    // Formata os dados para o DTO concatenando livro:capítulo
    const dados = resultados.map((resultado) => ({
      livroCapitulo: `${resultado.livro_encontrado}: ${resultado.capitulo_livro}`,
      quantidade: resultado._count.livro_encontrado,
    }));

    return { dados, message: `Top ${top} livros e capítulos mais pesquisados recuperado com sucesso` };
  }

  async comentariosTotal(): Promise<ComentariosTotalResponseDTO> {
    // Conta o total de comentários não deletados
    const total = await this.prisma.comentarios.count({
      where: {
        isDeleted: false,
      },
    });

    return { total, message: 'Comentários totais recuperado com sucesso' };
  }

  async comentariosPorLivro(top: number = 10): Promise<ComentariosPorLivroResponseDTO> {
    // Agrupa por livro e conta comentários não deletados
    const resultados = await this.prisma.comentarios.groupBy({
      by: ['livro'],
      _count: {
        livro: true,
      },
      where: {
        isDeleted: false,
      },
      orderBy: {
        _count: {
          livro: 'desc',
        },
      },
      take: top,
    });

    // Formata os dados para o DTO
    const dados = resultados.map((resultado) => ({
      livro: resultado.livro,
      quantidade: resultado._count.livro,
    }));

    return { dados, message: `Top ${top} livros com mais comentários recuperado com sucesso` };
  }

  async comentariosPorCapitulo(top: number = 10): Promise<ComentariosPorCapituloResponseDTO> {
    // Agrupa por livro e capitulo
    const resultados = await this.prisma.comentarios.groupBy({
      by: ['livro', 'capitulo'],
      _count: {
        livro: true,
      },
      where: {
        isDeleted: false,
      },
      orderBy: {
        _count: {
          livro: 'desc',
        },
      },
      take: top,
    });

    // Formata os dados para o DTO concatenando livro: capítulo
    const dados = resultados.map((resultado) => ({
      livroCapitulo: `${resultado.livro}: ${resultado.capitulo}`,
      quantidade: resultado._count.livro,
    }));

    return { dados, message: `Top ${top} livros e capítulos com mais comentários recuperado com sucesso` };
  }

  async comentariosPorVersiculo(top: number = 10): Promise<ComentariosPorVersiculoResponseDTO> {
    // Agrupa por livro, capitulo e versiculo
    const resultados = await this.prisma.comentarios.groupBy({
        by: ['livro', 'capitulo', 'versiculo'],
      _count: {
        livro: true,
      },
      where: {
        isDeleted: false,
      },
      orderBy: {
        _count: {
          livro: 'desc',
        },
      },
      take: top,
    });

    // Formata os dados para o DTO concatenando livro: capítulo:versículo
    const dados = resultados.map((resultado) => ({
      livroCapituloVersiculo: `${resultado.livro}: ${resultado.capitulo}:${resultado.versiculo}`,
      quantidade: resultado._count.livro,
    }));

    return { dados, message: `Top ${top} livros, capítulos e versículos com mais comentários recuperado com sucesso` };
  }

  async referenciasTotal(): Promise<ReferenciasTotalResponseDTO> {
    // Conta o total de referências não deletadas
    const total = await this.prisma.referencias.count({
      where: {
        isDeleted: false,
      },
    });

    return { total, message: 'Referências totais recuperado com sucesso' };
  }

  async referenciasPorLivro(top: number = 10): Promise<ReferenciasPorLivroResponseDTO> {
    // Agrupa por livro e conta referências não deletadas
    const resultados = await this.prisma.referencias.groupBy({
      by: ['livro'],
      _count: {
        livro: true,
      },
      where: {
        isDeleted: false,
      },
      orderBy: {
        _count: {
          livro: 'desc',
        },
      },
      take: top,
    });

    // Formata os dados para o DTO
    const dados = resultados.map((resultado) => ({
      livro: resultado.livro,
      quantidade: resultado._count.livro,
    }));

    return { dados, message: `Top ${top} livros com mais referências recuperado com sucesso` };
  }

  async referenciasPorCapitulo(top: number = 10): Promise<ReferenciasPorCapituloResponseDTO> {
    // Agrupa por livro e capitulo
    const resultados = await this.prisma.referencias.groupBy({
      by: ['livro', 'capitulo'],
      _count: {
        livro: true,
      },
      where: {
        isDeleted: false,
      },
      orderBy: {
        _count: {
          livro: 'desc',
        },
      },
      take: top,
    });

    // Formata os dados para o DTO concatenando livro: capítulo
    const dados = resultados.map((resultado) => ({
      livroCapitulo: `${resultado.livro}: ${resultado.capitulo}`,
      quantidade: resultado._count.livro,
    }));

    return { dados, message: `Top ${top} livros e capítulos com mais referências recuperado com sucesso` };
  }

  async referenciasPorVersiculo(top: number = 10): Promise<ReferenciasPorVersiculoResponseDTO> {
    // Agrupa por livro, capitulo e versiculo
    const resultados = await this.prisma.referencias.groupBy({
        by: ['livro', 'capitulo', 'versiculo'],
      _count: {
        livro: true,
      },
      where: {
        isDeleted: false,
      },
      orderBy: {
        _count: {
          livro: 'desc',
        },
      },
      take: top,
    });

    // Formata os dados para o DTO concatenando livro: capítulo:versículo
    const dados = resultados.map((resultado) => ({
      livroCapituloVersiculo: `${resultado.livro}: ${resultado.capitulo}:${resultado.versiculo}`,
      quantidade: resultado._count.livro,
    }));

    return { dados, message: `Top ${top} livros, capítulos e versículos com mais referências recuperado com sucesso` };
  }
  
}
