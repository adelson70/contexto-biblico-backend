import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class CriarUsuarioDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
    required: true,
  })
  @IsEmail({}, { message: 'O email deve ser válido' })
  @IsNotEmpty({ message: 'O email não pode estar vazio' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres, máximo 20 caracteres)',
    example: 'senha123',
    required: true,
    minLength: 6,
    maxLength: 20,
  })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres' })
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
    description: 'Se o usuário é admin',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'O is_admin deve ser um booleano' })
  is_admin?: boolean;
}

