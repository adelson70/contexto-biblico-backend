import { ApiProperty } from "@nestjs/swagger";
import type { NomeLivro, AbreviacaoLivro, Versiculo } from "../../../data/biblia-nvi.type";

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
    description: 'Versículos do capítulo',
    type: 'array',
    items: {
      type: 'string'
    },
    example: [
      'No princípio Deus criou os céus e a terra.',
      'Era a terra sem forma e vazia; trevas cobriam a face do abismo, e o Espírito de Deus se movia sobre a face das águas.'
    ]
  })
  versiculos: Versiculo[];

  @ApiProperty({
    description: 'Total de versículos no capítulo',
    example: 31
  })
  totalVersiculos: number;
}

