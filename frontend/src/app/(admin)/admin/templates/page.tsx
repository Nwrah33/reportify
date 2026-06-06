'use client';
import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

const sampleTemplates = [
  { id: 1, name: 'تقرير أعمال - أزرق عصري', category: 'تقارير الأعمال', downloads: 1234, status: 'منشور', premium: false },
  { id: 2, name: 'بروشور شركة - مينيمال', category: 'بروشورات', downloads: 892, status: 'منشور', premium: false },
  { id: 3, name: 'تقرير أكاديمي - جامعة', category: 'تقارير جامعية', downloads: 2156, status: 'منشور', premium: true },
  { id: 4, name: 'سيرة ذاتية - احترافية', category: 'سير ذاتية', downloads: 5678, status: 'مسودة', premium: false },
];

export default function AdminTemplatesPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة القوالب</h1>
            <p className="text-gray-500">إضافة وتعديل وحذف القوالب</p>
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> قالب جديد
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="بحث عن قالب..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pr-10 pl-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-right p-4 text-sm font-semibold">الاسم</th>
                <th className="text-right p-4 text-sm font-semibold">التصنيف</th>
                <th className="text-right p-4 text-sm font-semibold">التحميلات</th>
                <th className="text-right p-4 text-sm font-semibold">الحالة</th>
                <th className="text-right p-4 text-sm font-semibold">مميز</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {sampleTemplates.map((t) => (
                <tr key={t.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="p-4 font-medium">{t.name}</td>
                  <td className="p-4 text-sm text-gray-500">{t.category}</td>
                  <td className="p-4 text-sm">{t.downloads.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'منشور' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.status}</span>
                  </td>
                  <td className="p-4">{t.premium ? <span className="text-yellow-600">★</span> : '-'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Eye className="w-4 h-4" /></button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Edit className="w-4 h-4" /></button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
