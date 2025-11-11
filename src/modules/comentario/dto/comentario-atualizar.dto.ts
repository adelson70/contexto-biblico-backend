import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsObject } from "class-validator";
import type { Prisma } from "generated/prisma";

export class AtualizarComentarioDTO {
    @ApiProperty({
        description: 'Texto do comentário',
        example: 'Este é um comentário atualizado sobre o versículo',
        required: true
    })
    @IsString({ message: 'O texto deve ser uma string' })
    @IsNotEmpty({ message: 'O texto não pode estar vazio' })
    texto: string;

    @ApiProperty({
        description: 'Conteúdo rico do comentário em formato Draft.js',
        required: false,
        type: () => Object,
    })
    @IsOptional()
    @IsObject({ message: 'O richText deve ser um objeto válido' })
    richText?: Prisma.JsonValue;
}

