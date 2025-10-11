import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class AtualizarComentarioDTO {
    @ApiProperty({
        description: 'Texto do comentário',
        example: 'Este é um comentário atualizado sobre o versículo',
        required: true
    })
    @IsString({ message: 'O texto deve ser uma string' })
    @IsNotEmpty({ message: 'O texto não pode estar vazio' })
    texto: string;
}

