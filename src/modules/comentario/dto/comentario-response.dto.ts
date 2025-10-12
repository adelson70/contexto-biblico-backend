import { ApiProperty } from "@nestjs/swagger";

export class CriarComentarioResponse {
    @ApiProperty({
        description: 'ID do comentário',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Slug do livro',
        example: 'genesis'
    })
    livroSlug: string;

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
        description: 'Mensagem personalizada (opcional)',
        example: 'Comentário criado com sucesso',
        required: false,
    })
    message?: string;
}

