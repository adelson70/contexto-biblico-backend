import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, IsPositive } from "class-validator";
import { Type } from "class-transformer";

export class VincularReferenciaDTO {
    @ApiProperty({
        description: 'Referencia',
        example: 'João 1:1',
        required: true
    })
    @IsString({ message: 'A referencia deve ser uma string' })
    @IsNotEmpty({ message: 'A referencia não pode estar vazia' })
    referencia: string;

    @ApiProperty({
        description: 'Livro',
        example: 'genesis',
        required: true
    })
    @IsString({ message: 'O livro deve ser uma string' })
    @IsNotEmpty({ message: 'O livro não pode estar vazio' })
    livro: string;

    @ApiProperty({
        description: 'Número do capítulo',
        example: 1,
        required: true,
        type: Number
    })
    @Type(() => Number)
    @IsInt({ message: 'O capítulo deve ser um número inteiro' })
    @IsPositive({ message: 'O capítulo deve ser um número positivo' })
    capitulo: number;

    @ApiProperty({
        description: 'Número do versículo',
        example: 1,
        required: true,
        type: Number
    })
    @Type(() => Number)
    @IsInt({ message: 'O versículo deve ser um número inteiro' })
    @IsPositive({ message: 'O versículo deve ser um número positivo' })
    versiculo: number;
}

