import { ObjectId } from 'mongodb';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { AddSurveyModel } from '@/domain/usecases/add-survey';
import { AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { SurveyModel } from '@/domain/models/survey';
import { LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    return await surveyCollection.find().toArray() as SurveyModel[];
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) }) as SurveyModel;
    return survey;
  }

  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  }
}
