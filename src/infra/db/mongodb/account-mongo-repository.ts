import { ObjectId } from 'mongodb';
import { LoadAccountbyEmailRepository, LoadAccountByTokenRepository, AddAccountRepository, UpdateAccessTokenRepository } from '@/data/protocols';
import { MongoHelper } from '@/infra/db/mongodb';

export class AccountMongoRepository implements AddAccountRepository, LoadAccountbyEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    return result.insertedId !== null;
  }

  async loadByEmail (email: string): Promise<LoadAccountbyEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });
    return account && MongoHelper.map(account, account._id.toString());
  }

  async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    }, {
      projection: {
        _id: 1
      }
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
