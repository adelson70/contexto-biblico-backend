import { ApiProperty } from '@nestjs/swagger';

export class ReferenciaItemDTO {
  @ApiProperty({
    description: 'ID da referência',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Referência',
    example: 'João 1:1'
  })
  referencia: string;

  @ApiProperty({
    description: 'Livro',
    example: 'genesis'
  })
  livro: string;

  @ApiProperty({
    description: 'Número do capítulo',
    example: 1
  })
  capitulo: number;

  @ApiProperty({
    description: 'Número do versículo',
    example: 1
  })
  versiculo: number;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-01T00:00:00.000Z'
  })
  updatedAt: Date;
}

export class ListarReferenciasResponseDTO {
  @ApiProperty({
    description: 'Lista de referências',
    type: [ReferenciaItemDTO]
  })
  data: ReferenciaItemDTO[];

  @ApiProperty({
    description: 'Metadados de paginação',
    example: {
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10
    }
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

