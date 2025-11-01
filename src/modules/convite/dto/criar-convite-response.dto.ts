import { ApiProperty } from '@nestjs/swagger';
import { TipoAcessoLivros } from './criar-convite.dto';

export class CriarConviteResponseDto {
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
    description: 'Hash única do convite (gerada automaticamente se não houver slug)',
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
    description: 'Data de criação',
    example: '2025-10-11T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Link completo do convite',
    example: 'http://localhost:5173/convite/abc123xyz',
  })
  link: string;
}

