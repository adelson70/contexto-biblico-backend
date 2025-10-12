import { Injectable } from '@nestjs/common';
import { CriarComentarioDTO } from './dto/comentario-criar.dto';
import { AtualizarComentarioDTO } from './dto/comentario-atualizar.dto';
import { CriarComentarioResponse } from './dto/comentario-response.dto';
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
}
