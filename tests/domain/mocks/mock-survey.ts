import { faker } from '@faker-js/faker';
import { SurveyModel } from '@/domain/models';
import { AddSurvey } from '@/domain/usecases';

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.random.words(),
  answers: [{
    answer: faker.random.word(),
    image: faker.image.imageUrl()
  }],
  date: faker.date.recent()
});

export const mockSurveyModel = (): SurveyModel => {
  return {
    id: faker.datatype.uuid(),
    question: faker.random.words(),
    answers: [
      {
        answer: faker.random.word()
      },
      {
        answer: faker.random.word(),
        image: faker.image.imageUrl()
      }
    ],
    date: faker.date.recent()
  };
};

export const mockSurveyModels = (): SurveyModel[] => ([
  mockSurveyModel(),
  mockSurveyModel()
]);
