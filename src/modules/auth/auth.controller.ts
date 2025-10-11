import { Controller, Delete, Logger, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { CriarUsuarioResponseDto } from './dto/criar-usuario-response.dto';
import { LoginDto } from './dto/login.dto';
import { DeletarUsuarioResponseDto } from './dto/deletar-usuario-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private logger: Logger,
  ) {}

  @Post('criar')
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: CriarUsuarioResponseDto,
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

  // @Post('login')
  // @ApiOperation({ summary: 'Fazer login' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Login realizado com sucesso',
  // })
  // async login(@Body() loginDto: LoginDto): Promise<string> {
  //   // TODO: Implementar lógica de login
  //   return 'Login endpoint - a ser implementado';
  // }

  // @Post('logout/:id')
  // logout(@Param('id') id: string): string {
  //   return this.authService.logout(id);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário deletado com sucesso',
    type: DeletarUsuarioResponseDto,
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

  // TODO: Implementar refresh token agora não
  // @Get('refresh-token')
  // refreshToken(): string {
  //   return this.authService.refreshToken();
  // }
}
