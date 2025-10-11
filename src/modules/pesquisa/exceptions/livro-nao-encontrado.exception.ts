import { HttpException, HttpStatus } from '@nestjs/common';

export class LivroNaoEncontradoException extends HttpException {
  constructor(livro: string, sugestoes: string[]) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Livro "${livro}" não encontrado`,
        sugestoes: sugestoes,
        error: 'Livro não encontrado',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

