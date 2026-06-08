'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Image, Presentation, Plus, Settings as SettingsIcon, CreditCard, Activity, Download, Loader2 } from 'lucide-react';
import { getProjectStats, getRecentProjects } from '@/lib/projects-api';

const typeIcons: Record<string, any> = {
  REPORT: FileText,
  BROCHURE: Image,
  PRESENTATION: Presentation,
};

const typeLabels: Record<string, string> = {
  REPORT: 'تقرير',
  BROCHURE: 'بروشور',
  PRESENTATION: 'عرض تقديمي',
};

const statusLabels: Record<string, string> = {
  COMPLETED: 'مكتمل',
  DRAFT: 'مسودة',
  IN_PROGRESS: 'قيد التنفيذ',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProjectStats().catch(() => null),
      getRecentProjects().catch(() => []),
    ]).then(([statsData, recentData]) => {
      if (statsData) setStats(statsData);
      if (recentData) setRecent(recentData);
    }).finally(() => setLoading(false));
  }, []);

  const completedCount = stats?.byStatus?.find((s: any) => s.status === 'COMPLETED')?._count || 0;
  const draftCount = stats?.byStatus?.find((s: any) => s.status === 'DRAFT')?._count || 0;

  const statsCards = [
    { label: 'إجمالي المشاريع', value: stats?.total ?? '—', icon: FileText, change: `${completedCount} مكتمل`, color: 'bg-blue-500' },
    { label: 'المشاريع المكتملة', value: String(completedCount), icon: Download, change: `${draftCount} مسودة`, color: 'bg-green-500' },
    { label: 'أنواع المشاريع', value: stats?.byType?.length ? `${stats.byType.length} أنواع` : '—', icon: Activity, change: stats?.byType?.map((t: any) => typeLabels[t.projectType] || t.projectType).join('، ') || '—', color: 'bg-purple-500' },
    { label: 'الباقة الحالية', value: 'مجانية', icon: CreditCard, change: 'ترقية', color: 'bg-orange-500' },
  ];

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مرحباً، {user?.name || 'المستخدم'}</h1>
            <p className="text-gray-500 mt-1">نظرة عامة على مشاريعك ونشاطك</p>
          </div>
          <Link href="/create" className="bg-primary-600 text-white px-4 py-2.5 rounded-lg hover:bg-primary-700 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> مشروع جديد
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {statsCards.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">آخر المشاريع</h2>
                  <Link href="/projects" className="text-sm text-primary-600 hover:text-primary-700">عرض الكل</Link>
                </div>
                <div className="space-y-3">
                  {recent.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">لا توجد مشاريع بعد</p>
                  ) : recent.map((project) => {
                    const Icon = typeIcons[project.projectType] || FileText;
                    const typeLabel = typeLabels[project.projectType] || project.projectType;
                    const statusLabel = statusLabels[project.status] || project.status;
                    const isComplete = project.status === 'COMPLETED';
                    return (
                      <Link key={project.id} href={`/projects/${project.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{project.title}</p>
                            <p className="text-xs text-gray-500">{typeLabel}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${isComplete ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{statusLabel}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4">إجراءات سريعة</h2>
            <div className="space-y-3">
              <Link href="/create" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <Plus className="w-5 h-5 text-primary-600" /> <span>مشروع جديد</span>
              </Link>
              <Link href="/templates" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <Image className="w-5 h-5 text-primary-600" /> <span>استعراض القوالب</span>
              </Link>
              <Link href="/pricing" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <CreditCard className="w-5 h-5 text-primary-600" /> <span>ترقية الباقة</span>
              </Link>
              <Link href="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <SettingsIcon className="w-5 h-5 text-gray-500" /> <span>الإعدادات</span>
              </Link>
              <Link href="/billing" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <CreditCard className="w-5 h-5 text-gray-500" /> <span>الفواتير</span>
              </Link>
            </div>
          </div>
        </div>
      </>
      )}
    </div>
    </div>
  );
}
