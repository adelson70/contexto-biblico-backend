import { Injectable } from '@nestjs/common';
import bibliaNVI from '../../data/biblia-nvi.json';
import type { BibliaNVI, LivroBiblico } from '../../data/biblia-nvi.type';

@Injectable()
export class BibliaService {
  private biblia: BibliaNVI = bibliaNVI as BibliaNVI;

  // Regex para extrair número ordinal e nome do livro
  private readonly REGEX_NUMERO_LIVRO = /^(\d+|i{1,3}|primeir[oa]|segund[oa]|terceir[oa])\s*(.+)$/i;

  // Mapa de conversão de números ordinais
  private readonly ORDINAIS_MAP: Record<string, string> = {
    'i': '1',
    'primeiro': '1',
    'primeira': '1',
    'ii': '2',
    'segundo': '2',
    'segunda': '2',
    'iii': '3',
    'terceiro': '3',
    'terceira': '3',
  };

  /**
   * Normaliza texto removendo acentos, convertendo para lowercase e removendo espaços extras
   * Exceção: mantém "jó" com acento para diferenciá-lo de "jo" (João)
   */
  normalizarTexto(texto: string): string {
    const textoLower = texto.toLowerCase().trim();
    
    // Caso especial: mantém "jó" com acento
    if (textoLower === 'jó') {
      return 'jó';
    }

    return textoLower
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Converte número ordinal para numeral
   */
  private converterOrdinal(ordinal: string): string {
    const normalizado = this.normalizarTexto(ordinal);
    return this.ORDINAIS_MAP[normalizado] || ordinal;
  }

  /**
   * Busca inteligente de livro bíblico
   */
  buscarLivro(termo: string): LivroBiblico | undefined {
    const termoOriginal = termo.trim().toLowerCase();
    const termoNormalizado = this.normalizarTexto(termo);

    // a) Caso especial - Jó vs João
    if (termoOriginal === 'jó' || termoNormalizado === 'jó') {
      return this.biblia.find(livro => livro.name === 'Jó');
    }
    if (termoOriginal === 'jo' || termoNormalizado === 'jo') {
      return this.biblia.find(livro => livro.name === 'João');
    }

    // b) Match exato por abreviação
    const porAbreviacao = this.biblia.find(
      livro => this.normalizarTexto(livro.abbrev) === termoNormalizado
    );
    if (porAbreviacao) return porAbreviacao;

    // c) Match por nome completo normalizado
    const porNome = this.biblia.find(
      livro => this.normalizarTexto(livro.name) === termoNormalizado
    );
    if (porNome) return porNome;

    // d) Match com variação de número ordinal
    const match = termo.match(this.REGEX_NUMERO_LIVRO);
    if (match) {
      const [, numeroOrdinal, nomeLivro] = match;
      const numeroConvertido = this.converterOrdinal(numeroOrdinal);
      const nomeNormalizado = this.normalizarTexto(nomeLivro);

      // Buscar por nome completo normalizado
      const porNomeCompleto = this.biblia.find(livro => {
        const nomeLivroCompleto = livro.name;
        const partes = nomeLivroCompleto.match(/^(\d+)\s+(.+)$/);
        
        if (partes) {
          const [, numeroLivro, nomeLivroSemNumero] = partes;
          const nomeSemNumeroNormalizado = this.normalizarTexto(nomeLivroSemNumero);
          
          return numeroLivro === numeroConvertido && nomeSemNumeroNormalizado === nomeNormalizado;
        }
        
        return false;
      });

      if (porNomeCompleto) return porNomeCompleto;

      // SE NÃO ENCONTROU, buscar por abreviação numerada (ex: "1 jo" -> "1jo")
      return this.biblia.find(livro => {
        const partes = livro.name.match(/^(\d+)\s+(.+)$/);
        if (partes) {
          const [, numeroLivro] = partes;
          // Remove o número da abreviação e normaliza
          const abrevSemNumero = livro.abbrev.replace(/^\d+/, '');
          const abrevSemNumeroNormalizada = this.normalizarTexto(abrevSemNumero);
          
          return numeroLivro === numeroConvertido && abrevSemNumeroNormalizada === nomeNormalizado;
        }
        return false;
      });
    }

    return undefined;
  }

  /**
   * Calcula distância de Levenshtein para sugestões
   */
  calcularDistancia(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Sugere livros similares
   */
  sugerirLivros(termo: string): string[] {
    const termoNormalizado = this.normalizarTexto(termo);
    
    const distancias = this.biblia.map(livro => ({
      nome: livro.name,
      distancia: Math.min(
        this.calcularDistancia(termoNormalizado, this.normalizarTexto(livro.name)),
        this.calcularDistancia(termoNormalizado, this.normalizarTexto(livro.abbrev))
      )
    }));

    return distancias
      .filter(item => item.distancia <= 3)
      .sort((a, b) => a.distancia - b.distancia)
      .slice(0, 3)
      .map(item => item.nome);
  }

  /**
   * Gera slug do livro para busca no banco de dados
   */
  gerarLivroSlug(nomeLivro: string): string {
    return nomeLivro
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');
  }

  /**
   * Retorna todos os livros da bíblia
   */
  getTodosLivros(): BibliaNVI {
    return this.biblia;
  }
}

