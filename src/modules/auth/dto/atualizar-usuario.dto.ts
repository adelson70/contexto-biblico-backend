import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class AtualizarUsuarioDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'O email deve ser válido' })
  email?: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres, máximo 20 caracteres)',
    example: 'senha123',
    required: false,
    minLength: 6,
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres' })
  senha?: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  nome?: string;

  @ApiProperty({
    description: 'Se o usuário é admin',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'O is_admin deve ser um booleano' })
  is_admin?: boolean;
}

