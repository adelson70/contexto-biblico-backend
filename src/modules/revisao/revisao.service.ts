import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  ListarRevisaoQueryDTO, 
  ListarRevisaoResponse, 
  RevisaoItemResponse,
  TipoRevisaoEnum,
  StatusRevisaoEnum 
} from './dto/listar-revisao.dto';
import { ObterRevisaoResponse } from './dto/obter-revisao.dto';
import { AprovarRevisaoDTO, AprovarRevisaoResponse } from './dto/aprovar-revisao.dto';
import { ReprovarRevisaoDTO, ReprovarRevisaoResponse } from './dto/reprovar-revisao.dto';
import { AtualizarComentarioRevisaoDTO, AtualizarReferenciaRevisaoDTO, AtualizarRevisaoResponse } from './dto/atualizar-revisao.dto';

@Injectable()
export class RevisaoService {
  constructor(private readonly prisma: PrismaService) {}

  async listarRevisoes(queryDto: ListarRevisaoQueryDTO): Promise<ListarRevisaoResponse> {
    const { page = 1, limit = 10, status, tipo, search, nomeUsuario } = queryDto;
    const skip = (page - 1) * limit;

    // Se houver filtro por search ou nomeUsuario, buscar IDs dos usuários primeiro
    let usuarioIds: number[] | null = null;
    const searchTerm = search || nomeUsuario;
    if (searchTerm) {
      const usuarios = await this.prisma.usuarios.findMany({
        where: {
          OR: [
            { nome: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } }
          ],
          isDeleted: false,
        },
        select: { id: true },
      });
      usuarioIds = usuarios.map(u => u.id);
      // Se não encontrou nenhum usuário e há busca, não retornar vazio ainda (pode encontrar pelo conteúdo)
    }

    // Buscar comentários de revisão
    const comentariosWhere: any = {};
    // Se não houver filtro de status, mostrar apenas pendentes por padrão
    comentariosWhere.status = status || StatusRevisaoEnum.NAO_REVISADO;
    
    // Se houver search ou nomeUsuario, buscar tanto no conteúdo quanto nos usuários
    if (searchTerm) {
      const orConditions: any[] = [];
      
      // Sempre busca no conteúdo (texto para comentários, referencia para referências)
      // Usa search se disponível, senão usa searchTerm (que pode ser nomeUsuario)
      const searchText = search || searchTerm;
      orConditions.push({ texto: { contains: searchText, mode: 'insensitive' } });
      
      // Se encontrou usuários, adiciona busca por usuários
      if (usuarioIds && usuarioIds.length > 0) {
        orConditions.push({ criado_por_id: { in: usuarioIds } });
      }
      
      // Sempre aplica OR quando há busca
      comentariosWhere.OR = orConditions;
    }

    // Buscar referências de revisão
    const referenciasWhere: any = {};
    // Se não houver filtro de status, mostrar apenas pendentes por padrão
    referenciasWhere.status = status || StatusRevisaoEnum.NAO_REVISADO;
    
    // Se houver search ou nomeUsuario, buscar tanto na referência quanto nos usuários
    if (searchTerm) {
      const orConditions: any[] = [];
      
      // Sempre busca no conteúdo (referencia para referências)
      // Usa search se disponível, senão usa searchTerm (que pode ser nomeUsuario)
      const searchText = search || searchTerm;
      orConditions.push({ referencia: { contains: searchText, mode: 'insensitive' } });
      
      // Se encontrou usuários, adiciona busca por usuários
      if (usuarioIds && usuarioIds.length > 0) {
        orConditions.push({ criado_por_id: { in: usuarioIds } });
      }
      
      // Sempre aplica OR quando há busca
      referenciasWhere.OR = orConditions;
    }

    let comentarios: any[] = [];
    let referencias: any[] = [];

    // Buscar comentários se tipo não especificado ou tipo for COMENTARIO
    if (!tipo || tipo === TipoRevisaoEnum.COMENTARIO) {
      comentarios = await this.prisma.comentario_revisao.findMany({
        where: comentariosWhere,
        include: {
          criado_por: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          revisado_por: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Buscar referências se tipo não especificado ou tipo for REFERENCIA
    if (!tipo || tipo === TipoRevisaoEnum.REFERENCIA) {
      referencias = await this.prisma.referencia_revisao.findMany({
        where: referenciasWhere,
        include: {
          criado_por: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          revisado_por: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Transformar comentários para formato de resposta
    const comentariosFormatados: RevisaoItemResponse[] = comentarios.map((item) => ({
      id: item.id,
      tipo: TipoRevisaoEnum.COMENTARIO,
      dados: {
        livro: item.livro,
        capitulo: item.capitulo,
        versiculo: item.versiculo,
        texto: item.texto,
      },
      status: item.status as StatusRevisaoEnum,
      motivo: item.motivo,
      criadoPor: {
        id: item.criado_por.id,
        nome: item.criado_por.nome,
        email: item.criado_por.email,
      },
      revisadoPor: item.revisado_por
        ? {
            id: item.revisado_por.id,
            nome: item.revisado_por.nome,
            email: item.revisado_por.email,
          }
        : null,
      createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
      revisadoEm: item.revisado_em instanceof Date ? item.revisado_em.toISOString() : item.revisado_em,
    }));

    // Transformar referências para formato de resposta
    const referenciasFormatadas: RevisaoItemResponse[] = referencias.map((item) => ({
      id: item.id,
      tipo: TipoRevisaoEnum.REFERENCIA,
      dados: {
        livro: item.livro,
        capitulo: item.capitulo,
        versiculo: item.versiculo,
        referencia: item.referencia,
      },
      status: item.status as StatusRevisaoEnum,
      motivo: item.motivo,
      criadoPor: {
        id: item.criado_por.id,
        nome: item.criado_por.nome,
        email: item.criado_por.email,
      },
      revisadoPor: item.revisado_por
        ? {
            id: item.revisado_por.id,
            nome: item.revisado_por.nome,
            email: item.revisado_por.email,
          }
        : null,
      createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
      revisadoEm: item.revisado_em instanceof Date ? item.revisado_em.toISOString() : item.revisado_em,
    }));

    // Combinar e ordenar por data de criação (usar string para comparação)
    const todasRevisoes = [...comentariosFormatados, ...referenciasFormatadas].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Aplicar paginação manual (já que combinamos duas queries)
    const total = todasRevisoes.length;
    const dadosPaginados = todasRevisoes.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data: dadosPaginados,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async obterRevisaoPorId(id: number, tipo: TipoRevisaoEnum): Promise<ObterRevisaoResponse> {
    if (tipo === TipoRevisaoEnum.COMENTARIO) {
      const revisao = await this.prisma.comentario_revisao.findUnique({
        where: { id },
        include: {
          criado_por: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          revisado_por: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });

      if (!revisao) {
        throw new NotFoundException('Revisão de comentário não encontrada');
      }

      return {
        id: revisao.id,
        tipo: TipoRevisaoEnum.COMENTARIO,
        dados: {
          livro: revisao.livro,
          capitulo: revisao.capitulo,
          versiculo: revisao.versiculo,
          texto: revisao.texto,
        },
        status: revisao.status as StatusRevisaoEnum,
        motivo: revisao.motivo,
        criadoPor: {
          id: revisao.criado_por.id,
          nome: revisao.criado_por.nome,
          email: revisao.criado_por.email,
        },
        revisadoPor: revisao.revisado_por
          ? {
              id: revisao.revisado_por.id,
              nome: revisao.revisado_por.nome,
              email: revisao.revisado_por.email,
            }
          : null,
        createdAt: revisao.createdAt instanceof Date ? revisao.createdAt.toISOString() : revisao.createdAt,
        updatedAt: revisao.updatedAt instanceof Date ? revisao.updatedAt.toISOString() : revisao.updatedAt,
        revisadoEm: revisao.revisado_em instanceof Date ? revisao.revisado_em.toISOString() : revisao.revisado_em,
      };
    } else {
      const revisao = await this.prisma.referencia_revisao.findUnique({
        where: { id },
        include: {
          criado_por: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          revisado_por: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });

      if (!revisao) {
        throw new NotFoundException('Revisão de referência não encontrada');
      }

      return {
        id: revisao.id,
        tipo: TipoRevisaoEnum.REFERENCIA,
        dados: {
          livro: revisao.livro,
          capitulo: revisao.capitulo,
          versiculo: revisao.versiculo,
          referencia: revisao.referencia,
        },
        status: revisao.status as StatusRevisaoEnum,
        motivo: revisao.motivo,
        criadoPor: {
          id: revisao.criado_por.id,
          nome: revisao.criado_por.nome,
          email: revisao.criado_por.email,
        },
        revisadoPor: revisao.revisado_por
          ? {
              id: revisao.revisado_por.id,
              nome: revisao.revisado_por.nome,
              email: revisao.revisado_por.email,
            }
          : null,
        createdAt: revisao.createdAt instanceof Date ? revisao.createdAt.toISOString() : revisao.createdAt,
        updatedAt: revisao.updatedAt instanceof Date ? revisao.updatedAt.toISOString() : revisao.updatedAt,
        revisadoEm: revisao.revisado_em instanceof Date ? revisao.revisado_em.toISOString() : revisao.revisado_em,
      };
    }
  }

  async aprovarRevisao(
    id: number,
    tipo: TipoRevisaoEnum,
    dto: AprovarRevisaoDTO,
    revisadorId: number,
  ): Promise<AprovarRevisaoResponse> {
    if (tipo === TipoRevisaoEnum.COMENTARIO) {
      const revisao = await this.prisma.comentario_revisao.findUnique({
        where: { id },
      });

      if (!revisao) {
        throw new NotFoundException('Revisão de comentário não encontrada');
      }

      if (revisao.status !== StatusRevisaoEnum.NAO_REVISADO) {
        throw new BadRequestException('Apenas revisões não revisadas podem ser aprovadas');
      }

      // Criar comentário na tabela principal
      await this.prisma.comentarios.create({
        data: {
          livro: revisao.livro,
          capitulo: revisao.capitulo,
          versiculo: revisao.versiculo,
          texto: revisao.texto,
        },
      });

      // Atualizar status para APROVADO mantendo o registro no banco
      await this.prisma.comentario_revisao.update({
        where: { id },
        data: {
          status: StatusRevisaoEnum.APROVADO,
          motivo: dto.motivo || null,
          revisado_por_id: revisadorId,
          revisado_em: new Date(),
        },
      });

      return {
        id,
        tipo: TipoRevisaoEnum.COMENTARIO,
        status: StatusRevisaoEnum.APROVADO,
        message: 'Comentário aprovado e publicado com sucesso',
      };
    } else {
      const revisao = await this.prisma.referencia_revisao.findUnique({
        where: { id },
      });

      if (!revisao) {
        throw new NotFoundException('Revisão de referência não encontrada');
      }

      if (revisao.status !== StatusRevisaoEnum.NAO_REVISADO) {
        throw new BadRequestException('Apenas revisões não revisadas podem ser aprovadas');
      }

      // Criar referência na tabela principal
      await this.prisma.referencias.create({
        data: {
          livro: revisao.livro,
          capitulo: revisao.capitulo,
          versiculo: revisao.versiculo,
          referencia: revisao.referencia,
        },
      });

      // Atualizar status para APROVADO mantendo o registro no banco
      await this.prisma.referencia_revisao.update({
        where: { id },
        data: {
          status: StatusRevisaoEnum.APROVADO,
          motivo: dto.motivo || null,
          revisado_por_id: revisadorId,
          revisado_em: new Date(),
        },
      });

      return {
        id,
        tipo: TipoRevisaoEnum.REFERENCIA,
        status: StatusRevisaoEnum.APROVADO,
        message: 'Referência aprovada e publicada com sucesso',
      };
    }
  }

  async reprovarRevisao(
    id: number,
    tipo: TipoRevisaoEnum,
    dto: ReprovarRevisaoDTO,
    revisadorId: number,
  ): Promise<ReprovarRevisaoResponse> {
    if (tipo === TipoRevisaoEnum.COMENTARIO) {
      const revisao = await this.prisma.comentario_revisao.findUnique({
        where: { id },
      });

      if (!revisao) {
        throw new NotFoundException('Revisão de comentário não encontrada');
      }

      if (revisao.status !== StatusRevisaoEnum.NAO_REVISADO) {
        throw new BadRequestException('Apenas revisões não revisadas podem ser reprovadas');
      }

      await this.prisma.comentario_revisao.update({
        where: { id },
        data: {
          status: StatusRevisaoEnum.REPROVADO,
          motivo: dto.motivo || null,
          revisado_por_id: revisadorId,
          revisado_em: new Date(),
        },
      });

      return {
        id,
        tipo: TipoRevisaoEnum.COMENTARIO,
        status: StatusRevisaoEnum.REPROVADO,
        message: 'Revisão reprovada com sucesso',
      };
    } else {
      const revisao = await this.prisma.referencia_revisao.findUnique({
        where: { id },
      });

      if (!revisao) {
        throw new NotFoundException('Revisão de referência não encontrada');
      }

      if (revisao.status !== StatusRevisaoEnum.NAO_REVISADO) {
        throw new BadRequestException('Apenas revisões não revisadas podem ser reprovadas');
      }

      await this.prisma.referencia_revisao.update({
        where: { id },
        data: {
          status: StatusRevisaoEnum.REPROVADO,
          motivo: dto.motivo || null,
          revisado_por_id: revisadorId,
          revisado_em: new Date(),
        },
      });

      return {
        id,
        tipo: TipoRevisaoEnum.REFERENCIA,
        status: StatusRevisaoEnum.REPROVADO,
        message: 'Revisão reprovada com sucesso',
      };
    }
  }

  async atualizarRevisao(
    id: number,
    tipo: TipoRevisaoEnum,
    dto: AtualizarComentarioRevisaoDTO | AtualizarReferenciaRevisaoDTO,
  ): Promise<AtualizarRevisaoResponse> {
    if (tipo === TipoRevisaoEnum.COMENTARIO) {
      const revisao = await this.prisma.comentario_revisao.findUnique({
        where: { id },
      });

      if (!revisao) {
        throw new NotFoundException('Revisão de comentário não encontrada');
      }

      if (revisao.status !== StatusRevisaoEnum.NAO_REVISADO) {
        throw new BadRequestException('Apenas revisões não revisadas podem ser editadas');
      }

      const comentarioDto = dto as AtualizarComentarioRevisaoDTO;

      const dataUpdate: any = {
        texto: comentarioDto.texto,
        updatedAt: new Date(),
      };

      // Atualizar livro, capítulo e versículo se fornecidos
      if (comentarioDto.livro !== undefined) {
        dataUpdate.livro = comentarioDto.livro;
      }
      if (comentarioDto.capitulo !== undefined) {
        dataUpdate.capitulo = comentarioDto.capitulo;
      }
      if (comentarioDto.versiculo !== undefined) {
        dataUpdate.versiculo = comentarioDto.versiculo;
      }

      const revisaoAtualizada = await this.prisma.comentario_revisao.update({
        where: { id },
        data: dataUpdate,
      });

      return {
        id,
        tipo: TipoRevisaoEnum.COMENTARIO,
        dados: {
          livro: revisaoAtualizada.livro,
          capitulo: revisaoAtualizada.capitulo,
          versiculo: revisaoAtualizada.versiculo,
          texto: revisaoAtualizada.texto,
        },
        message: 'Revisão atualizada com sucesso',
      };
    } else {
      const revisao = await this.prisma.referencia_revisao.findUnique({
        where: { id },
      });

      if (!revisao) {
        throw new NotFoundException('Revisão de referência não encontrada');
      }

      if (revisao.status !== StatusRevisaoEnum.NAO_REVISADO) {
        throw new BadRequestException('Apenas revisões não revisadas podem ser editadas');
      }

      const referenciaDto = dto as AtualizarReferenciaRevisaoDTO;

      const dataUpdate: any = {
        referencia: referenciaDto.referencia,
        updatedAt: new Date(),
      };

      // Atualizar livro, capítulo e versículo se fornecidos
      if (referenciaDto.livro !== undefined) {
        dataUpdate.livro = referenciaDto.livro;
      }
      if (referenciaDto.capitulo !== undefined) {
        dataUpdate.capitulo = referenciaDto.capitulo;
      }
      if (referenciaDto.versiculo !== undefined) {
        dataUpdate.versiculo = referenciaDto.versiculo;
      }

      const revisaoAtualizada = await this.prisma.referencia_revisao.update({
        where: { id },
        data: dataUpdate,
      });

      return {
        id,
        tipo: TipoRevisaoEnum.REFERENCIA,
        dados: {
          livro: revisaoAtualizada.livro,
          capitulo: revisaoAtualizada.capitulo,
          versiculo: revisaoAtualizada.versiculo,
          referencia: revisaoAtualizada.referencia,
        },
        message: 'Revisão atualizada com sucesso',
      };
    }
  }
}
