import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Novo token de acesso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}

