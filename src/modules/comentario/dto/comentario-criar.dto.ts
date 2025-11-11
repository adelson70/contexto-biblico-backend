import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, IsPositive, Length, IsOptional, IsObject } from "class-validator";
import { Type } from "class-transformer";
import { SanitizeText } from "../../../common/decorators/sanitize-text.decorator";
import type { Prisma } from "generated/prisma";

export class CriarComentarioDTO {
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

    @ApiProperty({
        description: 'Texto do comentário',
        example: 'Este é um comentário sobre o versículo',
        required: true
    })
    @IsString({ message: 'O texto deve ser uma string' })
    @IsNotEmpty({ message: 'O texto não pode estar vazio' })
    @SanitizeText()
    @Length(1, 3000, { message: 'O texto deve ter entre 1 e 3000 caracteres' })
    texto: string;

    @ApiProperty({
        description: 'Conteúdo rico do comentário em formato Draft.js',
        required: false,
        type: () => Object,
        example: {
            blocks: [
                {
                    key: 'example',
                    text: 'Comentário com formatação',
                    type: 'unstyled',
                    depth: 0,
                    inlineStyleRanges: [{ offset: 0, length: 9, style: 'BOLD' }],
                    entityRanges: [],
                    data: {}
                }
            ],
            entityMap: {}
        }
    })
    @IsOptional()
    @IsObject({ message: 'O richText deve ser um objeto válido' })
    richText?: Prisma.JsonValue;
}

