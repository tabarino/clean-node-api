import { LoadAccountByToken, Decrypter, LoadAccountByTokenRepository, AccountModel } from './db-load-account-by-token-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    let decryptedToken: string;

    try {
      decryptedToken = await this.decrypter.decrypt(accessToken);
    } catch (error) {
      return null;
    }

    if (decryptedToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role);
      if (account) {
        return account;
      }
    }

    return null;
  }
}
