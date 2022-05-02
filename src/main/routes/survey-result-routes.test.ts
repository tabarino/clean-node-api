// import { ObjectId } from 'mongodb';
// import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
// import env from '@/main/config/env';

// const makeAccessToken = async (): Promise<string> => {
//   const result = await accountCollection.insertOne({
//     name: 'Ivan',
//     email: 'tabarino@outlook.com',
//     password: '123',
//     role: 'admin'
//   });

//   const accountId = result.insertedId.toString();
//   const accessToken = sign({ accountId }, env.jwtSecret);
//   await accountCollection.updateOne({
//     _id: new ObjectId(accountId)
//   }, {
//     $set: {
//       accessToken
//     }
//   });

//   return accessToken;
// };

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without access token', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403);
    });
  });
});
