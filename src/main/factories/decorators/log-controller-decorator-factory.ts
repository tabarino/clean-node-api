import { LogMongoRepository } from '@/infra/db/mongodb';
import { LogControllerDecorator } from '@/main/decorators';
import { Controller } from '@/presentation/protocols';

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logRepository = new LogMongoRepository();
  return new LogControllerDecorator(controller, logRepository);
};
