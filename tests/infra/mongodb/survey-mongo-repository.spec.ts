import { Collection, ObjectId } from 'mongodb';
import { MongoHelper, SurveyMongoRepository } from '@/infra/db/mongodb';
import { mockAddSurveyParams } from '@/tests/domain/mocks';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const mockAccountId = async (): Promise<string> => {
  const account = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  };
  const result = await accountCollection.insertOne(account);
  return result.insertedId.toString();
};

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

describe('Survey Mongo Repository', () => {
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

  describe('Add Survey', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut();
      await sut.add({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'any_answer2'
        }],
        date: new Date()
      });
      const survey = await surveyCollection.findOne({ question: 'any_question' });
      expect(survey).toBeTruthy();
    });
  });

  describe('Load All Surveys', () => {
    test('Should load all surveys on success', async () => {
      const result = await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      }, {
        question: 'other_question',
        answers: [{
          image: 'other_image',
          answer: 'other_answer'
        }],
        date: new Date()
      }]);
      const surveyId = result.insertedIds[0].toString();
      const surveyResult = await surveyCollection.findOne({ _id: new ObjectId(surveyId) });
      const sut = makeSut();
      const accountId = await mockAccountId();
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
        answer: surveyResult.answers[0].answer,
        date: new Date()
      });
      const surveys = await sut.loadAll(accountId);
      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe('any_question');
      expect(surveys[0].didAnswer).toBe(true);
      expect(surveys[1].question).toBe('other_question');
      expect(surveys[1].didAnswer).toBe(false);
    });

    test('Should load empty list', async () => {
      const accountId = await mockAccountId();
      const sut = makeSut();
      const surveys = await sut.loadAll(accountId);
      expect(surveys.length).toBe(0);
    });
  });

  describe('Load Surveys By Id', () => {
    test('Should load survey by id on success', async () => {
      const result = await surveyCollection.insertOne(mockAddSurveyParams());
      const surveyId = result.insertedId.toString();
      const sut = makeSut();
      const survey = await sut.loadById(surveyId);
      expect(survey).toBeTruthy();
      expect(survey.id).toBeTruthy();
    });

    test('Should return null if survey does not exist', async () => {
      const sut = makeSut();
      const survey = await sut.loadById('123456789012');
      expect(survey).toBeFalsy();
    });
  });

  describe('Load Answers By Surveys Id', () => {
    test('Should load answers on success', async () => {
      const addSurveyParams = mockAddSurveyParams();
      const result = await surveyCollection.insertOne(addSurveyParams);
      const surveyId = result.insertedId.toString();
      const sut = makeSut();
      const answers = await sut.loadAnswers(surveyId);
      expect(answers).toEqual(addSurveyParams.answers.map(a => a.answer));
    });

    test('Should return empty array if survey does not exist', async () => {
      const sut = makeSut();
      const answers = await sut.loadAnswers('123456789012');
      expect(answers).toEqual([]);
    });
  });

  describe('Check Surveys By Id', () => {
    test('Should return true if survey exists', async () => {
      const result = await surveyCollection.insertOne(mockAddSurveyParams());
      const surveyId = result.insertedId.toString();
      const sut = makeSut();
      const hasSurvey = await sut.checkById(surveyId);
      expect(hasSurvey).toBe(true);
    });

    test('Should return false if survey does not exist', async () => {
      const sut = makeSut();
      const hasSurvey = await sut.checkById('123456789012');
      expect(hasSurvey).toBe(false);
    });
  });
});
