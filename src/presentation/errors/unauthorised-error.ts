export class UnauthorisedError extends Error {
  constructor () {
    super('Unauthorised');
    this.name = 'UnauthorisedError';
  }
}
