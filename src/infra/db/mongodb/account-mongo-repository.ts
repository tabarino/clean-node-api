import { ObjectId } from 'mongodb';
import { AccountModel } from '@/domain/models';
import { AddAccountParams } from '@/domain/usecases';
import { LoadAccountbyEmailRepository, LoadAccountByTokenRepository, AddAccountRepository, UpdateAccessTokenRepository } from '@/data/protocols';
import { MongoHelper } from '@/infra/db/mongodb';

export class AccountMongoRepository implements AddAccountRepository, LoadAccountbyEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    return MongoHelper.map(accountData, result.insertedId.toString());
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });
    return account && MongoHelper.map(account, account._id.toString());
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    });
    return account && MongoHelper.map(account, account._id.toString());
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        accessToken: token
      }
    });
  }
}
