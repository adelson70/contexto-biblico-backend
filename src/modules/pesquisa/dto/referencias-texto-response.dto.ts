import { ApiProperty } from '@nestjs/swagger';
import type { NomeLivro } from '../../../data/biblia-nvi.type';

export class ReferenciaTextoVersiculoDto {
  @ApiProperty({
    description: 'Número do versículo',
    example: 16,
  })
  numero: number;

  @ApiProperty({
    description: 'Texto do versículo',
    example: 'Porque Deus amou o mundo de tal maneira...',
  })
  texto: string;
}

export class ReferenciaTextoDto {
  @ApiProperty({
    description: 'Referência bíblica solicitada',
    example: 'João 3:16-18',
  })
  referenciaSolicitada: string;

  @ApiProperty({
    description: 'Nome normalizado do livro bíblico',
    example: 'João',
  })
  livro: NomeLivro;

  @ApiProperty({
    description: 'Número do capítulo',
    example: 3,
  })
  capitulo: number;

  @ApiProperty({
    description: 'Versículos encontrados para a referência',
    type: [ReferenciaTextoVersiculoDto],
  })
  versiculos: ReferenciaTextoVersiculoDto[];
}


