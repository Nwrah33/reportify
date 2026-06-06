'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SubscriptionManagePage() {
  return (
    <div className="py-12">
      <div className="container-custom max-w-3xl">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"><ArrowLeft className="w-4 h-4" /> العودة للوحة التحكم</Link>
        <h1 className="text-3xl font-bold mb-8">إدارة الاشتراك</h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">الاشتراك الحالي</h2>
          <div className="flex items-center justify-between py-3 border-b"><span className="text-gray-500">الباقة</span><span className="font-semibold">مجانية</span></div>
          <div className="flex items-center justify-between py-3 border-b"><span className="text-gray-500">الحالة</span><span className="text-green-600 font-semibold">نشط</span></div>
          <div className="flex items-center justify-between py-3"><span className="text-gray-500">تاريخ البدء</span><span>١ يناير ٢٠٢٤</span></div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">إجراءات</h2>
          <div className="space-y-3">
            <Link href="/pricing" className="block w-full text-right px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"><span>ترقية الباقة</span><span className="text-primary-600 text-sm">←</span></Link>
            <button className="w-full text-right px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"><span>إلغاء الاشتراك</span><span className="text-red-600 text-sm">←</span></button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border p-6"><h2 className="text-xl font-semibold mb-4">الفواتير السابقة</h2><p className="text-gray-500 text-sm">لا توجد فواتير سابقة</p></div>
      </div>
    </div>
  );
}
