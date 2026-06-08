import api from './api';

export interface ExportResult {
  format: string;
  fileName: string;
  downloadUrl: string;
  projectId: string;
  title: string;
  fileSize?: number;
}

export interface ExportOptions {
  pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  printBackground?: boolean;
  quality?: number;
  watermark?: boolean;
  watermarkText?: string;
}

export interface BatchExportResult {
  total: number;
  successCount: number;
  errorCount: number;
  exports: ExportResult[];
  errors: { projectId: string; error: string }[];
}

export async function exportProject(projectId: string, format: string, options?: ExportOptions): Promise<ExportResult> {
  const { data } = await api.post(`/export/${projectId}?format=${format}`, options || {});
  return data;
}

export async function batchExport(projectIds: string[], format: string, options?: ExportOptions): Promise<BatchExportResult> {
  const { data } = await api.post('/export/batch', { projectIds, format, options });
  return data;
}

export async function downloadFile(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="?([^";\n]+)"?/);
  const fileName = match ? decodeURIComponent(match[1]) : 'download';
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export async function getExportHistory(page = 1, limit = 20) {
  const { data } = await api.get(`/export/history?page=${page}&limit=${limit}`);
  return data;
}

export async function getExportStats() {
  const { data } = await api.get('/export/stats');
  return data;
}
