import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../../common/services/bcrypt.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { CriarUsuarioResponseDto } from './dto/criar-usuario-response.dto';
import { DeletarUsuarioResponseDto } from './dto/deletar-usuario-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
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
        nome: criarUsuarioDto.nome || null,
        is_admin: criarUsuarioDto.is_admin || false,
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
}
