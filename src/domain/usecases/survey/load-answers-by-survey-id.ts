export namespace LoadAnswersBySurveyId {
  export type Result = string[];
}

export interface LoadAnswersBySurveyId {
  loadAnswers (surveyId: string): Promise<LoadAnswersBySurveyId.Result>;
}
