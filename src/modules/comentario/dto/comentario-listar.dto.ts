import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsPositive, Min } from "class-validator";
import { Type } from "class-transformer";

export class ListarComentariosQueryDTO {
    @ApiProperty({
        description: 'Nome do livro bíblico (opcional). Se não fornecido, retorna comentários de todos os livros',
        example: 'Gênesis',
        required: false
    })
    @Type(() => String)
    @IsOptional()
    @IsString({ message: 'O livro deve ser uma string' })
    livro?: string;

    @ApiProperty({
        description: 'Número da página',
        example: 1,
        required: false,
        default: 1
    })
    @Type(() => Number)
    @IsOptional()
    @IsPositive({ message: 'A página deve ser um número positivo' })
    @Min(1, { message: 'A página deve ser pelo menos 1' })
    page?: number = 1;

    @ApiProperty({
        description: 'Número de itens por página',
        example: 10,
        required: false,
        default: 10
    })
    @Type(() => Number)
    @IsOptional()
    @IsPositive({ message: 'O limite deve ser um número positivo' })
    @Min(1, { message: 'O limite deve ser pelo menos 1' })
    limit?: number = 10;
}

export class ComentarioItemResponse {
    @ApiProperty({
        description: 'ID do comentário',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Livro',
        example: 'genesis'
    })
    livro: string;

    @ApiProperty({
        description: 'Número do capítulo',
        example: 1
    })
    capitulo: number;

    @ApiProperty({
        description: 'Número do versículo',
        example: 1
    })
    versiculo: number;

    @ApiProperty({
        description: 'Texto do comentário',
        example: 'Este é um comentário sobre o versículo'
    })
    texto: string;

    @ApiProperty({
        description: 'Data de criação',
        example: '2024-01-01T00:00:00.000Z'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Data de atualização',
        example: '2024-01-01T00:00:00.000Z'
    })
    updatedAt: Date;
}

export class ListarComentariosResponse {
    @ApiProperty({
        description: 'Lista de comentários',
        type: [ComentarioItemResponse]
    })
    data: ComentarioItemResponse[];

    @ApiProperty({
        description: 'Número total de itens',
        example: 100
    })
    total: number;

    @ApiProperty({
        description: 'Número da página atual',
        example: 1
    })
    page: number;

    @ApiProperty({
        description: 'Número de itens por página',
        example: 10
    })
    limit: number;

    @ApiProperty({
        description: 'Número total de páginas',
        example: 10
    })
    totalPages: number;
}

