import { ApiProperty } from '@nestjs/swagger';

export class DeletarUsuarioResponseDto {
  @ApiProperty({
    description: 'ID do usuário deletado',
    example: 1,
  })
  id: number;
}

