import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, IsPositive } from "class-validator";
import { Type } from "class-transformer";

export class CriarReferenciaDTO {
    @ApiProperty({
        description: 'Referencia',
        example: 'João 1:1',
        required: true
    })
    @IsString({ message: 'A referencia deve ser uma string' })
    @IsNotEmpty({ message: 'A referencia não pode estar vazia' })
    referencia: string;

    @ApiProperty({
        description: 'Slug do livro',
        example: 'genesis',
        required: true
    })
    @IsString({ message: 'O livroSlug deve ser uma string' })
    @IsNotEmpty({ message: 'O livroSlug não pode estar vazio' })
    livroSlug: string;

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
