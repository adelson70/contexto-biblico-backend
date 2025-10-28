import { ApiProperty } from "@nestjs/swagger";

export class VincularReferenciaResponseDTO {
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
        description: 'Mensagem',
        example: 'Referência vinculada com sucesso',
        required: false,
    })
    message?: string;
}

