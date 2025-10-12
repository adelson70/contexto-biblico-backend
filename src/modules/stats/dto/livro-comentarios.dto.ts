import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

// DTO para comentários totais
export class ComentariosTotalResponseDTO {
  @ApiProperty({
    description: 'Total de comentários',
    example: 1542,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Comentários totais recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

// DTO para comentários por livro
class LivroComentarioDTO {
  @ApiProperty({
    description: 'Nome do livro',
    example: 'João',
    type: String,
  })
  livro: string;

  @ApiProperty({
    description: 'Quantidade de comentários deste livro',
    example: 87,
    type: Number,
  })
  quantidade: number;
}

export class ComentariosPorLivroResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo livros e suas respectivas quantidades de comentários',
    type: [LivroComentarioDTO],
    example: [
      { livro: 'João', quantidade: 87 },
      { livro: 'Gênesis', quantidade: 65 },
      { livro: 'Mateus', quantidade: 54 },
      { livro: 'Salmos', quantidade: 43 },
    ],
  })
  dados: LivroComentarioDTO[];

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Top 10 livros com mais comentários recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

// DTO para comentários por capítulo
class LivroCapituloComentarioDTO {
  @ApiProperty({
    description: 'Nome do livro e capítulo',
    example: 'João: 3',
    type: String,
  })
  livroCapitulo: string;

  @ApiProperty({
    description: 'Quantidade de comentários deste livro e capítulo',
    example: 25,
    type: Number,
  })
  quantidade: number;
}

export class ComentariosPorCapituloResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo livros com capítulos e suas respectivas quantidades de comentários',
    type: [LivroCapituloComentarioDTO],
    example: [
      { livroCapitulo: 'João: 3', quantidade: 25 },
      { livroCapitulo: 'Gênesis: 1', quantidade: 22 },
      { livroCapitulo: 'Mateus: 5', quantidade: 18 },
      { livroCapitulo: 'Salmos: 23', quantidade: 15 },
    ],
  })
  dados: LivroCapituloComentarioDTO[];

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Top 10 livros e capítulos com mais comentários recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

// DTO para comentários por versículo
class LivroCapituloVersiculoComentarioDTO {
  @ApiProperty({
    description: 'Nome do livro, capítulo e versículo',
    example: 'João: 3:16',
    type: String,
  })
  livroCapituloVersiculo: string;

  @ApiProperty({
    description: 'Quantidade de comentários deste livro, capítulo e versículo',
    example: 12,
    type: Number,
  })
  quantidade: number;
}

export class ComentariosPorVersiculoResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo livros com capítulos e versículos e suas respectivas quantidades de comentários',
    type: [LivroCapituloVersiculoComentarioDTO],
    example: [
      { livroCapituloVersiculo: 'João: 3:16', quantidade: 12 },
      { livroCapituloVersiculo: 'Gênesis: 1:1', quantidade: 10 },
      { livroCapituloVersiculo: 'Mateus: 5:3', quantidade: 8 },
      { livroCapituloVersiculo: 'Salmos: 23:1', quantidade: 7 },
    ],
  })
  dados: LivroCapituloVersiculoComentarioDTO[];

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Top 10 livros, capítulos e versículos com mais comentários recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

