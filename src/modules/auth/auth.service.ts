import { Injectable, ConflictException, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../../common/services/bcrypt.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { CriarUsuarioResponseDto } from './dto/criar-usuario-response.dto';
import { DeletarUsuarioResponseDto } from './dto/deletar-usuario-response.dto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { AtualizarUsuarioResponseDto } from './dto/atualizar-usuario-response.dto';
import { ListarUsuariosResponseDto } from './dto/listar-usuarios-response.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
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

    // Criar o usuário no banco de dados (sempre como não-admin)
    const usuario = await this.prisma.usuarios.create({
      data: {
        email: criarUsuarioDto.email,
        senha: senhaHash,
        nome: criarUsuarioDto.nome || null,
        is_admin: false, // Usuários criados são sempre não-admin
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

    return {
      accessToken,
      userId: usuario.id,
      email: usuario.email,
      nome: usuario.nome ?? undefined,
      isAdmin: usuario.isAdmin,
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

    return {
      accessToken,
      refreshToken,
      userId: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      isAdmin: usuario.is_admin,
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
}
