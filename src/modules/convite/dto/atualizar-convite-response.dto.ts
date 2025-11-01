import { ApiProperty } from '@nestjs/swagger';
import { TipoAcessoLivros } from './criar-convite.dto';

export class AtualizarConviteResponseDto {
  @ApiProperty({
    description: 'ID do convite',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome do convite',
    example: 'Convite para Pastores Atualizado',
  })
  nome: string;

  @ApiProperty({
    description: 'Data de expiração',
    example: '2025-12-31T23:59:59.000Z',
    nullable: true,
  })
  expira_em: Date | null;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2025-10-11T15:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Mensagem personalizada',
    example: 'Convite atualizado com sucesso',
  })
  message: string;
}

