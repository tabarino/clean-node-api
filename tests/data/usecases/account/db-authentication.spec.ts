import { DbAuthentication } from '@/data/usecases';
import { mockAuthenticationParams, mockThrowError } from '@/tests/domain/mocks';
import { EncrypterSpy, HashComparerSpy, LoadAccountByEmailRepositorySpy, UpdateAccessTokenRepositorySpy } from '@/tests/data/mocks';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
  hashComparerSpy: HashComparerSpy;
  encrypterSpy: EncrypterSpy;
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  const hashComparerSpy = new HashComparerSpy();
  const encrypterSpy = new EncrypterSpy();
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  );
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountbyEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    const authenticationParams = mockAuthenticationParams();
    await sut.auth(authenticationParams);
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
    loadAccountByEmailRepositorySpy.accountModel = null;
    const authenticationResult = await sut.auth(mockAuthenticationParams());
    expect(authenticationResult).toBeNull();
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut();
    const authenticationParams = mockAuthenticationParams();
    await sut.auth(authenticationParams);
    expect(hashComparerSpy.value).toBe(authenticationParams.password);
    expect(hashComparerSpy.hash).toBe(loadAccountByEmailRepositorySpy.accountModel.password);
  });

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut();
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(mockThrowError);
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut();
    hashComparerSpy.isValid = false;
    const authenticationResult = await sut.auth(mockAuthenticationParams());
    expect(authenticationResult).toBeNull();
  });

  test('Should call Encrypter with correct value', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut();
    await sut.auth(mockAuthenticationParams());
    expect(encrypterSpy.value).toBe(loadAccountByEmailRepositorySpy.accountModel.id);
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut();
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(mockThrowError);
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return a token on success', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut();
    const { name, accessToken } = await sut.auth(mockAuthenticationParams());
    expect(name).toBe(loadAccountByEmailRepositorySpy.accountModel.name);
    expect(accessToken).toBe(encrypterSpy.accessToken);
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositorySpy, loadAccountByEmailRepositorySpy, encrypterSpy } = makeSut();
    await sut.auth(mockAuthenticationParams());
    expect(updateAccessTokenRepositorySpy.id).toBe(loadAccountByEmailRepositorySpy.accountModel.id);
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.accessToken);
  });

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut();
    jest.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken').mockImplementationOnce(mockThrowError);
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });
});
