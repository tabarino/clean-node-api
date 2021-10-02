import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorators/log';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountRepository = new AccountMongoRepository();
  const logRepository = new LogMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository);
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount);
  return new LogControllerDecorator(signUpController, logRepository);
};
