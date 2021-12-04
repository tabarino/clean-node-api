import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { Collection, ObjectId } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '../config/env';

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'Ivan',
    email: 'tabarino@outlook.com',
    password: '123',
    role: 'admin'
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

describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without access token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [
            { image: 'http://image-name1.com', answer: 'any_answer' },
            { image: 'http://image-name2.com', answer: 'any_answer2' }
          ]
        })
        .expect(403);
    });

    test('Should return 204 on add survey with valid access token', async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [
            { image: 'http://image-name1.com', answer: 'any_answer' },
            { image: 'http://image-name2.com', answer: 'any_answer2' }
          ]
        })
        .expect(204);
    });
  });

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without access token', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403);
    });

    test('Should return 200 on load surveys with valid access token', async () => {
      const accessToken = await makeAccessToken();

      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      }]);

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200);
    });
  });
});
