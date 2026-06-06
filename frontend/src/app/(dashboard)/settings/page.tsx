'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Bell, Shield, Save } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUser({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">الإعدادات</h1>
        <p className="text-gray-500 mb-8">إدارة حسابك وإعداداتك الشخصية</p>

        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><User className="w-5 h-5" /> الملف الشخصي</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                <div className="flex items-center gap-2 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-500">
                  <Mail className="w-4 h-4" /> {user?.email}
                </div>
              </div>
              <button onClick={handleSave} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 inline-flex items-center gap-2">
                <Save className="w-4 h-4" /> {saved ? 'تم الحفظ' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5" /> الأمان</h2>
            <div className="space-y-3">
              <button className="w-full text-right px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between">
                <span>تغيير كلمة المرور</span>
                <span className="text-gray-400">←</span>
              </button>
              <button className="w-full text-right px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between">
                <span>تفعيل المصادقة الثنائية</span>
                <span className="text-gray-400">←</span>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Bell className="w-5 h-5" /> الإشعارات</h2>
            <div className="space-y-3">
              {['إشعارات البريد الإلكتروني', 'إشعارات المشاريع', 'عروض وخصومات'].map((item) => (
                <label key={item} className="flex items-center justify-between py-2">
                  <span>{item}</span>
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                </label>
              ))}
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4">البيانات</h2>
            <div className="space-y-3">
              <Link href="/data-management" className="block w-full text-right px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between">
                <span>إدارة البيانات الشخصية</span>
                <span className="text-gray-400">←</span>
              </Link>
              <Link href="/delete-account" className="block w-full text-right px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between">
                <span className="text-red-600">حذف الحساب</span>
                <span className="text-red-400">←</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
