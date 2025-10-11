import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class PesquisaRequestDto {
  @ApiProperty({
    description: 'Nome do livro bíblico (aceita nome completo, abreviações, com ou sem acentos, números ordinais). Exemplos: "Gênesis", "genesis", "gn", "1 Coríntios", "I Corintios", "Primeiro Corintios", "1co"',
    example: 'Gênesis',
    required: true
  })
  @IsString({ message: 'O livro deve ser uma string' })
  @IsNotEmpty({ message: 'O livro não pode estar vazio' })
  livro: string;

  @ApiProperty({
    description: 'Capítulo do Livro',
    example: '1',
    required: true
  })
  @IsString({ message: 'O capítulo do livro deve ser uma string' })
  @IsNotEmpty({ message: 'Capítulo do livro não pode estar vazio' })
  capitulo: string;
}
