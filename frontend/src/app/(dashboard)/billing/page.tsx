'use client';
import Link from 'next/link';
import { CreditCard, FileText, Download, ArrowLeft } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="py-8">
      <div className="container-custom max-w-3xl">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> العودة
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">الفواتير والمدفوعات</h1>
        <p className="text-gray-500 mb-8">سجل الفواتير وطرق الدفع</p>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4">طريقة الدفع</h2>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">لا توجد بطاقة دفع مضافة</span>
            </div>
            <button className="mt-3 text-primary-600 text-sm hover:text-primary-700">إضافة بطاقة دفع</button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4">الفواتير السابقة</h2>
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد فواتير سابقة</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4">سجل المدفوعات</h2>
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد مدفوعات سابقة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
