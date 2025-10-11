import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'Ocorreu um erro';
    let data: any = null;

    // Extrai informações da exceção
    if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as any;
      
      // Prioriza a mensagem da exceção
      message = responseObj.message || message;
      
      // Se a mensagem for um array (validação), junta as mensagens
      if (Array.isArray(message)) {
        message = message.join(', ');
      }

      // Extrai dados extras da exceção (sugestões, detalhes, etc.)
      // Remove campos padrão do NestJS para colocar em 'data'
      const { statusCode, message: msg, error, ...extraData } = responseObj;
      
      // Se houver dados extras, coloca em 'data'
      if (Object.keys(extraData).length > 0) {
        data = extraData;
      }
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    const errorResponse: ApiResponse = {
      status,
      message,
      data,
    };

    response.status(status).json(errorResponse);
  }
}

