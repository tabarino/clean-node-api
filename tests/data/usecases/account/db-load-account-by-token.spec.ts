import { faker } from '@faker-js/faker';
import { DbLoadAccountByToken } from '@/data/usecases';
import { mockThrowError } from '@/tests/domain/mocks';
import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/tests/data/mocks';

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterSpy: DecrypterSpy;
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy;
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy();
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy();
  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy);
  return { sut, decrypterSpy, loadAccountByTokenRepositorySpy };
};

let token: string
let role: string

describe('DbLoadAccountByToken Usecase', () => {
  beforeEach(() => {
    token = faker.random.alpha(32);
    role = faker.random.word();
  })

  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterSpy } = makeSut();
    await sut.load(token, role);
    expect(decrypterSpy.token).toBe(token);
  });

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut();
    decrypterSpy.value = null;
    const account = await sut.load(token, role);
    expect(account).toBeNull();
  });

  test('Should return null if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut();
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(mockThrowError);
    const account = sut.load(token, role);
    await expect(account).toBeNull;
  });

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    await sut.load(token, role);
    expect(loadAccountByTokenRepositorySpy.token).toBe(token);
    expect(loadAccountByTokenRepositorySpy.role).toBe(role);
  });

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    loadAccountByTokenRepositorySpy.accountModel = null;
    const account = await sut.load(token, role);
    expect(account).toBeNull();
  });

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockImplementationOnce(mockThrowError);
    const promise = sut.load(token, role);
    await expect(promise).rejects.toThrow();
  });

  test('Should return an Account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    const account = await sut.load(token, role);
    expect(account).toEqual(loadAccountByTokenRepositorySpy.accountModel);
  });
});
