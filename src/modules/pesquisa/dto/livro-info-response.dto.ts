import { ApiProperty } from '@nestjs/swagger';

export class CapituloInfoDto {
  @ApiProperty({
    description: 'Número do capítulo',
    example: 1
  })
  capitulo: number;

  @ApiProperty({
    description: 'Quantidade de versículos no capítulo',
    example: 31
  })
  versiculos: number;
}

export class LivroBiblicaloInfoResponseDto {
  @ApiProperty({
    description: 'ID do livro bíblico',
    example: '1'
  })
  livro_id: string;

  @ApiProperty({
    description: 'Informações sobre os capítulos do livro',
    type: [CapituloInfoDto],
    example: [
      { capitulo: 1, versiculos: 31 },
      { capitulo: 2, versiculos: 25 }
    ]
  })
  capitulos: CapituloInfoDto[];

  @ApiProperty({
    description: 'Total de capítulos no livro',
    example: 50
  })
  totalCapitulos: number;
}

