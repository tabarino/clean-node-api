declare module Express {
  interface Request {
    accountId?: string;
  }
}

declare module 'mongo-round';
