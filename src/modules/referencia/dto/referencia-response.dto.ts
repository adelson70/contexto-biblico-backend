import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class CriarReferenciaResponse {
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
}
