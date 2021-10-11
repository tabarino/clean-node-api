import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication';
import { LoadAccountbyEmailRepository } from '../../protocols/load-account-by-email-repository';

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountbyEmailRepository: LoadAccountbyEmailRepository
  ) { }

  async auth (authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountbyEmailRepository.load(authentication.email);
    return null;
  }
}
