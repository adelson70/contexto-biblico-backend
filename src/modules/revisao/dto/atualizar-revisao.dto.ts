import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length, IsOptional, IsObject } from "class-validator";
import { SanitizeText } from "../../../common/decorators/sanitize-text.decorator";
import type { Prisma } from "generated/prisma";

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

  @ApiProperty({
    description: 'Nome do livro bíblico',
    example: 'Gênesis',
    required: false
  })
  @IsString({ message: 'O livro deve ser uma string' })
  livro?: string;

  @ApiProperty({
    description: 'Número do capítulo',
    example: 1,
    required: false
  })
  capitulo?: number;

  @ApiProperty({
    description: 'Número do versículo',
    example: 1,
    required: false
  })
  versiculo?: number;

  @ApiProperty({
    description: 'Conteúdo rico do comentário em formato Draft.js',
    required: false,
    type: () => Object,
  })
  @IsOptional()
  @IsObject({ message: 'O richText deve ser um objeto válido' })
  richText?: Prisma.JsonValue;
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

  @ApiProperty({
    description: 'Nome do livro bíblico',
    example: 'Gênesis',
    required: false
  })
  @IsString({ message: 'O livro deve ser uma string' })
  livro?: string;

  @ApiProperty({
    description: 'Número do capítulo',
    example: 1,
    required: false
  })
  capitulo?: number;

  @ApiProperty({
    description: 'Número do versículo',
    example: 1,
    required: false
  })
  versiculo?: number;
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
