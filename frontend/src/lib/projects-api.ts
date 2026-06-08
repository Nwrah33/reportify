import api from './api';

export interface Project {
  id: string;
  title: string;
  description?: string;
  projectType: string;
  status: string;
  content?: any;
  generatedContent?: any;
  settings?: any;
  fileUrl?: string;
  fileSize?: number;
  wordCount?: number;
  isFavorite: boolean;
  sharedLink?: string;
  createdAt: string;
  updatedAt: string;
  templateId?: string;
  template?: { id: string; name: string; nameAr: string; thumbnailUrl: string };
  _count?: { projectFiles: number };
}

export interface ProjectsQuery {
  search?: string;
  projectType?: string;
  status?: string;
  isFavorite?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getProjects(query?: ProjectsQuery): Promise<PaginatedResponse<Project>> {
  const params = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, String(value));
    });
  }
  const { data } = await api.get(`/projects?${params}`);
  return data;
}

export async function getProject(id: string): Promise<Project> {
  const { data } = await api.get(`/projects/${id}`);
  return data;
}

export async function getProjectBySharedLink(sharedLink: string): Promise<Project> {
  const { data } = await api.get(`/projects/shared/${sharedLink}`);
  return data;
}

export async function createProject(project: Partial<Project> & { prompt?: string }) {
  const { data } = await api.post('/projects', project);
  return data;
}

export async function createProjectWithAi(project: Partial<Project> & { prompt: string }) {
  const { data } = await api.post('/projects/create-with-ai', project);
  return data;
}

export async function updateProject(id: string, project: Partial<Project>) {
  const { data } = await api.put(`/projects/${id}`, project);
  return data;
}

export async function saveProjectContent(id: string, content: any) {
  const { data } = await api.put(`/projects/${id}/content`, content);
  return data;
}

export async function deleteProject(id: string) {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
}

export async function batchDeleteProjects(ids: string[]) {
  const { data } = await api.post('/projects/batch-delete', { ids });
  return data;
}

export async function getProjectStats() {
  const { data } = await api.get('/projects/stats');
  return data;
}

export async function getRecentProjects() {
  const { data } = await api.get('/projects/recent');
  return data;
}

export async function getFavoriteProjects() {
  const { data } = await api.get('/projects/favorites');
  return data;
}

export async function toggleFavorite(id: string) {
  const { data } = await api.post(`/projects/${id}/favorite`);
  return data;
}

export async function duplicateProject(id: string) {
  const { data } = await api.post(`/projects/${id}/duplicate`);
  return data;
}

export async function getTemplateRecommendations(projectType?: string) {
  const params = projectType ? `?projectType=${projectType}` : '';
  const { data } = await api.get(`/projects/template-recommendations${params}`);
  return data;
}
