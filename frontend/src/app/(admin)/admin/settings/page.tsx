'use client';
import { useState } from 'react';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">إعدادات الإدارة</h1>
        <p className="text-gray-500 mb-8">إعدادات عامة للمنصة</p>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">الإعدادات العامة</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم المنصة</label>
                <input type="text" defaultValue="Reportify" className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <textarea rows={3} defaultValue="منصة إنشاء التقارير والبروشورات الذكية" className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">حدود الاستخدام</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">الباقة المجانية - المشاريع</label>
                  <input type="number" defaultValue={5} className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الباقة الشهرية - المشاريع</label>
                  <input type="number" defaultValue={100} className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الباقة السنوية - المشاريع</label>
                  <input type="number" defaultValue={9999} className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">مفاتيح API</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">OpenAI API Key</label>
                <input type="password" defaultValue="sk-..." className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stripe Secret Key</label>
                <input type="password" defaultValue="sk_live_..." className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700 font-mono text-sm" />
              </div>
            </div>
          </div>

          <button onClick={handleSave} className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 inline-flex items-center gap-2">
            <Save className="w-4 h-4" /> {saved ? 'تم الحفظ' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>
    </div>
  );
}
