import {
  accountSchema,
  apiKeyAuthSchema,
  errorSchema,
  loginParamsSchema,
  signUpParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema
} from './schemas';
import { loginPath, signUpPath, surveysPath } from './paths';
import { badRequestComponent, forbiddenComponent, notFoundComponent, serverErrorComponent, unauthorisedComponent } from './components';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API Documentation - Clean Node API',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Surveys'
  }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveysPath
  },
  schemas: {
    error: errorSchema,
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: signUpParamsSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest: badRequestComponent,
    forbidden: forbiddenComponent,
    notFound: notFoundComponent,
    serverError: serverErrorComponent,
    unauthorised: unauthorisedComponent
  }
}
