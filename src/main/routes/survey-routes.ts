import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express/express-router-adapter';
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory';
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory';
import { authAdmin } from '@/main/middlewares/auth-admin';
import { auth } from '@/main/middlewares/auth';

export default (router: Router): void => {
  router.post('/surveys', authAdmin, adaptRoute(makeAddSurveyController()));
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()));
};
