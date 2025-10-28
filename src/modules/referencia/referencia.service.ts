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
