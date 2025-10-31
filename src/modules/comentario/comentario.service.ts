import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CriarComentarioDTO } from './dto/comentario-criar.dto';
import { AtualizarComentarioDTO } from './dto/comentario-atualizar.dto';
import { CriarComentarioResponse } from './dto/comentario-response.dto';
import { ListarComentariosQueryDTO, ListarComentariosResponse, ComentarioItemResponse } from './dto/comentario-listar.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LivrosPermissaoService } from '../../common/services/livros-permissao.service';

@Injectable()
export class ComentarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly livrosPermissaoService: LivrosPermissaoService,
  ) {}

  async criarComentario(
    comentarioDto: CriarComentarioDTO,
    userId: number,
    isAdmin: boolean,
  ): Promise<CriarComentarioResponse> {
    // Validar permissão do livro
    const temPermissao = await this.livrosPermissaoService.validarPermissaoLivro(
      userId,
      isAdmin,
      comentarioDto.livro,
    );

    if (!temPermissao) {
      throw new ForbiddenException(
        `Você não tem permissão para criar comentários no livro "${comentarioDto.livro}"`,
      );
    }

    const comentario = await this.prisma.comentarios.create({
      data: {
        livro: comentarioDto.livro,
        capitulo: comentarioDto.capitulo,
        versiculo: comentarioDto.versiculo,
        texto: comentarioDto.texto,
      },
    });

    return {
      id: comentario.id,
      livro: comentario.livro,
      capitulo: comentario.capitulo,
      versiculo: comentario.versiculo,
      texto: comentario.texto,
    };
  }

  async deletarComentario(id: string, userId: number, isAdmin: boolean): Promise<void> {
    // Buscar o comentário para verificar a permissão
    const comentario = await this.prisma.comentarios.findUnique({
      where: { id: parseInt(id) },
      select: { livro: true, isDeleted: true },
    });

    if (!comentario) {
      throw new NotFoundException('Comentário não encontrado');
    }

    if (comentario.isDeleted) {
      throw new NotFoundException('Comentário não encontrado');
    }

    // Validar permissão do livro
    const temPermissao = await this.livrosPermissaoService.validarPermissaoLivro(
      userId,
      isAdmin,
      comentario.livro,
    );

    if (!temPermissao) {
      throw new ForbiddenException(
        `Você não tem permissão para deletar comentários do livro "${comentario.livro}"`,
      );
    }

    await this.prisma.comentarios.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });
  }

  async atualizarComentario(
    id: string,
    comentarioDto: AtualizarComentarioDTO,
    userId: number,
    isAdmin: boolean,
  ): Promise<void> {
    // Buscar o comentário para verificar a permissão
    const comentario = await this.prisma.comentarios.findUnique({
      where: { id: parseInt(id) },
      select: { livro: true, isDeleted: true },
    });

    if (!comentario) {
      throw new NotFoundException('Comentário não encontrado');
    }

    if (comentario.isDeleted) {
      throw new NotFoundException('Comentário não encontrado');
    }

    // Validar permissão do livro
    const temPermissao = await this.livrosPermissaoService.validarPermissaoLivro(
      userId,
      isAdmin,
      comentario.livro,
    );

    if (!temPermissao) {
      throw new ForbiddenException(
        `Você não tem permissão para editar comentários do livro "${comentario.livro}"`,
      );
    }

    await this.prisma.comentarios.update({
      where: { id: parseInt(id) },
      data: { 
        texto: comentarioDto.texto,
        updatedAt: new Date(),
      },
    });
  }

  async listarComentariosPorLivro(
    queryDto: ListarComentariosQueryDTO,
    userId: number,
    isAdmin: boolean,
  ): Promise<ListarComentariosResponse> {
    const { livro, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    // Prepara o filtro de where, incluindo livro apenas se fornecido
    const whereClause: any = {
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
          total: 0,
          page,
          limit,
          totalPages: 0,
        };
      }

      whereClause.livro = {
        in: livrosPermitidos,
      };
    }

    // Se livro específico foi fornecido, aplicar filtro adicional
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
            total: 0,
            page,
            limit,
            totalPages: 0,
          };
        }
      }

      whereClause.livro = livro;
    }

    // Busca o total de comentários
    const total = await this.prisma.comentarios.count({
      where: whereClause,
    });

    // Busca os comentários com paginação
    const comentarios = await this.prisma.comentarios.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      skip: skip,
      take: limit,
      select: {
        id: true,
        livro: true,
        capitulo: true,
        versiculo: true,
        texto: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: comentarios as ComentarioItemResponse[],
      total,
      page,
      limit,
      totalPages,
    };
  }
}
