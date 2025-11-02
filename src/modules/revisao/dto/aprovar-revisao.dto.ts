import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, MaxLength } from "class-validator";
import { TipoRevisaoEnum, StatusRevisaoEnum } from "./listar-revisao.dto";

export class AprovarRevisaoDTO {
  @ApiProperty({
    description: 'Motivo da aprovação (opcional)',
    example: 'Conteúdo aprovado conforme diretrizes',
    required: false,
    maxLength: 500
  })
  @IsOptional()
  @IsString({ message: 'O motivo deve ser uma string' })
  @MaxLength(500, { message: 'O motivo deve ter no máximo 500 caracteres' })
  motivo?: string;
}

export class AprovarRevisaoResponse {
  @ApiProperty({
    description: 'ID da revisão',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Tipo da revisão',
    enum: TipoRevisaoEnum,
    example: 'COMENTARIO'
  })
  tipo: TipoRevisaoEnum;

  @ApiProperty({
    description: 'Status atualizado',
    enum: StatusRevisaoEnum,
    example: 'APROVADO'
  })
  status: StatusRevisaoEnum;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Revisão aprovada com sucesso'
  })
  message: string;
}
