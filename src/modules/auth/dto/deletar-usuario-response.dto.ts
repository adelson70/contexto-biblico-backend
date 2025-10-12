import { ApiProperty } from '@nestjs/swagger';

export class DeletarUsuarioResponseDto {
  @ApiProperty({
    description: 'ID do usuário deletado',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Mensagem personalizada (opcional)',
    example: 'Usuário deletado com sucesso',
    required: false,
  })
  message?: string;
}

