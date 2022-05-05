import { Collection, ObjectId } from 'mongodb';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { SurveyModel } from '@/domain/models/survey';
import { AccountModel } from '@/domain/models/account';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

const mockSurvey = async (): Promise<SurveyModel> => {
  const survey = {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer1'
    }, {
      answer: 'any_answer2'
    }, {
      answer: 'any_answer3'
    }],
    date: new Date()
  };
  const result = await surveyCollection.insertOne(survey);
  const surveyId = result.insertedId.toString();
  return {
    ...survey,
    id: surveyId
  };
};

const mockAccount = async (): Promise<AccountModel> => {
  const account = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  };
  const result = await accountCollection.insertOne(account);
  const accountId = result.insertedId.toString();
  return {
    ...account,
    id: accountId
  };
};

describe('Survey Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await surveyResultCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('Save Survey Result', () => {
    test('Should create a survey result if it is new', async () => {
      const sut = makeSut();
      const survey = await mockSurvey();
      const account = await mockAccount();
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      });
      const surveyResult = await surveyResultCollection
        .findOne({
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id)
        });
      expect(surveyResult).toBeTruthy();
    });

    test('Should update a survey result if it is not new', async () => {
      const sut = makeSut();
      const survey = await mockSurvey();
      const account = await mockAccount();
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      });
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      });
      const surveyResult = await surveyResultCollection
        .find({
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id)
        }).toArray();
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.length).toBe(1);
    });
  });

  describe('Load Survey Result by Survey Id', () => {
    test('Should load survey result', async () => {
      const sut = makeSut();
      const survey = await mockSurvey();
      const account = await mockAccount();
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }]);
      const surveyResult = await sut.loadBySurveyId(survey.id);
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId.toString()).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(50);
      expect(surveyResult.answers[1].count).toBe(2);
      expect(surveyResult.answers[1].percent).toBe(50);
      expect(surveyResult.answers[2].count).toBe(0);
      expect(surveyResult.answers[2].percent).toBe(0);
    });

    test('Should return null if load survey result aggregate returns null', async () => {
      const sut = makeSut();
      const survey = await mockSurvey();
      const surveyResult = await sut.loadBySurveyId(survey.id);
      expect(surveyResult).toBeNull();
    });
  });
});
