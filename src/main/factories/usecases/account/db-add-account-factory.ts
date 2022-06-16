import { DbAddAccount } from '@/data/usecases';
import { AddAccount } from '@/domain/usecases';
import { BcryptAdapter } from '@/infra/cryptography';
import { AccountMongoRepository } from '@/infra/db/mongodb';

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountRepository = new AccountMongoRepository();
  return new DbAddAccount(bcryptAdapter, accountRepository, accountRepository);
};
