import { Collection, ObjectId } from 'mongodb';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import env from '@/main/config/env';

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'Ivan',
    email: 'tabarino@outlook.com',
    password: '123'
  });

  const accountId = result.insertedId.toString();
  const accessToken = sign({ accountId }, env.jwtSecret);
  await accountCollection.updateOne({
    _id: new ObjectId(accountId)
  }, {
    $set: {
      accessToken
    }
  });

  return accessToken;
};

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 200 on save survey result with access token', async () => {
      const survey = {
        question: 'Question',
        answers: [{
          image: 'http://image.com',
          answer: 'Answer 1'
        }, {
          answer: 'Answer 2'
        }],
        date: new Date()
      };
      const result = await surveyCollection.insertOne(survey);
      const surveyId = result.insertedId.toString();
      const accessToken = await makeAccessToken();
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200);
    });
  });
});
