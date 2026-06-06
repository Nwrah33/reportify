import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { FileText, Image, Presentation, Star, MoreHorizontal } from 'lucide-react';

const typeIcons: Record<string, any> = {
  REPORT: FileText,
  BROCHURE: Image,
  PRESENTATION: Presentation,
};

const typeLabels: Record<string, string> = {
  REPORT: 'تقرير',
  BROCHURE: 'بروشور',
  PRESENTATION: 'عرض تقديمي',
  CV: 'سيرة ذاتية',
  FLYER: 'نشرة',
  COMPANY_PROFILE: 'ملف شركة',
  PORTFOLIO: 'ملف إنجاز',
  SUMMARY: 'ملخص',
};

export default function ProjectCard({ project }: { project: any }) {
  const Icon = typeIcons[project.projectType] || FileText;

  return (
    <Link href={`/projects/${project.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 card-hover">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <Icon className="w-5 h-5 text-primary-600" />
          </div>
          {project.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{project.title}</h3>
        <span className="inline-block text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 mb-3">
          {typeLabels[project.projectType] || project.projectType}
        </span>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{formatDate(project.updatedAt)}</span>
          <span>{project.projectFiles?.length || 0} ملفات</span>
        </div>
      </div>
    </Link>
  );
}
