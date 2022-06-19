import { SaveSurveyResult } from '@/domain/usecases';

export namespace SaveSurveyResultRepository {
  export type Params = SaveSurveyResult.Params;
}

export interface SaveSurveyResultRepository {
  save (data: SaveSurveyResultRepository.Params): Promise<void>
}
