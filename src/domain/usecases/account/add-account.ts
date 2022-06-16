export namespace AddAccount {
  // Example it does the same thing, but it uses Omit
  // export type Params = Omit<AccountModel, 'id'>;
  export type Params = {
    name: string;
    email: string;
    password: string;
  }
}

export interface AddAccount {
  add (account: AddAccount.Params): Promise<boolean>
}
