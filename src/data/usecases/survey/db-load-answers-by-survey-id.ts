import { LoadAnswersBySurveyId } from '@/domain/usecases';
import { LoadSurveyByIdRepository } from '@/data/protocols';

export class DbLoadAnswersBySurveyId implements LoadAnswersBySurveyId {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) { }

  async loadAnswers (surveyId: string): Promise<LoadAnswersBySurveyId.Result> {
    const survey = await this.loadSurveyByIdRepository.loadById(surveyId);
    return survey?.answers.map(a => a.answer) || [];
  }
}
