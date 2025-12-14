import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { RATE_LIMIT_KEY, RateLimitOptions } from '../common/decorators/rate-limit.decorator';
import { RateLimitService } from '../common/services/rate-limit.service';

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  windowStart: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly attempts = new Map<string, AttemptRecord>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(
    private reflector: Reflector,
    private rateLimitService: RateLimitService,
  ) {
    // Limpa tentativas expiradas a cada 5 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredAttempts();
    }, 5 * 60 * 1000);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const options = this.reflector.get<RateLimitOptions>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    // Se não houver configuração de rate limit, permite a requisição
    if (!options) {
      return true;
    }

    // Usar valores das opções ou valores padrão das env
    const defaultMaxAttempts = parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || '10', 10);
    const defaultWindowMinutes = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '1', 10);
    const defaultWindowMs = defaultWindowMinutes * 60 * 1000;

    const maxAttempts = options.maxAttempts ?? defaultMaxAttempts;
    const windowMs = options.windowMs ?? defaultWindowMs;

    const ip = this.extractIp(request);
    const now = Date.now();
    const record = this.attempts.get(ip);

    // Se não há registro ou a janela expirou, criar/resetar
    if (!record || now - record.windowStart >= windowMs) {
      this.attempts.set(ip, {
        count: 1,
        firstAttempt: now,
        windowStart: now,
      });
      return true;
    }

    // Se ainda está na janela e excedeu o limite
    if (record.count >= maxAttempts) {
      const remainingTime = windowMs - (now - record.windowStart);
      const remainingMinutes = Math.ceil(remainingTime / 60000);
      
      throw new HttpException(
        {
          statusCode: 429,
          message: options.message || `Muitas tentativas. Tente novamente em ${remainingMinutes} minuto(s).`,
          retryAfter: remainingTime,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Incrementar contador
    record.count++;
    this.attempts.set(ip, record);

    return true;
  }

  /**
   * Extrai o IP do cliente considerando proxies reversos
   */
  private extractIp(request: Request): string {
    return this.rateLimitService.extractIp(request);
  }

  /**
   * Limpa tentativas expiradas para evitar vazamento de memória
   */
  private cleanupExpiredAttempts(): void {
    const now = Date.now();
    const maxWindow = 60 * 60 * 1000; // 1 hora (assumindo que nenhuma janela é maior que isso)

    for (const [ip, record] of this.attempts.entries()) {
      if (now - record.windowStart > maxWindow) {
        this.attempts.delete(ip);
      }
    }
  }

  /**
   * Limpa tentativas de um IP específico (útil após login bem-sucedido)
   */
  clearAttempts(ip: string): void {
    this.attempts.delete(ip);
    this.rateLimitService.clearAttempts(ip);
  }

  /**
   * Limpa todas as tentativas (útil para testes)
   */
  clearAllAttempts(): void {
    this.attempts.clear();
    this.rateLimitService.clearAllAttempts();
  }

  /**
   * Limpa o intervalo de cleanup ao destruir o guard
   */
  onModuleDestroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

