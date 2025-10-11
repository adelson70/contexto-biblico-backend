import { HttpException, HttpStatus } from '@nestjs/common';

export class CapituloInvalidoException extends HttpException {
  constructor(capitulo: number, livro: string, maxCapitulo: number) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Capítulo ${capitulo} inválido para ${livro}`,
        capituloSolicitado: capitulo,
        capitulosDisponiveis: { min: 1, max: maxCapitulo },
        error: 'Capítulo inválido',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

