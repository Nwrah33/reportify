import api from './api';

export interface GenerateContentParams {
  prompt: string;
  projectType: string;
  templateData?: any;
  tone?: string;
  language?: string;
  additionalInstructions?: string;
}

export interface GenerateImageParams {
  prompt: string;
  style?: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
}

export interface RewriteParams {
  text: string;
  tone?: 'professional' | 'simple' | 'formal' | 'creative' | 'persuasive';
  targetAudience?: string;
}

export interface TranslateParams {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export async function generateContent(params: GenerateContentParams) {
  const { data } = await api.post('/ai/generate', params);
  return data;
}

export async function generateImage(params: GenerateImageParams) {
  const { data } = await api.post('/ai/generate-image', params);
  return data;
}

export async function analyzeFile(content: string, fileType: string, outputType: string) {
  const { data } = await api.post('/ai/analyze', { content, fileType, outputType });
  return data;
}

export async function enhanceText(text: string, style?: string, tone?: string) {
  const { data } = await api.post('/ai/enhance', { text, style, tone });
  return data;
}

export async function summarizeText(text: string, maxLength?: number) {
  const { data } = await api.post('/ai/summarize', { text, maxLength });
  return data;
}

export async function rewriteText(params: RewriteParams) {
  const { data } = await api.post('/ai/rewrite', params);
  return data;
}

export async function translateText(params: TranslateParams) {
  const { data } = await api.post('/ai/translate', params);
  return data;
}

export async function generateKeywords(text: string, maxKeywords?: number) {
  const { data } = await api.post('/ai/keywords', { text, maxKeywords });
  return data;
}

export async function checkGrammar(text: string) {
  const { data } = await api.post('/ai/grammar', { text });
  return data;
}

export async function getSuggestions(projectId: string, type?: string) {
  const { data } = await api.post('/ai/suggestions', { projectId, type });
  return data;
}
