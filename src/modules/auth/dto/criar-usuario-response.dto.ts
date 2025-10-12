import { ApiProperty } from '@nestjs/swagger';

export class CriarUsuarioResponseDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    nullable: true,
  })
  nome: string | null;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2025-10-11T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Se o usuário é admin',
    example: true,
  })
  is_admin: boolean;

  @ApiProperty({
    description: 'Mensagem personalizada (opcional)',
    example: 'Usuário criado com sucesso',
    required: false,
  })
  message?: string;
}

