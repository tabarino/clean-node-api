export type SurveyModel = {
  id: string;
  question: string;
  didAnswer?: boolean;
  answers: SurveyAnswerModel[];
  date: Date;
}

type SurveyAnswerModel = {
  image?: string;
  answer: string;
}
