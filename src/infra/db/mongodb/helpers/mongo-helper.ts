import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },

  async disconnect (): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri);
    }
    return this.client.db().collection(name);
  },

  async map (collection: any, id: string): Promise<any> {
    const collectionWithId = { ...collection, id };
    return await new Promise(resolve => resolve(collectionWithId));
  }
};
