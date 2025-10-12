import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

class LivroPesquisaDTO {
  @ApiProperty({
    description: 'Nome do livro',
    example: 'João',
    type: String,
  })
  livro: string;

  @ApiProperty({
    description: 'Quantidade de pesquisas deste livro',
    example: 523,
    type: Number,
  })
  quantidade: number;
}

export class LivrosPesquisadosResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo livros e suas respectivas quantidades de pesquisas',
    type: [LivroPesquisaDTO],
    example: [
      { livro: 'João', quantidade: 523 },
      { livro: 'Gênesis', quantidade: 487 },
      { livro: 'Mateus', quantidade: 412 },
      { livro: 'Salmos', quantidade: 398 },
    ],
  })
  dados: LivroPesquisaDTO[];

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Top 10 livros mais pesquisados recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

