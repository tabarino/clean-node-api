import { Collection } from 'mongodb';
import { faker } from '@faker-js/faker';
import { MongoHelper, AccountMongoRepository } from '@/infra/db/mongodb';
import { mockAddAccountParams } from '@/tests/domain/mocks';

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
      const addAccountParams = mockAddAccountParams();
      const account = await sut.add(addAccountParams)
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });
  });

  describe('Load by Email', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      await accountCollection.insertOne(addAccountParams);
      const account = await sut.loadByEmail(addAccountParams.email);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail(faker.internet.email());
      expect(account).toBeFalsy();
    });
  });

  describe('Load by Token', () => {
    let name = faker.name.findName();
    let email = faker.internet.email();
    let password = faker.internet.password();
    let accessToken = faker.datatype.uuid();

    beforeEach(() => {
      name = faker.name.findName();
      email = faker.internet.email();
      password = faker.internet.password();
      accessToken = faker.datatype.uuid();
    })

    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({ name, email, password, accessToken });
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(name);
      expect(account.email).toBe(email);
      expect(account.password).toBe(password);
    });

    test('Should return an account on loadByToken with role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({ name, email, password, accessToken, role: 'any_role' });
      const account = await sut.loadByToken(accessToken, 'any_role');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(name);
      expect(account.email).toBe(email);
      expect(account.password).toBe(password);
    });

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({ name, email, password, accessToken, role: 'admin' });
      const account = await sut.loadByToken(accessToken, 'admin');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(name);
      expect(account.email).toBe(email);
      expect(account.password).toBe(password);
    });

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({ name, email, password, accessToken, role: 'any_role' });
      const account = await sut.loadByToken(accessToken, 'invalid_role');
      expect(account).toBeFalsy();
    });

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeFalsy();
    });
  });

  describe('Update Access Token', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const result = await accountCollection.insertOne(mockAddAccountParams());
      const accessToken = faker.random.alpha(32);
      await sut.updateAccessToken(result.insertedId.toString(), accessToken);
      const fakeAccount = await accountCollection.findOne({ _id: result.insertedId });
      expect(fakeAccount).toBeTruthy();
      expect(fakeAccount.accessToken).toBe(accessToken);
    });
  });
});
