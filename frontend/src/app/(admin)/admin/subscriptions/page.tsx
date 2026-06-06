'use client';
import { Search, CreditCard } from 'lucide-react';

const sampleSubscriptions = [
  { id: 1, user: 'أحمد محمد', plan: 'شهري', status: 'نشط', amount: '٩٩ ر.س', endDate: '٢٠٢٤/٠٧/١٥' },
  { id: 2, user: 'سارة أحمد', plan: 'سنوي', status: 'نشط', amount: '٤٩٩ ر.س', endDate: '٢٠٢٥/٠٢/٢٠' },
  { id: 3, user: 'محمد علي', plan: 'مجاني', status: 'تجريبي', amount: '٠ ر.س', endDate: '٢٠٢٤/٠٦/٠١' },
  { id: 4, user: 'نورة خالد', plan: 'شهري', status: 'ملغي', amount: '٩٩ ر.س', endDate: '٢٠٢٤/٠٥/١٠' },
];

export default function AdminSubscriptionsPage() {
  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-2">إدارة الاشتراكات</h1>
        <p className="text-gray-500 mb-6">مراقبة وإدارة اشتراكات المستخدمين</p>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'إجمالي الاشتراكات', value: '١,٢٣٤', color: 'text-blue-600' },
            { label: 'نشط', value: '٨٩٠', color: 'text-green-600' },
            { label: 'ملغي', value: '٢٣٤', color: 'text-red-600' },
            { label: 'تجريبي', value: '١١٠', color: 'text-yellow-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-right p-4 text-sm font-semibold">المستخدم</th>
                <th className="text-right p-4 text-sm font-semibold">الباقة</th>
                <th className="text-right p-4 text-sm font-semibold">الحالة</th>
                <th className="text-right p-4 text-sm font-semibold">المبلغ</th>
                <th className="text-right p-4 text-sm font-semibold">تاريخ الانتهاء</th>
              </tr>
            </thead>
            <tbody>
              {sampleSubscriptions.map((s) => (
                <tr key={s.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="p-4 font-medium">{s.user}</td>
                  <td className="p-4 text-sm">{s.plan}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      s.status === 'نشط' ? 'bg-green-100 text-green-700' :
                      s.status === 'ملغي' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{s.status}</span>
                  </td>
                  <td className="p-4 text-sm">{s.amount}</td>
                  <td className="p-4 text-sm text-gray-500">{s.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
