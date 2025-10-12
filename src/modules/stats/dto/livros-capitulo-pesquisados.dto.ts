import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

class LivroCapituloPesquisaDTO {
  @ApiProperty({
    description: 'Livro e capítulo pesquisado',
    example: 'João:3',
    type: String,
  })
  livroCapitulo: string;

  @ApiProperty({
    description: 'Quantidade de pesquisas deste livro e capítulo',
    example: 125,
    type: Number,
  })
  quantidade: number;
}

export class LivrosCapituloPesquisadosResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo livros:capítulos e suas respectivas quantidades de pesquisas',
    type: [LivroCapituloPesquisaDTO],
    example: [
      { livroCapitulo: 'João:3', quantidade: 125 },
      { livroCapitulo: 'Gênesis:1', quantidade: 98 },
      { livroCapitulo: 'Mateus:5', quantidade: 87 },
      { livroCapitulo: 'Salmos:23', quantidade: 76 },
    ],
  })
  dados: LivroCapituloPesquisaDTO[];

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Top 10 livros e capítulos mais pesquisados recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

