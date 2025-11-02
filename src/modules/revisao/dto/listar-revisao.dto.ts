import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsPositive, Min, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export enum TipoRevisaoEnum {
  COMENTARIO = 'COMENTARIO',
  REFERENCIA = 'REFERENCIA',
}

export enum StatusRevisaoEnum {
  NAO_REVISADO = 'NAO_REVISADO',
  APROVADO = 'APROVADO',
  REPROVADO = 'REPROVADO',
}

export class ListarRevisaoQueryDTO {
  @ApiProperty({
    description: 'Número da página',
    example: 1,
    required: false,
    default: 1
  })
  @Type(() => Number)
  @IsOptional()
  @IsPositive({ message: 'A página deve ser um número positivo' })
  @Min(1, { message: 'A página deve ser pelo menos 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Número de itens por página',
    example: 10,
    required: false,
    default: 10
  })
  @Type(() => Number)
  @IsOptional()
  @IsPositive({ message: 'O limite deve ser um número positivo' })
  @Min(1, { message: 'O limite deve ser pelo menos 1' })
  limit?: number = 10;

  @ApiProperty({
    description: 'Filtro por status da revisão',
    example: 'NAO_REVISADO',
    enum: StatusRevisaoEnum,
    required: false
  })
  @IsOptional()
  @IsEnum(StatusRevisaoEnum, { message: 'Status deve ser NAO_REVISADO, APROVADO ou REPROVADO' })
  status?: StatusRevisaoEnum;

  @ApiProperty({
    description: 'Filtro por tipo de revisão',
    example: 'COMENTARIO',
    enum: TipoRevisaoEnum,
    required: false
  })
  @IsOptional()
  @IsEnum(TipoRevisaoEnum, { message: 'Tipo deve ser COMENTARIO ou REFERENCIA' })
  tipo?: TipoRevisaoEnum;

  @ApiProperty({
    description: 'Busca por conteúdo (texto do comentário ou referência)',
    example: 'criação',
    required: false
  })
  @Type(() => String)
  @IsOptional()
  @IsString({ message: 'A busca deve ser uma string' })
  search?: string;

  @ApiProperty({
    description: 'Filtro por nome do usuário que criou',
    example: 'João Silva',
    required: false
  })
  @Type(() => String)
  @IsOptional()
  @IsString({ message: 'O nome do usuário deve ser uma string' })
  nomeUsuario?: string;
}

export class UsuarioRevisaoResponse {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva'
  })
  nome: string | null;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@example.com'
  })
  email: string;
}

export class ComentarioRevisaoDados {
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
}

export class ReferenciaRevisaoDados {
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
    description: 'Texto da referência',
    example: 'João 1:1'
  })
  referencia: string;
}

export class RevisaoItemResponse {
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
    description: 'Dados do comentário ou referência',
    oneOf: [
      { $ref: '#/components/schemas/ComentarioRevisaoDados' },
      { $ref: '#/components/schemas/ReferenciaRevisaoDados' }
    ]
  })
  dados: ComentarioRevisaoDados | ReferenciaRevisaoDados;

  @ApiProperty({
    description: 'Status da revisão',
    enum: StatusRevisaoEnum,
    example: 'NAO_REVISADO'
  })
  status: StatusRevisaoEnum;

  @ApiProperty({
    description: 'Motivo da aprovação/reprovação',
    example: 'Aprovado conforme diretrizes',
    required: false
  })
  motivo?: string | null;

  @ApiProperty({
    description: 'Usuário que criou',
    type: UsuarioRevisaoResponse
  })
  criadoPor: UsuarioRevisaoResponse;

  @ApiProperty({
    description: 'Usuário que revisou',
    type: UsuarioRevisaoResponse,
    required: false
  })
  revisadoPor?: UsuarioRevisaoResponse | null;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-01T00:00:00.000Z'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Data de revisão',
    example: '2024-01-02T00:00:00.000Z',
    required: false
  })
  revisadoEm?: string | null;
}

export class ListarRevisaoResponse {
  @ApiProperty({
    description: 'Lista de revisões',
    type: [RevisaoItemResponse]
  })
  data: RevisaoItemResponse[];

  @ApiProperty({
    description: 'Número total de itens',
    example: 100
  })
  total: number;

  @ApiProperty({
    description: 'Número da página atual',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Número de itens por página',
    example: 10
  })
  limit: number;

  @ApiProperty({
    description: 'Número total de páginas',
    example: 10
  })
  totalPages: number;
}
