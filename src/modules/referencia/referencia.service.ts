import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CriarReferenciaDTO } from './dto/referencia-criar.dto';
import { CriarReferenciaResponse } from './dto/referencia-response.dto';
import { ListarReferenciasDTO } from './dto/listar-referencias.dto';
import { ListarReferenciasResponseDTO } from './dto/listar-referencias-response.dto';
import { VincularReferenciaDTO } from './dto/vincular-referencia.dto';
import { VincularReferenciaResponseDTO } from './dto/vincular-referencia-response.dto';
import { DesvincularReferenciaResponseDTO } from './dto/desvincular-referencia-response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LivrosPermissaoService } from '../../common/services/livros-permissao.service';

@Injectable()
export class ReferenciaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly livrosPermissaoService: LivrosPermissaoService,
  ) {}
  async criarReferencia(
    referenciaDto: CriarReferenciaDTO,
    userId: number,
    isAdmin: boolean,
  ): Promise<CriarReferenciaResponse> {
    // VERIFICAR NO BANCO se o usuário é realmente admin (segurança extra)
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: userId },
      select: { is_admin: true, isDeleted: true },
    });

    if (!usuario || usuario.isDeleted) {
      throw new ForbiddenException('Usuário não encontrado');
    }

    // Usar o valor do banco de dados, não o parâmetro recebido
    const usuarioEAdmin = usuario.is_admin === true;

    // Validar permissão do livro
    const temPermissao = await this.livrosPermissaoService.validarPermissaoLivro(
      userId,
      usuarioEAdmin,
      referenciaDto.livro,
    );

    if (!temPermissao) {
      throw new ForbiddenException(
        `Você não tem permissão para criar referências no livro "${referenciaDto.livro}"`,
      );
    }

    // Se não for admin, criar na tabela de revisão
    // APENAS se o usuário for realmente admin no banco de dados
    if (!usuarioEAdmin) {
      const referenciaRevisao = await this.prisma.referencia_revisao.create({
        data: {
          referencia: referenciaDto.referencia,
          livro: referenciaDto.livro,
          capitulo: referenciaDto.capitulo,
          versiculo: referenciaDto.versiculo,
          criado_por_id: userId,
          status: 'NAO_REVISADO' as any,
        },
      });

      return {
        id: referenciaRevisao.id,
        referencia: referenciaRevisao.referencia,
        livro: referenciaRevisao.livro,
        capitulo: referenciaRevisao.capitulo,
        versiculo: referenciaRevisao.versiculo,
        message: 'Referência enviada para revisão',
      };
    }

    // Se for admin, criar diretamente na tabela principal
    const referencia = await this.prisma.referencias.create({
      data: {
        referencia: referenciaDto.referencia,
        livro: referenciaDto.livro,
        capitulo: referenciaDto.capitulo,
        versiculo: referenciaDto.versiculo,
      },
    });

    return {
      id: referencia.id,
      referencia: referenciaDto.referencia,
      livro: referenciaDto.livro,
      capitulo: referenciaDto.capitulo,
      versiculo: referenciaDto.versiculo,
    };
  }

  async deletarReferencia(
    id: string,
    userId: number,
    isAdmin: boolean,
  ): Promise<void> {
    // Buscar a referência para verificar a permissão
    const referencia = await this.prisma.referencias.findUnique({
      where: { id: parseInt(id) },
      select: { livro: true, isDeleted: true },
    });

    if (!referencia) {
      throw new NotFoundException('Referência não encontrada');
    }

    if (referencia.isDeleted) {
      throw new NotFoundException('Referência não encontrada');
    }

    // Validar permissão do livro
    const temPermissao = await this.livrosPermissaoService.validarPermissaoLivro(
      userId,
      isAdmin,
      referencia.livro,
    );

    if (!temPermissao) {
      throw new ForbiddenException(
        `Você não tem permissão para deletar referências do livro "${referencia.livro}"`,
      );
    }

    await this.prisma.referencias.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });
  }

  async listarReferencias(
    listarDto: ListarReferenciasDTO,
    userId: number,
    isAdmin: boolean,
  ): Promise<ListarReferenciasResponseDTO> {
    const { page, limit, livro, capitulo, versiculo } = listarDto;

    // Construir filtros
    const where: any = {
      isDeleted: false,
    };

    // Se não for admin, filtrar apenas pelos livros permitidos
    if (!isAdmin) {
      const livrosPermitidos = await this.livrosPermissaoService.obterLivrosPermitidos(
        userId,
        isAdmin,
      );
      
      // Se não tiver nenhum livro permitido, retornar lista vazia
      if (livrosPermitidos.length === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            page: page || 1,
            limit: limit || 0,
            totalPages: 0,
          },
        };
      }

      where.livro = {
        in: livrosPermitidos,
      };
    }

    if (livro) {
      // Se não for admin, validar se o livro está nos permitidos
      if (!isAdmin) {
        const temPermissao = await this.livrosPermissaoService.validarPermissaoLivro(
          userId,
          isAdmin,
          livro,
        );

        if (!temPermissao) {
          return {
            data: [],
            meta: {
              total: 0,
              page: page || 1,
              limit: limit || 0,
              totalPages: 0,
            },
          };
        }
      }

      where.livro = livro;
    }

    if (capitulo) {
      where.capitulo = capitulo;
    }

    if (versiculo) {
      where.versiculo = versiculo;
    }

    // Buscar todas as referências sem paginação para agrupar
    const referencias = await this.prisma.referencias.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Agrupar por livro, capítulo e versículo
    const agrupadasMap = new Map<string, any>();
    
    referencias.forEach(ref => {
      const chave = `${ref.livro}-${ref.capitulo}-${ref.versiculo}`;
      
      if (!agrupadasMap.has(chave)) {
        agrupadasMap.set(chave, {
          livro: ref.livro,
          capitulo: ref.capitulo,
          versiculo: ref.versiculo,
          referencias: [],
        });
      }
      
      agrupadasMap.get(chave).referencias.push({
        id: ref.id,
        referencia: ref.referencia,
        createdAt: ref.createdAt,
      });
    });

    // Converter mapa para array
    const agrupadas = Array.from(agrupadasMap.values()).map(item => ({
      ...item,
      totalReferencias: item.referencias.length,
    }));

    // Paginação manual
    const total = agrupadas.length;
    const pagina = page || 1;
    const limite = limit || total;
    const skip = (pagina - 1) * limite;
    const totalPages = Math.ceil(total / limite);

    const dataPaginada = agrupadas.slice(skip, skip + limite);

    return {
      data: dataPaginada,
      meta: {
        total,
        page: pagina,
        limit: limite,
        totalPages,
      },
    };
  }

  async vincularReferencia(
    referenciaDto: VincularReferenciaDTO,
    userId: number,
    isAdmin: boolean,
  ): Promise<VincularReferenciaResponseDTO> {
    // VERIFICAR NO BANCO se o usuário é realmente admin (segurança extra)
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: userId },
      select: { is_admin: true, isDeleted: true },
    });

    if (!usuario || usuario.isDeleted) {
      throw new ForbiddenException('Usuário não encontrado');
    }

    // Usar o valor do banco de dados, não o parâmetro recebido
    const usuarioEAdmin = usuario.is_admin === true;

    // Validar permissão do livro
    const temPermissao = await this.livrosPermissaoService.validarPermissaoLivro(
      userId,
      usuarioEAdmin,
      referenciaDto.livro,
    );

    if (!temPermissao) {
      throw new ForbiddenException(
        `Você não tem permissão para vincular referências no livro "${referenciaDto.livro}"`,
      );
    }

    // Se não for admin, criar na tabela de revisão
    // APENAS se o usuário for realmente admin no banco de dados
    if (!usuarioEAdmin) {
      const referenciaRevisao = await this.prisma.referencia_revisao.create({
        data: {
          referencia: referenciaDto.referencia,
          livro: referenciaDto.livro,
          capitulo: referenciaDto.capitulo,
          versiculo: referenciaDto.versiculo,
          criado_por_id: userId,
          status: 'NAO_REVISADO' as any,
        },
      });

      return {
        id: referenciaRevisao.id,
        referencia: referenciaRevisao.referencia,
        livro: referenciaRevisao.livro,
        capitulo: referenciaRevisao.capitulo,
        versiculo: referenciaRevisao.versiculo,
        message: 'Referência enviada para revisão',
      };
    }

    // Se for admin, criar diretamente na tabela principal
    const referencia = await this.prisma.referencias.create({
      data: {
        referencia: referenciaDto.referencia,
        livro: referenciaDto.livro,
        capitulo: referenciaDto.capitulo,
        versiculo: referenciaDto.versiculo,
      },
    });

    return {
      id: referencia.id,
      referencia: referencia.referencia,
      livro: referencia.livro,
      capitulo: referencia.capitulo,
      versiculo: referencia.versiculo,
      message: 'Referência vinculada com sucesso',
    };
  }

  async desvincularReferencia(
    id: string,
    userId: number,
    isAdmin: boolean,
  ): Promise<DesvincularReferenciaResponseDTO> {
    const idNumero = parseInt(id);
    
    // Buscar a referência para verificar a permissão
    const referencia = await this.prisma.referencias.findUnique({
      where: { id: idNumero },
      select: { livro: true, isDeleted: true },
    });

    if (!referencia) {
      throw new NotFoundException('Referência não encontrada');
    }

    if (referencia.isDeleted) {
      throw new NotFoundException('Referência não encontrada');
    }

    // Validar permissão do livro
    const temPermissao = await this.livrosPermissaoService.validarPermissaoLivro(
      userId,
      isAdmin,
      referencia.livro,
    );

    if (!temPermissao) {
      throw new ForbiddenException(
        `Você não tem permissão para desvincular referências do livro "${referencia.livro}"`,
      );
    }
    
    await this.prisma.referencias.update({
      where: { id: idNumero },
      data: { isDeleted: true },
    });

    return {
      id: idNumero,
      message: 'Referência desvinculada com sucesso',
    };
  }
}
