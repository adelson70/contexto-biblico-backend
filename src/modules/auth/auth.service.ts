import { Injectable, ConflictException, NotFoundException, ForbiddenException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../../common/services/bcrypt.service';
import { GeolocalizacaoService } from '../../common/services/geolocalizacao.service';
import { ConviteService } from '../convite/convite.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { CriarUsuarioResponseDto } from './dto/criar-usuario-response.dto';
import { DeletarUsuarioResponseDto } from './dto/deletar-usuario-response.dto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { AtualizarUsuarioResponseDto } from './dto/atualizar-usuario-response.dto';
import { ListarUsuariosResponseDto } from './dto/listar-usuarios-response.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { VincularLivroUsuarioResponseDto } from './dto/vincular-livro-usuario.dto';
import { DesvincularLivroUsuarioResponseDto } from './dto/desvincular-livro-usuario.dto';
import { ListarLivrosUsuarioResponseDto } from './dto/listar-livros-usuario.dto';
import { CriarUsuarioPorConviteDto } from './dto/criar-usuario-por-convite.dto';
import { CriarUsuarioPorConviteResponseDto } from './dto/criar-usuario-por-convite-response.dto';
import { TipoAcessoLivros } from '../convite/dto/criar-convite.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly geolocalizacaoService: GeolocalizacaoService,
    private readonly conviteService: ConviteService,
  ) {}

  /**
   * Cria um novo usuário no sistema
   * @param criarUsuarioDto - Dados do usuário a ser criado
   * @returns Dados do usuário criado
   * @throws ConflictException se o email já estiver em uso
   */
  async criarUsuario(criarUsuarioDto: CriarUsuarioDto): Promise<CriarUsuarioResponseDto> {
    // Verificar se o email já existe
    const usuarioExistente = await this.prisma.usuarios.findUnique({
      where: { email: criarUsuarioDto.email },
    });

    if (usuarioExistente) {
      throw new ConflictException('Email já está em uso');
    }

    // Hashear a senha
    const senhaHash = await this.bcryptService.hash(criarUsuarioDto.senha);

    // Criar o usuário no banco de dados
    const usuario = await this.prisma.usuarios.create({
      data: {
        email: criarUsuarioDto.email,
        senha: senhaHash,
        nome: criarUsuarioDto.nome,
        is_admin: criarUsuarioDto.is_admin ?? false, // Se não fornecido, default é false
      },
    });

    // Retornar os dados do usuário (sem a senha)
    return {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      createdAt: usuario.createdAt,
      is_admin: usuario.is_admin,
    };
  }

  /**
   * Lista todos os usuários não deletados do sistema com paginação e filtros
   * @param page - Número da página (default: 1)
   * @param limit - Limite de itens por página (default: 10)
   * @param nome - Filtrar por nome (opcional)
   * @param email - Filtrar por email (opcional)
   * @returns Lista de usuários e informações de paginação
   */
  async listarUsuarios(page: number = 1, limit: number = 10, nome?: string, email?: string): Promise<ListarUsuariosResponseDto> {
    // Calcular o offset
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = { isDeleted: false };

    if (nome) {
      where.nome = {
        contains: nome,
        mode: 'insensitive',
      };
    }

    if (email) {
      where.email = {
        contains: email,
        mode: 'insensitive',
      };
    }

    // Buscar total de usuários não deletados
    const total = await this.prisma.usuarios.count({
      where,
    });

    // Buscar usuários paginados
    const usuarios = await this.prisma.usuarios.findMany({
      where,
      select: {
        id: true,
        email: true,
        nome: true,
        is_admin: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Calcular total de páginas
    const totalPages = Math.ceil(total / limit);

    return {
      usuarios,
      total,
      totalPages,
      currentPage: page,
      limit,
    };
  }

  async atualizarUsuario(id: string, atualizarUsuarioDto: AtualizarUsuarioDto): Promise<AtualizarUsuarioResponseDto> {
    const usuarioId = parseInt(id, 10);

    if (isNaN(usuarioId)) {
      throw new NotFoundException('ID de usuário inválido');
    }

    // Verificar se o usuário existe
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario || usuario.isDeleted) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Preparar dados para atualização
    const dadosAtualizacao: any = {};

    // Verificar se o email foi fornecido e se está disponível
    if (atualizarUsuarioDto.email && atualizarUsuarioDto.email !== usuario.email) {
      const emailJaExiste = await this.prisma.usuarios.findUnique({
        where: { email: atualizarUsuarioDto.email },
      });

      if (emailJaExiste) {
        throw new ConflictException('Email já está em uso por outro usuário');
      }

      dadosAtualizacao.email = atualizarUsuarioDto.email;
    }

    // Atualizar nome se fornecido
    if (atualizarUsuarioDto.nome !== undefined) {
      dadosAtualizacao.nome = atualizarUsuarioDto.nome || null;
    }

    // Atualizar senha se fornecida
    if (atualizarUsuarioDto.senha) {
      const senhaHash = await this.bcryptService.hash(atualizarUsuarioDto.senha);
      dadosAtualizacao.senha = senhaHash;
    }

    // Atualizar privilégio se fornecido
    if (atualizarUsuarioDto.is_admin !== undefined) {
      dadosAtualizacao.is_admin = atualizarUsuarioDto.is_admin;
    }

    // Se não houver nada para atualizar, retornar os dados atuais
    if (Object.keys(dadosAtualizacao).length === 0) {
      return {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        updatedAt: usuario.updatedAt,
        is_admin: usuario.is_admin,
        message: 'Nenhuma alteração foi fornecida',
      };
    }

    // Atualizar o usuário
    const usuarioAtualizado = await this.prisma.usuarios.update({
      where: { id: usuarioId },
      data: dadosAtualizacao,
    });

    return {
      id: usuarioAtualizado.id,
      email: usuarioAtualizado.email,
      nome: usuarioAtualizado.nome,
      updatedAt: usuarioAtualizado.updatedAt,
      is_admin: usuarioAtualizado.is_admin,
      message: 'Usuário atualizado com sucesso',
    };
  }

  /**
   * Atualiza os dados do próprio usuário (auto-edição)
   * Não permite alterar is_admin
   * @param userId - ID do usuário autenticado
   * @param atualizarUsuarioDto - Dados para atualização
   * @returns Dados do usuário atualizado
   * @throws NotFoundException se o usuário não existir
   * @throws ConflictException se o email já estiver em uso
   */
  async atualizarMeuUsuario(userId: number, atualizarUsuarioDto: AtualizarUsuarioDto): Promise<AtualizarUsuarioResponseDto> {
    // Verificar se o usuário existe
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: userId },
    });

    if (!usuario || usuario.isDeleted) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Preparar dados para atualização (não permitir alterar is_admin)
    const dadosAtualizacao: any = {};

    // Verificar se o email foi fornecido e se está disponível
    if (atualizarUsuarioDto.email && atualizarUsuarioDto.email !== usuario.email) {
      const emailJaExiste = await this.prisma.usuarios.findUnique({
        where: { email: atualizarUsuarioDto.email },
      });

      if (emailJaExiste) {
        throw new ConflictException('Email já está em uso por outro usuário');
      }

      dadosAtualizacao.email = atualizarUsuarioDto.email;
    }

    // Atualizar nome se fornecido
    if (atualizarUsuarioDto.nome !== undefined) {
      dadosAtualizacao.nome = atualizarUsuarioDto.nome || null;
    }

    // Atualizar senha se fornecida
    if (atualizarUsuarioDto.senha) {
      const senhaHash = await this.bcryptService.hash(atualizarUsuarioDto.senha);
      dadosAtualizacao.senha = senhaHash;
    }

    // Não permitir alterar is_admin - ignorar se fornecido
    // (usuários comuns não podem se tornar admin)

    // Se não houver nada para atualizar, retornar os dados atuais
    if (Object.keys(dadosAtualizacao).length === 0) {
      return {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        updatedAt: usuario.updatedAt,
        is_admin: usuario.is_admin,
        message: 'Nenhuma alteração foi fornecida',
      };
    }

    // Atualizar o usuário
    const usuarioAtualizado = await this.prisma.usuarios.update({
      where: { id: userId },
      data: dadosAtualizacao,
    });

    return {
      id: usuarioAtualizado.id,
      email: usuarioAtualizado.email,
      nome: usuarioAtualizado.nome,
      updatedAt: usuarioAtualizado.updatedAt,
      is_admin: usuarioAtualizado.is_admin,
      message: 'Perfil atualizado com sucesso',
    };
  }

  /**
   * Lista os livros do próprio usuário autenticado
   * @param userId - ID do usuário autenticado
   * @returns Lista de livros do usuário
   * @throws NotFoundException se o usuário não existir
   */
  async listarMeusLivros(userId: number): Promise<ListarLivrosUsuarioResponseDto> {
    // Verificar se o usuário existe
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: userId },
    });

    if (!usuario || usuario.isDeleted) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Buscar livros vinculados
    const livros = await this.prisma.usuario_livros.findMany({
      where: {
        usuario_id: userId,
      },
      orderBy: {
        livro_id: 'asc',
      },
    });

    return {
      livros,
      total: livros.length,
    };
  }

  /**
   * Deleta um usuário do sistema
   * @param id - ID do usuário a ser deletado
   * @returns Confirmação de deleção
   * @throws NotFoundException se o usuário não existir
   */
  async deletarUsuario(id: string): Promise<DeletarUsuarioResponseDto> {
    const usuarioId = parseInt(id, 10);

    if (isNaN(usuarioId)) {
      throw new NotFoundException('ID de usuário inválido');
    }

    // Verificar se o usuário existe
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId, is_admin: false },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (usuario.is_admin) {
      throw new ForbiddenException('Usuário admin não pode ser deletado');
    }

    // Deletar o usuário
    await this.prisma.usuarios.update({
      where: { id: usuarioId },
      data: { isDeleted: true },
    });

    return {
      id: usuarioId,
      message: 'Usuário deletado com sucesso',
    };
  }

  async validateUser(email: string, senha: string) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { email },
    });

    if (!usuario || usuario.isDeleted) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await this.bcryptService.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      isAdmin: usuario.is_admin,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // Validar o usuário
    const usuario = await this.validateUser(loginDto.email, loginDto.senha);

    // Gerar os tokens
    const payload: JwtPayload = {
      sub: usuario.id,
      email: usuario.email,
      isAdmin: usuario.isAdmin,
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    // Salvar o hash do refresh token no banco de dados
    await this.setCurrentRefreshToken(usuario.id, refreshToken);

    // Buscar livros permitidos (apenas para usuários não-admin)
    let livrosPermitidos: number[] | null = null;
    if (!usuario.isAdmin) {
      const livrosPermissoes = await this.prisma.usuario_livros.findMany({
        where: {
          usuario_id: usuario.id,
        },
        select: {
          livro_id: true,
        },
        orderBy: {
          livro_id: 'asc',
        },
      });
      livrosPermitidos = livrosPermissoes.map(permissao => permissao.livro_id);
    }

    return {
      accessToken,
      userId: usuario.id,
      email: usuario.email,
      nome: usuario.nome ?? undefined,
      isAdmin: usuario.isAdmin,
      livrosPermitidos,
    };
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(
      { sub: payload.sub, email: payload.email, isAdmin: payload.isAdmin } as any,
      {
        secret: process.env.JWT_ACCESS_SECRET || 'your-secret-key-change-this',
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
      } as any,
    );
  }

  private async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(
      { sub: payload.sub, email: payload.email, isAdmin: payload.isAdmin } as any,
      {
        secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-this',
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      } as any,
    );
  }

  async setCurrentRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const refreshTokenHash = await this.bcryptService.hash(refreshToken);

    await this.prisma.usuarios.update({
      where: { id: userId },
      data: { refresh_token_hash: refreshTokenHash },
    });
  }

  async getUserIfRefreshTokenMatches(userId: number, refreshToken: string) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: userId },
    });

    if (!usuario || usuario.isDeleted || !usuario.refresh_token_hash) {
      return null;
    }

    const isRefreshTokenMatching = await this.bcryptService.compare(
      refreshToken,
      usuario.refresh_token_hash,
    );

    if (!isRefreshTokenMatching) {
      return null;
    }

    return {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      isAdmin: usuario.is_admin,
    };
  }

  async refreshTokens(userId: number, email: string, isAdmin: boolean) {
    const payload: JwtPayload = {
      sub: userId,
      email,
      isAdmin,
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    // Atualizar o refresh token no banco (rotação)
    await this.setCurrentRefreshToken(userId, refreshToken);

    // Buscar dados completos do usuário
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nome: true,
        is_admin: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Buscar livros permitidos (apenas para usuários não-admin)
    let livrosPermitidos: number[] | null = null;
    if (!isAdmin) {
      const livrosPermissoes = await this.prisma.usuario_livros.findMany({
        where: {
          usuario_id: userId,
        },
        select: {
          livro_id: true,
        },
        orderBy: {
          livro_id: 'asc',
        },
      });
      livrosPermitidos = livrosPermissoes.map(permissao => permissao.livro_id);
    }

    return {
      accessToken,
      refreshToken,
      userId: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      isAdmin: usuario.is_admin,
      livrosPermitidos: livrosPermitidos !== null ? livrosPermitidos : null,
    };
  }
  async removeRefreshToken(userId: number): Promise<void> {
    await this.prisma.usuarios.update({
      where: { id: userId },
      data: { refresh_token_hash: null },
    });
  }

  async validateRefreshToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-this',
      });
      return payload as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Registra um login de usuário com IP, cidade e estado
   * @param userId - ID do usuário
   * @param ip - Endereço IP do usuário
   * @returns Registro de login criado
   */
  async registrarLogin(userId: number, ip: string): Promise<void> {
    try {
      // Obtém geolocalização do IP
      const geolocalizacao = this.geolocalizacaoService.obterGeolocalizacao(ip);

      // Cria o registro de login
      await this.prisma.usuario_logins.create({
        data: {
          usuario_id: userId,
          ip: ip,
          cidade: geolocalizacao.cidade,
          estado: geolocalizacao.estado,
        },
      });
    } catch (error) {
      // Não deixa o erro de registro impactar o login
      // Apenas loga o erro silenciosamente
      console.error('Erro ao registrar login:', error);
    }
  }

  /**
   * Vincula um livro a um usuário
   * @param usuarioId - ID do usuário
   * @param livroId - ID do livro (1 a 66)
   * @returns Dados do registro criado
   * @throws NotFoundException se o usuário não existir
   * @throws ConflictException se o livro já estiver vinculado
   */
  async vincularLivroUsuario(usuarioId: number, livroId: number): Promise<VincularLivroUsuarioResponseDto> {
    // Verificar se o usuário existe
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario || usuario.isDeleted) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o livro já está vinculado
    const livroVinculado = await this.prisma.usuario_livros.findUnique({
      where: {
        usuario_id_livro_id: {
          usuario_id: usuarioId,
          livro_id: livroId,
        },
      },
    });

    if (livroVinculado) {
      throw new ConflictException('Livro já está vinculado a este usuário');
    }

    // Vincular o livro
    const registro = await this.prisma.usuario_livros.create({
      data: {
        usuario_id: usuarioId,
        livro_id: livroId,
      },
    });

    return {
      id: registro.id,
      usuario_id: registro.usuario_id,
      livro_id: registro.livro_id,
      createdAt: registro.createdAt,
      message: 'Livro vinculado com sucesso',
    };
  }

  /**
   * Desvincula um livro de um usuário
   * @param usuarioId - ID do usuário
   * @param livroId - ID do livro (1 a 66)
   * @returns Confirmação de desvinculação
   * @throws NotFoundException se o vínculo não existir
   */
  async desvincularLivroUsuario(usuarioId: number, livroId: number): Promise<DesvincularLivroUsuarioResponseDto> {
    // Verificar se o vínculo existe
    const livroVinculado = await this.prisma.usuario_livros.findUnique({
      where: {
        usuario_id_livro_id: {
          usuario_id: usuarioId,
          livro_id: livroId,
        },
      },
    });

    if (!livroVinculado) {
      throw new NotFoundException('Vínculo não encontrado');
    }

    // Desvincular o livro
    await this.prisma.usuario_livros.delete({
      where: {
        usuario_id_livro_id: {
          usuario_id: usuarioId,
          livro_id: livroId,
        },
      },
    });

    return {
      message: 'Livro desvinculado com sucesso',
    };
  }

  /**
   * Lista todos os livros vinculados a um usuário
   * @param usuarioId - ID do usuário
   * @returns Lista de livros do usuário
   * @throws NotFoundException se o usuário não existir
   */
  async listarLivrosUsuario(usuarioId: number): Promise<ListarLivrosUsuarioResponseDto> {
    // Verificar se o usuário existe
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario || usuario.isDeleted) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Buscar livros vinculados
    const livros = await this.prisma.usuario_livros.findMany({
      where: {
        usuario_id: usuarioId,
      },
      orderBy: {
        livro_id: 'asc',
      },
    });

    return {
      livros,
      total: livros.length,
    };
  }

  /**
   * Cria um novo usuário através de um convite
   * @param hashOuSlug - Hash ou slug do convite
   * @param criarUsuarioDto - Dados do usuário a ser criado
   * @returns Dados do usuário criado
   * @throws NotFoundException se o convite não existir
   * @throws ForbiddenException se o convite estiver inválido/expirado
   * @throws ConflictException se o email já estiver em uso
   * @throws BadRequestException se livros_ids for obrigatório mas não fornecido (tipo LIVRE)
   */
  async criarUsuarioPorConvite(
    hashOuSlug: string,
    criarUsuarioDto: CriarUsuarioPorConviteDto,
  ): Promise<CriarUsuarioPorConviteResponseDto> {
    // Validar o convite
    const convite = await this.conviteService.validarConvite(hashOuSlug);

    // Verificar se o convite é válido e não expirado
    if (!convite.valido) {
      throw new ForbiddenException('Convite expirado ou inválido');
    }

    // Se tipo é LIVRE, validar que livros_ids foi fornecido
    if (convite.tipo_acesso_livros === TipoAcessoLivros.LIVRE) {
      if (!criarUsuarioDto.livros_ids || criarUsuarioDto.livros_ids.length === 0) {
        throw new BadRequestException('livros_ids é obrigatório quando tipo_acesso_livros é LIVRE. Selecione pelo menos um livro.');
      }

      // Validar que todos os livros estão entre 1 e 66
      const livrosInvalidos = criarUsuarioDto.livros_ids.filter(id => id < 1 || id > 66);
      if (livrosInvalidos.length > 0) {
        throw new BadRequestException(`IDs de livros inválidos: ${livrosInvalidos.join(', ')}. Os IDs devem estar entre 1 e 66.`);
      }
    }

    // Verificar se o email já existe
    const usuarioExistente = await this.prisma.usuarios.findUnique({
      where: { email: criarUsuarioDto.email },
    });

    if (usuarioExistente) {
      throw new ConflictException('Email já está em uso');
    }

    // Hashear a senha
    const senhaHash = await this.bcryptService.hash(criarUsuarioDto.senha);

    // Criar usuário e aplicar permissões em transação
    const resultado = await this.prisma.$transaction(async (prisma) => {
      // Criar o usuário
      const usuario = await prisma.usuarios.create({
        data: {
          email: criarUsuarioDto.email,
          senha: senhaHash,
          nome: criarUsuarioDto.nome,
          is_admin: false, // Usuários criados por convite nunca são admin
        },
      });

      // Aplicar permissões de livros baseado no tipo de acesso
      if (convite.tipo_acesso_livros === TipoAcessoLivros.TODOS) {
        // Vincular todos os livros (1-66)
        const livrosData = Array.from({ length: 66 }, (_, i) => ({
          usuario_id: usuario.id,
          livro_id: i + 1,
        }));
        await prisma.usuario_livros.createMany({
          data: livrosData,
        });
      } else if (convite.tipo_acesso_livros === TipoAcessoLivros.ESPECIFICO) {
        // Vincular apenas livros do convite
        const livrosData = convite.livros.map((livro) => ({
          usuario_id: usuario.id,
          livro_id: livro.livro_id,
        }));
        if (livrosData.length > 0) {
          await prisma.usuario_livros.createMany({
            data: livrosData,
          });
        }
      } else if (convite.tipo_acesso_livros === TipoAcessoLivros.LIVRE) {
        // Vincular apenas os livros escolhidos pelo usuário
        const livrosData = criarUsuarioDto.livros_ids!.map((livroId) => ({
          usuario_id: usuario.id,
          livro_id: livroId,
        }));
        await prisma.usuario_livros.createMany({
          data: livrosData,
        });
      }

      // Incrementar contador de usos do convite
      await prisma.convites.update({
        where: { id: convite.id },
        data: {
          usos_realizados: {
            increment: 1,
          },
        },
      });

      return usuario;
    });

    return {
      id: resultado.id,
      email: resultado.email,
      nome: resultado.nome,
      createdAt: resultado.createdAt,
      is_admin: resultado.is_admin,
      message: 'Usuário criado com sucesso através do convite',
    };
  }
}
