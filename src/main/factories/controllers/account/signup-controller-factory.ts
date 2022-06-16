import { makeDbAuthentication, makeDbAddAccount, makeLogControllerDecorator } from '@/main/factories';
import { Controller } from '@/presentation/protocols';
import { SignUpController } from '@/presentation/controllers';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication());
  return makeLogControllerDecorator(controller);
};
