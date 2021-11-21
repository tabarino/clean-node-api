import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication';
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository';
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter';
import { Authentication } from '../../../../domain/usecases/authentication';
import env from '../../../config/env';

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountRepository = new AccountMongoRepository();
  return new DbAuthentication(accountRepository, bcryptAdapter, jwtAdapter, accountRepository);
};
