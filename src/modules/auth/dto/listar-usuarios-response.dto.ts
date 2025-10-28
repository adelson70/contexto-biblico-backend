import { ApiProperty } from '@nestjs/swagger';

export class UsuarioItemDto {
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
    description: 'Se o usuário é admin',
    example: false,
  })
  is_admin: boolean;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2025-10-11T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização do usuário',
    example: '2025-10-11T10:00:00.000Z',
  })
  updatedAt: Date;
}

export class ListarUsuariosResponseDto {
  @ApiProperty({
    description: 'Lista de usuários',
    type: [UsuarioItemDto],
  })
  usuarios: UsuarioItemDto[];

  @ApiProperty({
    description: 'Total de usuários encontrados',
    example: 10,
  })
  total: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 2,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Limite de itens por página',
    example: 10,
  })
  limit: number;
}

