import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsArray, IsNumber, ArrayMinSize, Min, Max } from 'class-validator';

export class CriarUsuarioPorConviteDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
    required: true,
  })
  @IsEmail({}, { message: 'O email deve ser válido' })
  @IsNotEmpty({ message: 'O email não pode estar vazio' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'senha123',
    required: true,
    minLength: 6,
  })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    required: true,
  })
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  @IsString({ message: 'O nome deve ser uma string' })
  nome: string;

  @ApiProperty({
    description: 'IDs dos livros a serem vinculados (obrigatório quando tipo de acesso do convite é LIVRE)',
    example: [1, 2, 3, 5, 10],
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray({ message: 'livros_ids deve ser um array' })
  @IsNumber({}, { each: true, message: 'Cada item de livros_ids deve ser um número' })
  @Min(1, { each: true, message: 'Cada ID de livro deve ser maior ou igual a 1' })
  @Max(66, { each: true, message: 'Cada ID de livro deve ser menor ou igual a 66' })
  livros_ids?: number[];
}

