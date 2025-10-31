import { ApiProperty } from '@nestjs/swagger';

export class LivroUsuarioItemDto {
  @ApiProperty({
    description: 'ID do registro',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID do livro (1 a 66)',
    example: 1,
  })
  livro_id: number;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-10-11T10:00:00.000Z',
  })
  createdAt: Date;
}

export class ListarLivrosUsuarioResponseDto {
  @ApiProperty({
    description: 'Lista de livros do usuário',
    type: [LivroUsuarioItemDto],
  })
  livros: LivroUsuarioItemDto[];

  @ApiProperty({
    description: 'Total de livros',
    example: 5,
  })
  total: number;
}

