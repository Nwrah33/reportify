'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Image, Presentation, Plus, ArrowLeft, Settings as SettingsIcon, CreditCard, Activity, TrendingUp, Users, Download } from 'lucide-react';

const statsCards = [
  { label: 'إجمالي المشاريع', value: '١٢', icon: FileText, change: '+٣ هذا الشهر', color: 'bg-blue-500' },
  { label: 'التصدير هذا الشهر', value: '٨', icon: Download, change: 'من ١٠', color: 'bg-green-500' },
  { label: 'استهلاك الرصيد', value: '٤٠٪', icon: Activity, change: '٤ من ١٠', color: 'bg-purple-500' },
  { label: 'الباقة الحالية', value: 'مجانية', icon: CreditCard, change: 'ترقية', color: 'bg-orange-500' },
];

const recentProjects = [
  { id: 1, title: 'تقرير يوم التأسيس', type: 'تقرير', date: 'منذ يومين', status: 'مكتمل' },
  { id: 2, title: 'بروشور الأمن السيبراني', type: 'بروشور', date: 'منذ ٥ أيام', status: 'مكتمل' },
  { id: 3, title: 'عرض تقديمي للمشروع', type: 'عرض تقديمي', date: 'منذ أسبوع', status: 'مسودة' },
];

export default function DashboardPage() {
  const { user } = useAuth();

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

        {/* Stats */}
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
          {/* Recent Projects */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">آخر المشاريع</h2>
              <Link href="/projects" className="text-sm text-primary-600 hover:text-primary-700">عرض الكل</Link>
            </div>
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      {project.type === 'تقرير' ? <FileText className="w-5 h-5 text-primary-600" /> : project.type === 'بروشور' ? <Image className="w-5 h-5 text-primary-600" /> : <Presentation className="w-5 h-5 text-primary-600" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{project.title}</p>
                      <p className="text-xs text-gray-500">{project.type} · {project.date}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'مكتمل' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{project.status}</span>
                </Link>
              ))}
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
      </div>
    </div>
  );
}
