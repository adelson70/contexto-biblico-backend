import { Transform } from 'class-transformer';

/**
 * Decorator para sanitizar texto removendo caracteres de controle problemáticos
 * e normalizando caracteres especiais para evitar erros de JSON
 * 
 * @param options Opções de configuração para a sanitização
 * @returns Decorator de transformação
 */
export function SanitizeText(options?: {
  /** Se deve normalizar aspas curvas para retas (padrão: true) */
  normalizeQuotes?: boolean;
  /** Se deve remover quebras de linha excessivas (padrão: true) */
  normalizeLineBreaks?: boolean;
  /** Se deve remover espaços em branco excessivos (padrão: true) */
  normalizeWhitespace?: boolean;
  /** Se deve remover caracteres de controle (padrão: true) */
  removeControlChars?: boolean;
}) {
  const {
    normalizeQuotes = true,
    normalizeLineBreaks = true,
    normalizeWhitespace = true,
    removeControlChars = true
  } = options || {};

  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    
    let cleanValue = value;

    // Remove caracteres de controle problemáticos
    if (removeControlChars) {
      cleanValue = cleanValue.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    }
    
    // Normaliza aspas curvas para aspas retas
    if (normalizeQuotes) {
      cleanValue = cleanValue.replace(/[""]/g, '"');
      cleanValue = cleanValue.replace(/['']/g, "'");
    }
    
    // Remove quebras de linha desnecessárias mas mantém parágrafos
    if (normalizeLineBreaks) {
      cleanValue = cleanValue.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }
    
    // Remove espaços em branco excessivos
    if (normalizeWhitespace) {
      cleanValue = cleanValue.replace(/\s+/g, ' ').trim();
    }
    
    return cleanValue;
  });
}
