import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';

export class VincularLivroUsuarioDto {
  @ApiProperty({
    description: 'ID do livro (1 a 66)',
    example: 1,
    required: true,
    minimum: 1,
    maximum: 66,
  })
  @IsInt({ message: 'O ID do livro deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O ID do livro não pode estar vazio' })
  @Min(1, { message: 'O ID do livro deve ser no mínimo 1' })
  @Max(66, { message: 'O ID do livro deve ser no máximo 66' })
  livro_id: number;
}

export class VincularLivroUsuarioResponseDto {
  @ApiProperty({
    description: 'ID do registro criado',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  usuario_id: number;

  @ApiProperty({
    description: 'ID do livro',
    example: 1,
  })
  livro_id: number;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-10-11T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Livro vinculado com sucesso',
  })
  message: string;
}

