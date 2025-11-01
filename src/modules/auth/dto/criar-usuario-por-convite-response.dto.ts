import { ApiProperty } from '@nestjs/swagger';

export class CriarUsuarioPorConviteResponseDto {
  @ApiProperty({
    description: 'ID do usuário criado',
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
    description: 'Data de criação',
    example: '2025-01-11T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Se o usuário é admin',
    example: false,
  })
  is_admin: boolean;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Usuário criado com sucesso através do convite',
    required: false,
  })
  message?: string;
}

