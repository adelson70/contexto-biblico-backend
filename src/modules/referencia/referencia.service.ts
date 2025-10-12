import { Injectable } from '@nestjs/common';
import { CriarReferenciaDTO } from './dto/referencia-criar.dto';
import { CriarReferenciaResponse } from './dto/referencia-response.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferenciaService {
  constructor(private readonly prisma: PrismaService) {}
  async criarReferencia(referenciaDto: CriarReferenciaDTO): Promise<CriarReferenciaResponse> {

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

  async deletarReferencia(id: string): Promise<void> {
    await this.prisma.referencias.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });
  }
}
