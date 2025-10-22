import { Controller, Delete, Logger, Param, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiBearerAuth } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { CriarUsuarioResponseDto } from './dto/criar-usuario-response.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { DeletarUsuarioResponseDto } from './dto/deletar-usuario-response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AdminGuard } from '../../guards/admin.guard';

@ApiTags('Usuário')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private logger: Logger,
  ) {}

  @Post('criar')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar um novo usuário (somente admin)' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: CriarUsuarioResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - somente administradores',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso',
  })
  async criarUsuario(
    @Body() criarUsuarioDto: CriarUsuarioDto,
  ): Promise<CriarUsuarioResponseDto> {
    this.logger.log(`Criando usuário: ${criarUsuarioDto.email}`);
    return this.authService.criarUsuario(criarUsuarioDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Fazer login' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    this.logger.log(`Tentativa de login: ${loginDto.email}`);
    
    const result = await this.authService.login(loginDto);
    
    // Obter o refresh token do AuthService
    const payload = {
      sub: result.userId,
      email: result.email,
      isAdmin: result.isAdmin,
    };
    const tokens = await this.authService.refreshTokens(
      result.userId,
      result.email,
      result.isAdmin,
    );

    // Configurar cookie HttpOnly com o refresh token
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    this.logger.log(`Login bem-sucedido: ${loginDto.email}`);
    
    return {
      accessToken: tokens.accessToken,
      userId: result.userId,
      email: result.email,
      nome: result.nome,
      isAdmin: result.isAdmin,
    };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('refresh_token')
  @ApiOperation({ summary: 'Renovar access token usando refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Token renovado com sucesso',
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido ou expirado',
  })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshResponseDto> {
    const user = request.user as any;
    this.logger.log(`Renovando token para usuário: ${user.email}`);

    const result = await this.authService.refreshTokens(
      user.userId,
      user.email,
      user.isAdmin,
    );

    // Atualizar o cookie com o novo refresh token (rotação)
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    return {
      accessToken: result.accessToken,
      userId: result.userId,
      email: result.email,
      nome: result.nome ?? undefined,
      isAdmin: result.isAdmin,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Fazer logout e limpar tokens' })
  @ApiResponse({
    status: 200,
    description: 'Logout realizado com sucesso',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LogoutResponseDto> {
    const user = request.user as any;
    this.logger.log(`Logout do usuário: ${user.email}`);

    // Remover o refresh token do banco de dados
    await this.authService.removeRefreshToken(user.userId);

    // Limpar o cookie
    response.clearCookie('refresh_token', {
      httpOnly: true,
      path: '/',
    });

    return {
      message: 'Logout realizado com sucesso',
    };
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Deletar um usuário (somente admin)' })
  @ApiResponse({
    status: 200,
    description: 'Usuário deletado com sucesso',
    type: DeletarUsuarioResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - somente administradores',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async deletarUsuario(
    @Param('id') id: string,
  ): Promise<DeletarUsuarioResponseDto> {
    this.logger.log(`Deletando usuário: ${id}`);
    return this.authService.deletarUsuario(id);
  }
}
