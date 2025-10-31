import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { BibliaService } from './biblia.service';

@Injectable()
export class LivrosPermissaoService {
  private cache: Map<number, string[]> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly bibliaService: BibliaService,
  ) {}

  /**
   * Converte livro_id (1-66) para nome do livro
   * O livro_id corresponde ao índice + 1 no array da bíblia
   */
  private livroIdParaNome(livroId: number): string | null {
    const todosLivros = this.bibliaService.getTodosLivros();
    const index = livroId - 1; // livro_id 1 = índice 0
    
    if (index < 0 || index >= todosLivros.length) {
      return null;
    }
    
    return todosLivros[index].name;
  }

  /**
   * Obtém os nomes dos livros permitidos para um usuário
   * Cacheia o resultado por userId para evitar múltiplas consultas ao banco
   */
  async obterLivrosPermitidos(userId: number, isAdmin: boolean): Promise<string[]> {
    // Se for admin, retorna todos os livros
    if (isAdmin) {
      return this.bibliaService.getTodosLivros().map(livro => livro.name);
    }

    // Verifica cache
    if (this.cache.has(userId)) {
      return this.cache.get(userId)!;
    }

    // Busca livros permitidos do banco
    const livrosPermissoes = await this.prisma.usuario_livros.findMany({
      where: {
        usuario_id: userId,
      },
      select: {
        livro_id: true,
      },
      orderBy: {
        livro_id: 'asc',
      },
    });

    // Converte livro_id para nome do livro
    const nomesLivros = livrosPermissoes
      .map(permissao => this.livroIdParaNome(permissao.livro_id))
      .filter((nome): nome is string => nome !== null);

    // Armazena no cache
    this.cache.set(userId, nomesLivros);

    return nomesLivros;
  }

  /**
   * Valida se um usuário tem permissão para acessar um livro específico
   */
  async validarPermissaoLivro(
    userId: number,
    isAdmin: boolean,
    nomeLivro: string,
  ): Promise<boolean> {
    // Admin sempre tem permissão
    if (isAdmin) {
      return true;
    }

    // Obtém livros permitidos (usa cache se disponível)
    const livrosPermitidos = await this.obterLivrosPermitidos(userId, isAdmin);
    
    return livrosPermitidos.includes(nomeLivro);
  }

  /**
   * Limpa o cache para um usuário (útil quando permissões são atualizadas)
   */
  limparCache(userId: number): void {
    this.cache.delete(userId);
  }

  /**
   * Limpa todo o cache
   */
  limparTodoCache(): void {
    this.cache.clear();
  }
}

