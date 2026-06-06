'use client';
import { TrendingUp, Users, FileText, DollarSign, Activity } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-2">الإحصائيات</h1>
        <p className="text-gray-500 mb-8">تحليلات وإحصائيات شاملة للمنصة</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="w-5 h-5" /> المستخدمون</h2>
            <div className="space-y-3">
              {[
                { label: 'مستخدمون جدد (هذا الشهر)', value: '١٢٤' },
                { label: 'مستخدمون نشطون', value: '٨٩٠' },
                { label: 'معدل النمو', value: '+١٢٪' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> المشاريع</h2>
            <div className="space-y-3">
              {[
                { label: 'مشاريع جديدة (هذا الشهر)', value: '٣٤٥' },
                { label: 'إجمالي المشاريع', value: '٥,٦٧٨' },
                { label: 'معدل الإنجاز', value: '٨٧٪' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5" /> الإيرادات</h2>
            <div className="space-y-3">
              {[
                { label: 'إيرادات هذا الشهر', value: '٢٥,٤٣٠ ر.س' },
                { label: 'إيرادات هذا العام', value: '١٨٩,٢٠٠ ر.س' },
                { label: 'معدل النمو', value: '+٢٣٪' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Activity className="w-5 h-5" /> النشاط</h2>
            <div className="space-y-3">
              {[
                { label: 'متوسط الاستخدام اليومي', value: '٣٤٥' },
                { label: 'أكثر قالب استخداماً', value: 'تقرير أعمال' },
                { label: 'نسبة التحويل', value: '٥.٢٪' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
