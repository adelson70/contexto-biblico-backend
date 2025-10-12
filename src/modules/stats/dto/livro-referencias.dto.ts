import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

// DTO para referências totais
export class ReferenciasTotalResponseDTO {
  @ApiProperty({
    description: 'Total de referências',
    example: 1542,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Referências totais recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

// DTO para referências por livro
class LivroReferenciaDTO {
  @ApiProperty({
    description: 'Nome do livro',
    example: 'João',
    type: String,
  })
  livro: string;

  @ApiProperty({
    description: 'Quantidade de referências deste livro',
    example: 87,
    type: Number,
  })
  quantidade: number;
}

export class ReferenciasPorLivroResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo livros e suas respectivas quantidades de referências',
    type: [LivroReferenciaDTO],
    example: [
      { livro: 'João', quantidade: 87 },
      { livro: 'Gênesis', quantidade: 65 },
      { livro: 'Mateus', quantidade: 54 },
      { livro: 'Salmos', quantidade: 43 },
    ],
  })
  dados: LivroReferenciaDTO[];

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Top 10 livros com mais referências recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

// DTO para referências por capítulo
class LivroCapituloReferenciaDTO {
  @ApiProperty({
    description: 'Nome do livro e capítulo',
    example: 'João: 3',
    type: String,
  })
  livroCapitulo: string;

  @ApiProperty({
    description: 'Quantidade de referências deste livro e capítulo',
    example: 25,
    type: Number,
  })
  quantidade: number;
}

export class ReferenciasPorCapituloResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo livros com capítulos e suas respectivas quantidades de referências',
    type: [LivroCapituloReferenciaDTO],
    example: [
      { livroCapitulo: 'João: 3', quantidade: 25 },
      { livroCapitulo: 'Gênesis: 1', quantidade: 22 },
      { livroCapitulo: 'Mateus: 5', quantidade: 18 },
      { livroCapitulo: 'Salmos: 23', quantidade: 15 },
    ],
  })
  dados: LivroCapituloReferenciaDTO[];

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Top 10 livros e capítulos com mais referências recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

// DTO para referências por versículo
class LivroCapituloVersiculoReferenciaDTO {
  @ApiProperty({
    description: 'Nome do livro, capítulo e versículo',
    example: 'João: 3:16',
    type: String,
  })
  livroCapituloVersiculo: string;

  @ApiProperty({
    description: 'Quantidade de referências deste livro, capítulo e versículo',
    example: 12,
    type: Number,
  })
  quantidade: number;
}

export class ReferenciasPorVersiculoResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo livros com capítulos e versículos e suas respectivas quantidades de referências',
    type: [LivroCapituloVersiculoReferenciaDTO],
    example: [
      { livroCapituloVersiculo: 'João: 3:16', quantidade: 12 },
      { livroCapituloVersiculo: 'Gênesis: 1:1', quantidade: 10 },
      { livroCapituloVersiculo: 'Mateus: 5:3', quantidade: 8 },
      { livroCapituloVersiculo: 'Salmos: 23:1', quantidade: 7 },
    ],
  })
  dados: LivroCapituloVersiculoReferenciaDTO[];

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Top 10 livros, capítulos e versículos com mais referências recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

