import { Injectable } from '@nestjs/common';
import { CriarComentarioDTO } from './dto/comentario-criar.dto';
import { AtualizarComentarioDTO } from './dto/comentario-atualizar.dto';
import { CriarComentarioResponse } from './dto/comentario-response.dto';
import { ListarComentariosQueryDTO, ListarComentariosResponse, ComentarioItemResponse } from './dto/comentario-listar.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComentarioService {
  constructor(private readonly prisma: PrismaService) {}

  async criarComentario(comentarioDto: CriarComentarioDTO): Promise<CriarComentarioResponse> {
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

  async deletarComentario(id: string): Promise<void> {
    await this.prisma.comentarios.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });
  }

  async atualizarComentario(id: string, comentarioDto: AtualizarComentarioDTO): Promise<void> {
    await this.prisma.comentarios.update({
      where: { id: parseInt(id) },
      data: { 
        texto: comentarioDto.texto,
        updatedAt: new Date(),
      },
    });
  }

  async listarComentariosPorLivro(queryDto: ListarComentariosQueryDTO): Promise<ListarComentariosResponse> {
    const { livro, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    // Prepara o filtro de where, incluindo livro apenas se fornecido
    const whereClause: any = {
      isDeleted: false,
    };

    if (livro) {
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
