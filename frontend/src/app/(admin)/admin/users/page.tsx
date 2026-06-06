'use client';
import { useState } from 'react';
import { Search, MoreHorizontal, Shield, Ban, CheckCircle } from 'lucide-react';

const sampleUsers = [
  { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', role: 'مستخدم', status: 'نشط', projects: 12, joined: '٢٠٢٤/٠١/١٥' },
  { id: 2, name: 'سارة أحمد', email: 'sara@example.com', role: 'مستخدم', status: 'نشط', projects: 8, joined: '٢٠٢٤/٠٢/٢٠' },
  { id: 3, name: 'محمد علي', email: 'mohamed@example.com', role: 'مشرف', status: 'نشط', projects: 45, joined: '٢٠٢٣/١١/٠١' },
  { id: 4, name: 'نورة خالد', email: 'noura@example.com', role: 'مستخدم', status: 'محظور', projects: 2, joined: '٢٠٢٤/٠٣/١٠' },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-2">إدارة المستخدمين</h1>
        <p className="text-gray-500 mb-6">عرض وإدارة جميع مستخدمي المنصة</p>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="بحث عن مستخدم..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pr-10 pl-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-right p-4 text-sm font-semibold">الاسم</th>
                <th className="text-right p-4 text-sm font-semibold">البريد</th>
                <th className="text-right p-4 text-sm font-semibold">الدور</th>
                <th className="text-right p-4 text-sm font-semibold">الحالة</th>
                <th className="text-right p-4 text-sm font-semibold">المشاريع</th>
                <th className="text-right p-4 text-sm font-semibold">تاريخ التسجيل</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {sampleUsers.map((u) => (
                <tr key={u.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-sm text-gray-500">{u.email}</td>
                  <td className="p-4 text-sm">{u.role}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.status === 'نشط' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span>
                  </td>
                  <td className="p-4 text-sm">{u.projects}</td>
                  <td className="p-4 text-sm text-gray-500">{u.joined}</td>
                  <td className="p-4">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
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
