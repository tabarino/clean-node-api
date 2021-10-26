import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-router-adapter';
import { makeSignUpController } from '../factories/signup/signup-controller-factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
};
