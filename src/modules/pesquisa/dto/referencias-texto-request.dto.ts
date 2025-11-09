import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsString,
} from 'class-validator';

export class ReferenciasTextoRequestDto {
  @ApiProperty({
    description: 'Lista de referências bíblicas a serem buscadas',
    example: ['João 3:16', 'Gênesis 1:1-3'],
    type: [String],
  })
  @IsArray({ message: 'As referências devem ser enviadas em formato de array' })
  @ArrayNotEmpty({ message: 'É necessário informar pelo menos uma referência' })
  @IsString({ each: true, message: 'Cada referência deve ser uma string' })
  referencias: string[];
}


