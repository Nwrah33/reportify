'use client';
import Link from 'next/link';
import { Download, Trash2, FileText } from 'lucide-react';

export default function DataManagementPage() {
  return (
    <div className="py-12">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">إدارة البيانات الشخصية</h1>
        <p className="text-gray-500 mb-8">تحكم في بياناتك الشخصية المخزنة على المنصة</p>
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 flex items-center justify-between">
            <div><h3 className="font-semibold">تصدير البيانات</h3><p className="text-sm text-gray-500">قم بتصدير جميع بياناتك المخزنة على المنصة</p></div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm flex items-center gap-2"><Download className="w-4 h-4" /> تصدير</button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 flex items-center justify-between">
            <div><h3 className="font-semibold">تصدير المشاريع</h3><p className="text-sm text-gray-500">تصدير جميع مشاريعك بصيغ مختلفة</p></div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm flex items-center gap-2"><FileText className="w-4 h-4" /> تصدير</button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 flex items-center justify-between">
            <div><h3 className="font-semibold">حذف البيانات</h3><p className="text-sm text-gray-500">حذف جميع بياناتك من المنصة</p></div>
            <Link href="/delete-account" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm flex items-center gap-2"><Trash2 className="w-4 h-4" /> حذف</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
