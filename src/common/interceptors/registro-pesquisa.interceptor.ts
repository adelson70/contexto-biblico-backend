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
import { GeolocalizacaoService } from '../services/geolocalizacao.service';
import { BibliaService } from '../services/biblia.service';

@Injectable()
export class RegistroPesquisaInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RegistroPesquisaInterceptor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly geolocalizacaoService: GeolocalizacaoService,
    private readonly bibliaService: BibliaService,
  ) {}

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
            // Obtém geolocalização do IP
            const geolocalizacao = this.geolocalizacaoService.obterGeolocalizacao(ip);

            // Normaliza o livro usando a lógica inteligente
            const livroEncontrado = this.bibliaService.buscarLivro(livro);
            const livroNormalizado = livroEncontrado?.name ?? livro;

            await this.prisma.pesquisas.create({
              data: {
                nome_livro: livro,
                livro_encontrado: livroNormalizado,
                capitulo_livro: capitulo,
                ip: ip,
                cidade: geolocalizacao.cidade,
                estado: geolocalizacao.estado,
              },
            });
            this.logger.log(`Pesquisa registrada: ${livro} -> ${livroNormalizado} ${capitulo} - IP: ${ip} - ${geolocalizacao.cidade}/${geolocalizacao.estado}`);
          }
        } catch (error) {
          // Não deixa o erro de registro impactar a resposta ao usuário
          this.logger.error('Erro ao registrar pesquisa:', error);
        }
      }),
    );
  }
}

