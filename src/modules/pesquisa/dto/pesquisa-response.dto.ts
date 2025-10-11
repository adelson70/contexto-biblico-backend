import { ApiProperty } from "@nestjs/swagger";
import type { NomeLivro, AbreviacaoLivro } from "../../../data/biblia-nvi.type";

export class VersiculoComDados {
  @ApiProperty({
    description: 'Número do versículo',
    example: 1
  })
  numero: number;

  @ApiProperty({
    description: 'Texto do versículo',
    example: 'No princípio Deus criou os céus e a terra.'
  })
  texto: string;

  @ApiProperty({
    description: 'Comentários associados ao versículo',
    type: [String],
    example: ['Este versículo fala sobre a criação']
  })
  comentarios: string[];

  @ApiProperty({
    description: 'Referências bíblicas relacionadas ao versículo',
    type: [String],
    example: ['João 1:1', 'Hebreus 11:3']
  })
  referencias: string[];
}

export class PesquisaResponseDto {
  @ApiProperty({
    description: 'Nome completo do livro bíblico',
    example: 'Gênesis'
  })
  livro: NomeLivro;

  @ApiProperty({
    description: 'Abreviação do livro bíblico',
    example: 'gn'
  })
  abreviacao: AbreviacaoLivro;

  @ApiProperty({
    description: 'Número do capítulo',
    example: 1
  })
  capitulo: number;

  @ApiProperty({
    description: 'Versículos do capítulo com seus comentários e referências',
    type: [VersiculoComDados],
    example: [
      {
        numero: 1,
        texto: 'No princípio Deus criou os céus e a terra.',
        comentarios: ['Este versículo fala sobre a criação'],
        referencias: ['João 1:1', 'Hebreus 11:3']
      }
    ]
  })
  versiculos: VersiculoComDados[];

  @ApiProperty({
    description: 'Total de versículos no capítulo',
    example: 31
  })
  totalVersiculos: number;
}

