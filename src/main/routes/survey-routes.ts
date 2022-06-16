import { Router } from 'express';
import { adaptRoute } from '@/main/adapters';
import { makeLoadSurveysController, makeAddSurveyController } from '@/main/factories';
import { auth, authAdmin } from '@/main/middlewares';

export default (router: Router): void => {
  router.post('/surveys', authAdmin, adaptRoute(makeAddSurveyController()));
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()));
};
