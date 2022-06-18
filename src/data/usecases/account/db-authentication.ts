import { Authentication } from '@/domain/usecases';
import { Encrypter, HashComparer, LoadAccountbyEmailRepository, UpdateAccessTokenRepository } from '@/data/protocols';

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountbyEmailRepository: LoadAccountbyEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
    const account = await this.loadAccountbyEmailRepository.loadByEmail(authentication.email);
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password);
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
        return {
          name: account.name,
          accessToken
        }
      }
    }
    return null;
  }
}
