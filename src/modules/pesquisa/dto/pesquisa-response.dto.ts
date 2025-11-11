import { ApiProperty } from "@nestjs/swagger";
import type { NomeLivro, AbreviacaoLivro } from "../../../data/biblia-nvi.type";
import type { Prisma } from "generated/prisma";

export class VersiculoComentarioDto {
  @ApiProperty({
    description: 'Texto puro do comentário',
    example: 'Este versículo fala sobre a criação'
  })
  texto: string;

  @ApiProperty({
    description: 'Conteúdo rico do comentário em formato Draft.js',
    required: false,
    type: () => Object,
  })
  richText?: Prisma.JsonValue | null;
}

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
    type: [VersiculoComentarioDto],
    example: [
      {
        texto: 'Comentário resumido',
        richText: {
          blocks: [
            {
              key: 'abc',
              text: 'Comentário resumido',
              type: 'unstyled',
              depth: 0,
              inlineStyleRanges: [{ offset: 0, length: 9, style: 'BOLD' }],
              entityRanges: [],
              data: {}
            }
          ],
          entityMap: {}
        }
      }
    ]
  })
  comentarios: VersiculoComentarioDto[];

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

  @ApiProperty({
    description: 'Mensagem personalizada (opcional)',
    example: 'Pesquisa realizada com sucesso',
    required: false,
  })
  message?: string;
}

