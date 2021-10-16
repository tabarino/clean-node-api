import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { LoadAccountbyEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository, LoadAccountbyEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    return await MongoHelper.map(accountData, result.insertedId.toString());
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });
    return account && await MongoHelper.map(account, account._id);
  }
}
