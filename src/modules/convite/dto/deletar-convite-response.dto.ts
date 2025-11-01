import { ApiProperty } from '@nestjs/swagger';

export class DeletarConviteResponseDto {
  @ApiProperty({
    description: 'ID do convite deletado',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Mensagem de confirmação',
    example: 'Convite deletado com sucesso',
  })
  message: string;
}

