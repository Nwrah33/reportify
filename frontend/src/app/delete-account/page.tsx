'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AlertTriangle } from 'lucide-react';

export default function DeleteAccountPage() {
  const { logout } = useAuth();
  const [confirm, setConfirm] = useState('');
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async () => { if (confirm === 'حذف') { setDeleted(true); setTimeout(() => logout(), 2000); } };

  if (deleted) return <div className="py-20 text-center"><h2 className="text-2xl font-bold mb-2">تم حذف الحساب</h2><p className="text-gray-500">سيتم تسجيل الخروج تلقائياً...</p></div>;

  return (
    <div className="py-12">
      <div className="container-custom max-w-lg">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border p-8">
          <div className="flex items-center gap-3 mb-6 text-red-600"><AlertTriangle className="w-8 h-8" /><h1 className="text-2xl font-bold">حذف الحساب</h1></div>
          <p className="text-gray-500 mb-6">هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع مشاريعك وبياناتك بشكل دائم.</p>
          <p className="text-sm text-gray-500 mb-4">اكتب "حذف" لتأكيد حذف حسابك:</p>
          <input type="text" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder='اكتب "حذف"' className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700 mb-4" />
          <button onClick={handleDelete} disabled={confirm !== 'حذف'} className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold">حذف الحساب نهائياً</button>
        </div>
      </div>
    </div>
  );
}
