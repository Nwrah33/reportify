'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/shared/ProjectCard';
import EmptyState from '@/components/shared/EmptyState';
import { Plus, Search, FolderOpen, Loader2 } from 'lucide-react';
import { getProjects } from '@/lib/projects-api';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProjects({ search: search || undefined, isFavorite: filter === 'favorites' ? true : undefined, sortBy: 'updatedAt', sortOrder: 'desc', limit: 50 })
      .then(res => setProjects(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, filter]);

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مشاريعي</h1>
            <p className="text-gray-500 mt-1">جميع مشاريعك في مكان واحد</p>
          </div>
          <Link href="/create" className="bg-primary-600 text-white px-4 py-2.5 rounded-lg hover:bg-primary-700 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> مشروع جديد
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="ابحث في مشاريعك..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pr-10 pl-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex gap-2">
            {['all', 'favorites', 'recent'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm ${filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                {f === 'all' ? 'الكل' : f === 'favorites' ? 'المفضلة' : 'الأحدث'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
        ) : projects.length === 0 ? (
          <EmptyState title="لا توجد مشاريع" description="ابدأ بإنشاء مشروع جديد" icon={<FolderOpen className="w-16 h-16 text-gray-300" />} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
