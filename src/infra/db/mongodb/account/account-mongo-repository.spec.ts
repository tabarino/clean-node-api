import { Collection } from 'mongodb';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { mockAddAccountParams } from '@/domain/test-helpers';
import { AccountMongoRepository } from './account-mongo-repository';

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  describe('Add', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut();
      const account = await sut.add(mockAddAccountParams());
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });
  });

  describe('Load by Email', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(mockAddAccountParams());
      const account = await sut.loadByEmail('any_email@mail.com');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail('any_email@mail.com');
      expect(account).toBeFalsy();
    });
  });

  describe('Load by Token', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token'
      });
      const account = await sut.loadByToken('any_token');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });

    test('Should return an account on loadByToken with role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token',
        role: 'any_role'
      });
      const account = await sut.loadByToken('any_token', 'any_role');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token',
        role: 'admin'
      });
      const account = await sut.loadByToken('any_token', 'admin');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token',
        role: 'any_role'
      });
      const account = await sut.loadByToken('any_token', 'invalid_role');
      expect(account).toBeFalsy();
    });

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken('any_token');
      expect(account).toBeFalsy();
    });
  });

  describe('Update Access Token', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const result = await accountCollection.insertOne(mockAddAccountParams());
      await sut.updateAccessToken(result.insertedId.toString(), 'any_token');
      const fakeAccount = await accountCollection.findOne({ _id: result.insertedId });
      expect(fakeAccount).toBeTruthy();
      expect(fakeAccount.accessToken).toBe('any_token');
    });
  });
});
