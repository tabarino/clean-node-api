import { faker } from '@faker-js/faker';
import { SurveyResultModel } from '@/domain/models';
import { SaveSurveyResultParams } from '@/domain/usecases';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  answer: faker.random.words(),
  date: faker.date.recent()
});

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [{
    answer: faker.random.word(),
    count: faker.datatype.number({ min: 0, max: 1000 }),
    percent: faker.datatype.number({ min: 0, max: 100 }),
    isCurrentAccountAnswer: true
  }, {
    answer: faker.random.word(),
    image: faker.image.imageUrl(),
    count: faker.datatype.number({ min: 0, max: 1000 }),
    percent: faker.datatype.number({ min: 0, max: 100 }),
    isCurrentAccountAnswer: false
  }],
  date: faker.date.recent()
});

export const mockEmptySurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [{
    answer: faker.random.word(),
    image: faker.image.imageUrl(),
    count: faker.datatype.number({ min: 0, max: 1000 }),
    percent: faker.datatype.number({ min: 0, max: 100 }),
    isCurrentAccountAnswer: false
  }],
  date: faker.date.recent()
});
