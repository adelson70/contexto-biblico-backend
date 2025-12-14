import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  windowStart: number;
}

@Injectable()
export class RateLimitService {
  private readonly attempts = new Map<string, AttemptRecord>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Limpa tentativas expiradas a cada 5 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredAttempts();
    }, 5 * 60 * 1000);
  }

  /**
   * Extrai o IP do cliente considerando proxies reversos
   */
  extractIp(request: Request): string {
    const forwardedFor = request.headers['x-forwarded-for'] as string;
    if (forwardedFor) {
      const ips = forwardedFor.split(',').map(ip => ip.trim());
      return ips[0] || 'unknown';
    }

    const realIp = request.headers['x-real-ip'] as string;
    if (realIp) {
      return realIp;
    }

    return (
      (request as any).ip ||
      (request as any).connection?.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Limpa tentativas de um IP específico (útil após login bem-sucedido)
   */
  clearAttempts(ip: string): void {
    this.attempts.delete(ip);
  }

  /**
   * Limpa tentativas de um request
   */
  clearAttemptsForRequest(request: Request): void {
    const ip = this.extractIp(request);
    this.clearAttempts(ip);
  }

  /**
   * Limpa todas as tentativas (útil para testes)
   */
  clearAllAttempts(): void {
    this.attempts.clear();
  }

  /**
   * Limpa tentativas expiradas para evitar vazamento de memória
   */
  private cleanupExpiredAttempts(): void {
    const now = Date.now();
    const maxWindow = 60 * 60 * 1000; // 1 hora

    for (const [ip, record] of this.attempts.entries()) {
      if (now - record.windowStart > maxWindow) {
        this.attempts.delete(ip);
      }
    }
  }

  /**
   * Limpa o intervalo de cleanup ao destruir o serviço
   */
  onModuleDestroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

