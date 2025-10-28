import { ApiProperty } from "@nestjs/swagger";

export class DesvincularReferenciaResponseDTO {
    @ApiProperty({
        description: 'ID da referência desvinculada',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Mensagem de confirmação',
        example: 'Referência desvinculada com sucesso'
    })
    message: string;
}

