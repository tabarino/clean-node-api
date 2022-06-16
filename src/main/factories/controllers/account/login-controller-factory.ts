import { makeDbAuthentication, makeLogControllerDecorator } from '@/main/factories';
import { Controller } from '@/presentation/protocols';
import { LoginController } from '@/presentation/controllers';
import { makeLoginValidation } from './login-validation-factory';

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation());
  return makeLogControllerDecorator(controller);
};
