import { ApiProperty } from '@nestjs/swagger';
import type { NomeLivro } from '../../../data/biblia-nvi.type';

export class LivroBiblicaloResponseDto {
  @ApiProperty({
    description: 'Nome do livro bíblico',
    example: 'Gênesis'
  })
  nome: NomeLivro;

  @ApiProperty({
    description: 'Quantidade de capítulos no livro',
    example: 50
  })
  quantidadeCapitulos: number;

  @ApiProperty({
    description: 'Nome do livro anterior na ordem bíblica (navegação cíclica)',
    example: 'Apocalipse'
  })
  livroAnterior: NomeLivro;

  @ApiProperty({
    description: 'Nome do próximo livro na ordem bíblica (navegação cíclica)',
    example: 'Êxodo'
  })
  proximoLivro: NomeLivro;
}
