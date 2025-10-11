import { ApiProperty } from '@nestjs/swagger';

export class DeletarUsuarioResponseDto {
  @ApiProperty({
    description: 'Mensagem de confirmação',
    example: 'Usuário deletado com sucesso',
  })
  mensagem: string;

  @ApiProperty({
    description: 'ID do usuário deletado',
    example: 1,
  })
  id: number;
}

