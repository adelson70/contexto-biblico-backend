import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length } from "class-validator";
import { SanitizeText } from "../../../common/decorators/sanitize-text.decorator";

export class AtualizarComentarioRevisaoDTO {
  @ApiProperty({
    description: 'Texto do comentário atualizado',
    example: 'Este é um comentário atualizado sobre o versículo',
    required: true
  })
  @IsString({ message: 'O texto deve ser uma string' })
  @IsNotEmpty({ message: 'O texto não pode estar vazio' })
  @SanitizeText()
  @Length(1, 3000, { message: 'O texto deve ter entre 1 e 3000 caracteres' })
  texto: string;
}

export class AtualizarReferenciaRevisaoDTO {
  @ApiProperty({
    description: 'Referência atualizada',
    example: 'João 1:2',
    required: true
  })
  @IsString({ message: 'A referência deve ser uma string' })
  @IsNotEmpty({ message: 'A referência não pode estar vazia' })
  referencia: string;
}

export class AtualizarRevisaoResponse {
  @ApiProperty({
    description: 'ID da revisão',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Tipo da revisão',
    example: 'COMENTARIO'
  })
  tipo: string;

  @ApiProperty({
    description: 'Dados atualizados',
    example: { texto: 'Texto atualizado' }
  })
  dados: any;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Revisão atualizada com sucesso'
  })
  message: string;
}
