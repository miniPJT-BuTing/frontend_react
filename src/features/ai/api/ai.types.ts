export interface AiAnalysisResult {
  faceShapeId: number;
  name: string;
  nickname: string;
  description: string;
  image: string;
  percentage?: number;
}

export type AiGender = 'M' | 'W';
