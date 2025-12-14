import { SetMetadata } from '@nestjs/common';

export interface RateLimitOptions {
  maxAttempts?: number;
  windowMs?: number;
  message?: string;
}

export const RATE_LIMIT_KEY = 'rate_limit';

// Valores padrão das variáveis de ambiente
const getDefaultMaxAttempts = (): number => {
  return parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || '10', 10);
};

const getDefaultWindowMs = (): number => {
  const windowMinutes = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '1', 10);
  return windowMinutes * 60 * 1000;
};

export const RateLimit = (options: RateLimitOptions = {}) => {
  const {
    maxAttempts,
    windowMs,
    message,
  } = options;

  const finalMaxAttempts = maxAttempts ?? getDefaultMaxAttempts();
  const finalWindowMs = windowMs ?? getDefaultWindowMs();

  return SetMetadata(RATE_LIMIT_KEY, {
    maxAttempts: finalMaxAttempts,
    windowMs: finalWindowMs,
    message: message || `Muitas tentativas. Tente novamente em ${Math.ceil(finalWindowMs / 60000)} minuto(s).`,
  });
};

