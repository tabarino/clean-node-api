import { badRequestComponent, notFoundComponent, serverErrorComponent, unauthorisedComponent } from './components';
import { accountSchema, errorSchema, loginParamsSchema } from './schemas';
import { loginPath } from './paths';

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
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    error: errorSchema,
    account: accountSchema,
    loginParams: loginParamsSchema
  },
  components: {
    badRequest: badRequestComponent,
    notFound: notFoundComponent,
    serverError: serverErrorComponent,
    unauthorised: unauthorisedComponent
  }
}
