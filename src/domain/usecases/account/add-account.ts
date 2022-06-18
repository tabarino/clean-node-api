export namespace AddAccount {
  export type Params = {
    name: string;
    email: string;
    password: string;
  }
}

export interface AddAccount {
  add (account: AddAccount.Params): Promise<boolean>;
}
