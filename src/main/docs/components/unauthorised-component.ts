export const unauthorisedComponent = {
  description: 'Unauthorised',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
};
