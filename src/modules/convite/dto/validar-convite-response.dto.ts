import { ApiProperty } from '@nestjs/swagger';
import { TipoAcessoLivros } from './criar-convite.dto';

export class LivroPermitidoDto {
  @ApiProperty({
    description: 'ID do vínculo',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID do livro',
    example: 1,
  })
  livro_id: number;

  @ApiProperty({
    description: 'Data de criação do vínculo',
    example: '2025-10-11T10:00:00.000Z',
  })
  createdAt: Date;
}

export class ValidarConviteResponseDto {
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
    description: 'Hash do convite (se existir)',
    example: 'abc123xyz',
    nullable: true,
  })
  hash: string | null;

  @ApiProperty({
    description: 'Slug personalizado',
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
    description: 'Lista de livros permitidos (apenas se tipo_acesso_livros = ESPECIFICO)',
    type: [LivroPermitidoDto],
  })
  livros: LivroPermitidoDto[];

  @ApiProperty({
    description: 'Se o convite é válido',
    example: true,
  })
  valido: boolean;
}

