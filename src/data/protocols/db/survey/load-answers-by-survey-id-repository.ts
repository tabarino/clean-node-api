export namespace LoadAnswersBySurveyIdRepository {
  export type Result = string[];
}

export interface LoadAnswersBySurveyIdRepository {
  loadAnswers (id: string): Promise<LoadAnswersBySurveyIdRepository.Result>
}
