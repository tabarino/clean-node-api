export const surveysPath = {
  get: {
    security: [{
      apiKeyAuth: [] as any[]
    }],
    tags: ['Surveys'],
    summary: 'Endpoint for Load Surveys',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/survey'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
};
