export const forbiddenComponent = {
  description: 'Forbidden',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
};
