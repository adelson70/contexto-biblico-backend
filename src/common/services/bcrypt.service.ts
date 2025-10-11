import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

  /**
   * Gera um hash da senha usando bcrypt com 12 saltos
   * @param password - Senha em texto plano
   * @returns Hash da senha
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compara uma senha em texto plano com um hash
   * @param password - Senha em texto plano
   * @param hash - Hash para comparação
   * @returns true se a senha corresponde ao hash, false caso contrário
   */
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

