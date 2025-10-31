import { ApiProperty } from '@nestjs/swagger';

export class DesvincularLivroUsuarioResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Livro desvinculado com sucesso',
  })
  message: string;
}

