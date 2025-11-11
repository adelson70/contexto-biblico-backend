import { ApiProperty } from "@nestjs/swagger";
import type { Prisma } from "generated/prisma";

export class CriarComentarioResponse {
    @ApiProperty({
        description: 'ID do comentário',
        example: 1
    })
    id: number;

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
        description: 'Texto do comentário',
        example: 'Este é um comentário sobre o versículo'
    })
    texto: string;

    @ApiProperty({
        description: 'Conteúdo rico do comentário em formato Draft.js',
        required: false,
        type: () => Object,
    })
    richText?: Prisma.JsonValue | null;

    @ApiProperty({
        description: 'Mensagem personalizada (opcional)',
        example: 'Comentário criado com sucesso',
        required: false,
    })
    message?: string;
}

