import { faker } from '@faker-js/faker';
import { Hasher } from '@/data/protocols/cryptography/hasher';
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer';
import { Encrypter } from '@/data/protocols/cryptography/encrypter';
import { Decrypter } from '@/data/protocols/cryptography/decrypter';

// https://github.com/rmanguinho/clean-ts-api/commit/537d53d72874539b749e65ce55633265084e9297

// export const mockHasher = (): Hasher => {
//   class HasherStub implements Hasher {
//     async hash (value: string): Promise<string> {
//       return await Promise.resolve('hashed_password');
//     }
//   }
//   return new HasherStub();
// };

export class HasherSpy implements Hasher {
  fakeHash = faker.random.alpha(16);
  value: string;

  async hash (value: string): Promise<string> {
    this.value = value;
    return Promise.resolve(this.fakeHash);
  }
}

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true);
    }
  }
  return new HashComparerStub();
};

// export const mockEncrypter = (): Encrypter => {
//   class EncrypterStub implements Encrypter {
//     async encrypt (value: string): Promise<string> {
//       return await Promise.resolve('any_token');
//     }
//   }
//   return new EncrypterStub();
// };

export class EncrypterSpy implements Encrypter {
  fakeAccessToken = faker.random.alpha(32);
  value: string;

  async encrypt (value: string): Promise<string> {
    this.value = value;
    return Promise.resolve(this.fakeAccessToken);
  }
}

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<string> {
      return await Promise.resolve('any_value');
    }
  }
  return new DecrypterStub();
};
