import { ApiProperty } from '@nestjs/swagger';
import { TipoAcessoLivros } from './criar-convite.dto';

export class ConviteListItemDto {
  @ApiProperty({
    description: 'ID do convite',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome do convite',
    example: 'Convite para Pastores',
  })
  nome: string;

  @ApiProperty({
    description: 'Hash única do convite (se existir)',
    example: 'abc123xyz',
    nullable: true,
  })
  hash: string | null;

  @ApiProperty({
    description: 'Slug personalizado (se fornecido)',
    example: 'convite-pastores',
    nullable: true,
  })
  slug_personalizado: string | null;

  @ApiProperty({
    description: 'Tipo de acesso aos livros',
    enum: TipoAcessoLivros,
    example: TipoAcessoLivros.TODOS,
  })
  tipo_acesso_livros: TipoAcessoLivros;

  @ApiProperty({
    description: 'Data de expiração',
    example: '2025-12-31T23:59:59.000Z',
    nullable: true,
  })
  expira_em: Date | null;

  @ApiProperty({
    description: 'Número de usos realizados',
    example: 5,
  })
  usos_realizados: number;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-10-11T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Quantidade de livros vinculados',
    example: 3,
  })
  livros_count: number;
}

export class ListarConvitesResponseDto {
  @ApiProperty({
    description: 'Lista de convites',
    type: [ConviteListItemDto],
  })
  convites: ConviteListItemDto[];

  @ApiProperty({
    description: 'Total de convites',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 3,
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

