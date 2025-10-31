import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token de acesso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    required: false,
  })
  nome?: string;

  @ApiProperty({
    description: 'Indica se o usuário é administrador',
    example: false,
  })
  isAdmin: boolean;

  @ApiProperty({
    description: 'IDs dos livros permitidos para o usuário (null para admin que tem acesso a todos)',
    example: [1, 2, 3],
    required: false,
    nullable: true,
  })
  livrosPermitidos: number[] | null;
}

