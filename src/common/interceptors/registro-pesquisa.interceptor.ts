import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PrismaService } from '../../modules/prisma/prisma.service';

@Injectable()
export class RegistroPesquisaInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RegistroPesquisaInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // Captura IP do cliente (considera proxy reverso)
    const ip = 
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.headers['x-real-ip'] ||
      request.ip ||
      request.connection?.remoteAddress ||
      'IP desconhecido';

    // Captura dados do body
    const { livro, capitulo } = request.body || {};

    return next.handle().pipe(
      finalize(async () => {
        // Registra no banco independente de sucesso ou erro
        try {
          if (livro && capitulo) {
            await this.prisma.pesquisas.create({
              data: {
                nome_livro: livro,
                capitulo_livro: capitulo,
                ip: ip,
              },
            });
            this.logger.log(`Pesquisa registrada: ${livro} ${capitulo} - IP: ${ip}`);
          }
        } catch (error) {
          // Não deixa o erro de registro impactar a resposta ao usuário
          this.logger.error('Erro ao registrar pesquisa:', error);
        }
      }),
    );
  }
}

