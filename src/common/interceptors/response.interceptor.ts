import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;
        
        // Verificar se o data contém uma mensagem manual
        const customMessage = data && typeof data === 'object' && 'message' in data 
          ? data.message 
          : null;
        
        const message = customMessage || this.generateMessage(request.method, request.url, statusCode);
        
        // Se houver mensagem customizada, remover do data para não duplicar
        const responseData = customMessage && data 
          ? { ...data, message: undefined } 
          : data;

        return {
          status: statusCode,
          message,
          data: responseData,
        };
      }),
    );
  }

  private generateMessage(method: string, url: string, statusCode: number): string {
    // Mensagens padrão por status code
    if (statusCode >= 200 && statusCode < 300) {
      // Extrai a rota principal (remove query params e IDs)
      const route = url.split('?')[0].split('/').filter(Boolean);
      const resource = route[0] || 'recurso';

      switch (method) {
        case 'POST':
          return `${this.capitalize(resource)} criado com sucesso`;
        case 'PUT':
        case 'PATCH':
          return `${this.capitalize(resource)} atualizado com sucesso`;
        case 'DELETE':
          return `${this.capitalize(resource)} deletado com sucesso`;
        case 'GET':
          return `${this.capitalize(resource)} recuperado com sucesso`;
        default:
          return 'Operação realizada com sucesso';
      }
    }

    return 'Operação realizada com sucesso';
  }

  private capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

