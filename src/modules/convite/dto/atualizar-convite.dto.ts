import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class AtualizarConviteDto {
  @ApiProperty({
    description: 'Nome do convite',
    example: 'Convite para Pastores Atualizado',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  nome?: string;

  @ApiProperty({
    description: 'Data de expiração do convite (pode ser null para sem expiração)',
    example: '2025-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === null ? null : (value ? new Date(value) : undefined))
  @IsDate({ message: 'A data de expiração deve ser uma data válida' })
  expira_em?: Date | null;
}

