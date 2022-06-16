import { faker } from '@faker-js/faker';
import { Hasher, HashComparer, Encrypter, Decrypter } from '@/data/protocols';

export class HasherSpy implements Hasher {
  hashedValue = faker.random.alphaNumeric(16);
  value: string;

  async hash (value: string): Promise<string> {
    this.value = value;
    return Promise.resolve(this.hashedValue);
  }
}

export class HashComparerSpy implements HashComparer {
  value: string;
  hash: string;
  isValid = true;

  async compare (value: string, hash: string): Promise<boolean> {
    this.value = value;
    this.hash = hash;
    return this.isValid;
  }
}

export class EncrypterSpy implements Encrypter {
  accessToken = faker.random.alpha(32);
  value: string;

  async encrypt (value: string): Promise<string> {
    this.value = value;
    return Promise.resolve(this.accessToken);
  }
}

export class DecrypterSpy implements Decrypter {
  value = faker.internet.password();
  token: string;

  async decrypt (token: string): Promise<string> {
    this.token = token;
    return this.value;
  }
}
