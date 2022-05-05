import { HashComparer, UpdateAccessTokenRepository } from './db-authentication-protocols';
import { mockAuthenticationParams, mockThrowError } from '@/domain/test-helpers';
import { EncrypterSpy, mockHashComparer, LoadAccountByEmailRepositorySpy, mockUpdateAccessTokenRepository } from '@/data/test-helpers';
import { DbAuthentication } from './db-authentication';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
  hashComparerStub: HashComparer;
  encrypterSpy: EncrypterSpy;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  const hashComparerStub = mockHashComparer();
  const encrypterSpy = new EncrypterSpy();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerStub,
    encrypterSpy,
    updateAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerStub,
    encrypterSpy,
    updateAccessTokenRepositoryStub
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountbyEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    const authenticationParams = mockAuthenticationParams();
    await sut.auth(mockAuthenticationParams());
    expect(loadAccountByEmailRepositorySpy.email).toBe(authenticationParams.email);
  });

  test('Should throw if LoadAccountbyEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockImplementationOnce(mockThrowError);
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountbyEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.fakeAccountModel = null;
    const accessToken = await sut.auth(mockAuthenticationParams());
    expect(accessToken).toBeNull();
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub, loadAccountByEmailRepositorySpy } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    const authenticationParams = mockAuthenticationParams();
    await sut.auth(authenticationParams);
    expect(compareSpy).toHaveBeenCalledWith(authenticationParams.password, loadAccountByEmailRepositorySpy.fakeAccountModel.password);
  });

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(mockThrowError);
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false));
    const accessToken = await sut.auth(mockAuthenticationParams());
    expect(accessToken).toBeNull();
  });

  test('Should call Encrypter with correct value', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut();
    await sut.auth(mockAuthenticationParams());
    expect(encrypterSpy.value).toBe(loadAccountByEmailRepositorySpy.fakeAccountModel.id);
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut();
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(mockThrowError);
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return a token on success', async () => {
    const { sut, encrypterSpy } = makeSut();
    const accessToken = await sut.auth(mockAuthenticationParams());
    expect(accessToken).toBe(encrypterSpy.fakeAccessToken);
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub, loadAccountByEmailRepositorySpy, encrypterSpy } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');
    await sut.auth(mockAuthenticationParams());
    expect(updateSpy).toHaveBeenCalledWith(loadAccountByEmailRepositorySpy.fakeAccountModel.id, encrypterSpy.fakeAccessToken);
  });

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(mockThrowError);
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });
});
