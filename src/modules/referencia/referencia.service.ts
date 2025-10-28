import { Injectable } from '@nestjs/common';
import { CriarReferenciaDTO } from './dto/referencia-criar.dto';
import { CriarReferenciaResponse } from './dto/referencia-response.dto';
import { ListarReferenciasDTO } from './dto/listar-referencias.dto';
import { ListarReferenciasResponseDTO } from './dto/listar-referencias-response.dto';
import { VincularReferenciaDTO } from './dto/vincular-referencia.dto';
import { VincularReferenciaResponseDTO } from './dto/vincular-referencia-response.dto';
import { DesvincularReferenciaResponseDTO } from './dto/desvincular-referencia-response.dto';
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

  async listarReferencias(listarDto: ListarReferenciasDTO): Promise<ListarReferenciasResponseDTO> {
    const { page, limit, livro, capitulo, versiculo } = listarDto;

    // Construir filtros
    const where: any = {
      isDeleted: false,
    };

    if (livro) {
      where.livro = livro;
    }

    if (capitulo) {
      where.capitulo = capitulo;
    }

    if (versiculo) {
      where.versiculo = versiculo;
    }

    // Paginação
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit;

    // Buscar referências e total
    const [referencias, total] = await Promise.all([
      this.prisma.referencias.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.referencias.count({ where }),
    ]);

    const totalPages = limit ? Math.ceil(total / limit) : 1;

    return {
      data: referencias,
      meta: {
        total,
        page: page || 1,
        limit: limit || total,
        totalPages,
      },
    };
  }

  async vincularReferencia(referenciaDto: VincularReferenciaDTO): Promise<VincularReferenciaResponseDTO> {
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

  async desvincularReferencia(id: string): Promise<DesvincularReferenciaResponseDTO> {
    const idNumero = parseInt(id);
    
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
