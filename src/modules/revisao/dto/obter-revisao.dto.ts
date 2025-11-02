import { ApiProperty } from "@nestjs/swagger";
import { ComentarioRevisaoDados, ReferenciaRevisaoDados, StatusRevisaoEnum, TipoRevisaoEnum, UsuarioRevisaoResponse } from "./listar-revisao.dto";

export class ObterRevisaoResponse {
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
    description: 'Data de atualização',
    example: '2024-01-01T00:00:00.000Z'
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Data de revisão',
    example: '2024-01-02T00:00:00.000Z',
    required: false
  })
  revisadoEm?: string | null;
}
