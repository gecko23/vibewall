export interface GeneratedImage {
  id: string;
  base64: string;
  prompt: string;
  aspectRatio: string;
  createdAt: number;
}

export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:3' | '3:4';

export interface GenerateConfig {
  prompt: string;
  aspectRatio: AspectRatio;
}

export interface GenerationError {
  message: string;
  details?: string;
}
