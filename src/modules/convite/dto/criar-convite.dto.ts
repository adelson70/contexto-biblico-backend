import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray, IsDate, IsEnum, ValidateIf, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Transform } from 'class-transformer';

export enum TipoAcessoLivros {
  TODOS = 'TODOS',
  ESPECIFICO = 'ESPECIFICO',
  LIVRE = 'LIVRE',
}

export class CriarConviteDto {
  @ApiProperty({
    description: 'Nome do convite',
    example: 'Convite para Pastores',
    required: true,
  })
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  @IsString({ message: 'O nome deve ser uma string' })
  nome: string;

  @ApiProperty({
    description: 'Slug personalizado para o link (opcional)',
    example: 'convite-pastores',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O slug_personalizado deve ser uma string' })
  slug_personalizado?: string;

  @ApiProperty({
    description: 'Data de expiração do convite (opcional, null = sem expiração)',
    example: '2025-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate({ message: 'A data de expiração deve ser uma data válida' })
  expira_em?: Date | null;

  @ApiProperty({
    description: 'Tipo de acesso aos livros',
    enum: TipoAcessoLivros,
    example: TipoAcessoLivros.TODOS,
    required: true,
  })
  @IsNotEmpty({ message: 'O tipo_acesso_livros é obrigatório' })
  @IsEnum(TipoAcessoLivros, { message: 'Tipo de acesso inválido' })
  tipo_acesso_livros: TipoAcessoLivros;

  @ApiProperty({
    description: 'IDs dos livros permitidos (obrigatório se tipo_acesso_livros = ESPECIFICO)',
    example: [1, 2, 3],
    required: false,
    type: [Number],
  })
  @ValidateIf(o => o.tipo_acesso_livros === TipoAcessoLivros.ESPECIFICO)
  @IsArray({ message: 'livros_ids deve ser um array' })
  @ArrayMinSize(1, { message: 'Ao menos um livro deve ser selecionado quando o tipo é ESPECIFICO' })
  @ArrayMaxSize(66, { message: 'Máximo de 66 livros permitidos' })
  livros_ids?: number[];
}

