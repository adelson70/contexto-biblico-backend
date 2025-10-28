import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsPositive, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ListarReferenciasDTO {
  @ApiProperty({
    description: 'Número da página',
    example: 1,
    required: false,
    type: Number
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'Page deve ser um número inteiro' })
  @IsPositive({ message: 'Page deve ser um número positivo' })
  page?: number;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    example: 10,
    required: false,
    type: Number
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'Limit deve ser um número inteiro' })
  @IsPositive({ message: 'Limit deve ser um número positivo' })
  limit?: number;

  @ApiProperty({
    description: 'Filtro por livro',
    example: 'genesis',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'O livro deve ser uma string' })
  @IsNotEmpty({ message: 'O livro não pode estar vazio' })
  livro?: string;

  @ApiProperty({
    description: 'Filtro por capítulo',
    example: 1,
    required: false,
    type: Number
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'O capítulo deve ser um número inteiro' })
  @IsPositive({ message: 'O capítulo deve ser um número positivo' })
  capitulo?: number;

  @ApiProperty({
    description: 'Filtro por versículo',
    example: 1,
    required: false,
    type: Number
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'O versículo deve ser um número inteiro' })
  @IsPositive({ message: 'O versículo deve ser um número positivo' })
  versiculo?: number;
}

