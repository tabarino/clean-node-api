import {
  apiKeyAuthComponent,
  badRequestComponent,
  forbiddenComponent,
  notFoundComponent,
  serverErrorComponent,
  unauthorisedComponent
} from './components/';

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthComponent
  },
  badRequest: badRequestComponent,
  forbidden: forbiddenComponent,
  notFound: notFoundComponent,
  serverError: serverErrorComponent,
  unauthorised: unauthorisedComponent
};
