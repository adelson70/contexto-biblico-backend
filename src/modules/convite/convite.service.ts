import { Injectable, ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarConviteDto } from './dto/criar-convite.dto';
import { CriarConviteResponseDto } from './dto/criar-convite-response.dto';
import { AtualizarConviteDto } from './dto/atualizar-convite.dto';
import { AtualizarConviteResponseDto } from './dto/atualizar-convite-response.dto';
import { ListarConvitesResponseDto, ConviteListItemDto } from './dto/listar-convites-response.dto';
import { DeletarConviteResponseDto } from './dto/deletar-convite-response.dto';
import { ValidarConviteResponseDto, LivroPermitidoDto } from './dto/validar-convite-response.dto';
import { randomBytes } from 'crypto';
import { TipoAcessoLivros } from './dto/criar-convite.dto';

@Injectable()
export class ConviteService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Gera uma hash única aleatória para o convite
   */
  private generateHash(): string {
    return randomBytes(32).toString('base64url');
  }

  /**
   * Gera o link completo do convite
   */
  private generateLink(hash: string | null, slug?: string | null): string {
    const identifier = slug || hash;
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return `${baseUrl}/convite/${identifier}`;
  }

  /**
   * Cria um novo convite
   */
  async criarConvite(criarConviteDto: CriarConviteDto, criadoPor: number): Promise<CriarConviteResponseDto> {
    // Validar livros_ids se tipo_acesso_livros é ESPECIFICO
    if (criarConviteDto.tipo_acesso_livros === TipoAcessoLivros.ESPECIFICO) {
      if (!criarConviteDto.livros_ids || criarConviteDto.livros_ids.length === 0) {
        throw new BadRequestException('livros_ids é obrigatório quando tipo_acesso_livros é ESPECIFICO');
      }

      // Validar que todos os livros estão entre 1 e 66
      const livrosInvalidos = criarConviteDto.livros_ids.filter(id => id < 1 || id > 66);
      if (livrosInvalidos.length > 0) {
        throw new BadRequestException(`IDs de livros inválidos: ${livrosInvalidos.join(', ')}. Os IDs devem estar entre 1 e 66.`);
      }
    }

    // Validar slug_personalizado se fornecido
    if (criarConviteDto.slug_personalizado) {
      const slugExists = await this.prisma.convites.findUnique({
        where: { slug_personalizado: criarConviteDto.slug_personalizado },
      });

      if (slugExists) {
        throw new ConflictException('Slug personalizado já está em uso');
      }
    }

    // Gerar hash única apenas se não tiver slug
    let hash: string | null = null;
    if (!criarConviteDto.slug_personalizado) {
      hash = this.generateHash();
      let hashExists = await this.prisma.convites.findUnique({
        where: { hash },
      });

      // Garantir hash única (praticamente impossível colisão, mas segurança extra)
      let attempts = 0;
      while (hashExists && attempts < 10) {
        hash = this.generateHash();
        hashExists = await this.prisma.convites.findUnique({
          where: { hash },
        });
        attempts++;
      }

      if (hashExists) {
        throw new ConflictException('Erro ao gerar hash única. Tente novamente.');
      }
    }

    // Criar convite e livros em transação
    const resultado = await this.prisma.$transaction(async (prisma) => {
      // Criar o convite
      const convite = await prisma.convites.create({
        data: {
          nome: criarConviteDto.nome,
          hash,
          slug_personalizado: criarConviteDto.slug_personalizado || null,
          expira_em: criarConviteDto.expira_em || null,
          tipo_acesso_livros: criarConviteDto.tipo_acesso_livros,
          criado_por: criadoPor,
        },
      });

      // Criar vínculos com livros se tipo_acesso_livros é ESPECIFICO
      if (criarConviteDto.tipo_acesso_livros === TipoAcessoLivros.ESPECIFICO && criarConviteDto.livros_ids) {
        await prisma.convite_livros.createMany({
          data: criarConviteDto.livros_ids.map(livro_id => ({
            convite_id: convite.id,
            livro_id: livro_id,
          })),
        });
      }

      return convite;
    });

    return {
      id: resultado.id,
      nome: resultado.nome,
      hash: resultado.hash,
      slug_personalizado: resultado.slug_personalizado,
      tipo_acesso_livros: resultado.tipo_acesso_livros as TipoAcessoLivros,
      expira_em: resultado.expira_em,
      createdAt: resultado.createdAt,
      link: this.generateLink(resultado.hash, resultado.slug_personalizado),
    };
  }

  /**
   * Lista todos os convites não deletados com paginação e filtros
   */
  async listarConvites(page: number = 1, limit: number = 10, nome?: string): Promise<ListarConvitesResponseDto> {
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = { isDeleted: false };

    if (nome) {
      where.nome = {
        contains: nome,
        mode: 'insensitive',
      };
    }

    // Buscar total de convites não deletados
    const total = await this.prisma.convites.count({ where });

    // Buscar convites paginados
    const convites = await this.prisma.convites.findMany({
      where,
      select: {
        id: true,
        nome: true,
        hash: true,
        slug_personalizado: true,
        expira_em: true,
        tipo_acesso_livros: true,
        usos_realizados: true,
        createdAt: true,
        livros: {
          select: {
            id: true,
            livro_id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Calcular total de páginas
    const totalPages = Math.ceil(total / limit);

    // Mapear resultados
    const convitesList: ConviteListItemDto[] = convites.map(convite => ({
      id: convite.id,
      nome: convite.nome,
      hash: convite.hash,
      slug_personalizado: convite.slug_personalizado,
      expira_em: convite.expira_em,
      tipo_acesso_livros: convite.tipo_acesso_livros as TipoAcessoLivros,
      usos_realizados: convite.usos_realizados,
      createdAt: convite.createdAt,
      livros_count: convite.livros.length,
    }));

    return {
      convites: convitesList,
      total,
      totalPages,
      currentPage: page,
      limit,
    };
  }

  /**
   * Atualiza um convite
   */
  async atualizarConvite(id: number, atualizarConviteDto: AtualizarConviteDto): Promise<AtualizarConviteResponseDto> {
    // Verificar se o convite existe
    const convite = await this.prisma.convites.findUnique({
      where: { id },
    });

    if (!convite || convite.isDeleted) {
      throw new NotFoundException('Convite não encontrado');
    }

    // Preparar dados para atualização
    const dadosAtualizacao: any = {};

    if (atualizarConviteDto.nome !== undefined) {
      dadosAtualizacao.nome = atualizarConviteDto.nome;
    }

    if (atualizarConviteDto.expira_em !== undefined) {
      dadosAtualizacao.expira_em = atualizarConviteDto.expira_em;
    }

    // Se não houver nada para atualizar
    if (Object.keys(dadosAtualizacao).length === 0) {
      return {
        id: convite.id,
        nome: convite.nome,
        expira_em: convite.expira_em,
        updatedAt: convite.updatedAt,
        message: 'Nenhuma alteração foi fornecida',
      };
    }

    // Atualizar o convite
    const conviteAtualizado = await this.prisma.convites.update({
      where: { id },
      data: dadosAtualizacao,
    });

    return {
      id: conviteAtualizado.id,
      nome: conviteAtualizado.nome,
      expira_em: conviteAtualizado.expira_em,
      updatedAt: conviteAtualizado.updatedAt,
      message: 'Convite atualizado com sucesso',
    };
  }

  /**
   * Deleta um convite (soft delete)
   */
  async deletarConvite(id: number): Promise<DeletarConviteResponseDto> {
    // Verificar se o convite existe
    const convite = await this.prisma.convites.findUnique({
      where: { id },
    });

    if (!convite || convite.isDeleted) {
      throw new NotFoundException('Convite não encontrado');
    }

    // Soft delete
    await this.prisma.convites.update({
      where: { id },
      data: { isDeleted: true },
    });

    return {
      id,
      message: 'Convite deletado com sucesso',
    };
  }

  /**
   * Valida um convite pelo hash ou slug
   */
  async validarConvite(hashOuSlug: string): Promise<ValidarConviteResponseDto> {
    // Buscar por hash ou slug_personalizado
    const convite = await this.prisma.convites.findFirst({
      where: {
        OR: [
          { hash: hashOuSlug },
          { slug_personalizado: hashOuSlug },
        ],
      },
      include: {
        livros: {
          select: {
            id: true,
            livro_id: true,
            createdAt: true,
          },
        },
      },
    });

    if (!convite) {
      throw new NotFoundException('Convite não encontrado');
    }

    // Verificar se está deletado
    if (convite.isDeleted) {
      throw new ForbiddenException('Convite foi deletado');
    }

    // Verificar expiração (se tiver)
    let valido = true;
    if (convite.expira_em) {
      const agora = new Date();
      if (agora > convite.expira_em) {
        valido = false;
      }
    }

    // Mapear livros
    const livros: LivroPermitidoDto[] = convite.livros.map(l => ({
      id: l.id,
      livro_id: l.livro_id,
      createdAt: l.createdAt,
    }));

    return {
      id: convite.id,
      nome: convite.nome,
      hash: convite.hash,
      slug_personalizado: convite.slug_personalizado,
      tipo_acesso_livros: convite.tipo_acesso_livros as TipoAcessoLivros,
      expira_em: convite.expira_em,
      livros,
      valido,
    };
  }
}

