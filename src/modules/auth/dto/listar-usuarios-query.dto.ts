import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListarUsuariosQueryDto {
  @ApiProperty({
    description: 'Número da página (inicia em 1)',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'A página deve ser um número inteiro' })
  @Min(1, { message: 'A página deve ser maior ou igual a 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limite deve ser um número inteiro' })
  @Min(1, { message: 'O limite deve ser maior ou igual a 1' })
  limit?: number = 10;

  @ApiProperty({
    description: 'Filtrar por nome do usuário',
    example: 'João',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  nome?: string;

  @ApiProperty({
    description: 'Filtrar por email do usuário',
    example: 'usuario@exemplo.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'O email deve ser válido' })
  email?: string;
}

