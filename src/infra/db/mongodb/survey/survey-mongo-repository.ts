import { MongoHelper } from '../helpers/mongo-helper';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';
import { AddSurveyRepository } from '../../../../data/usecases/add-survey/db-add-survey-protocols';
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository';
import { SurveyModel } from '../../../../domain/models/survey';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection.find().toArray() as SurveyModel[];
    return surveys;
  }
}
