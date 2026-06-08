'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Lock, Check, Loader2 } from 'lucide-react';

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('كلمة المرور غير متطابقة'); return; }
    if (password.length < 6) { setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل إعادة تعيين كلمة المرور');
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">رابط غير صالح</h2>
          <p className="text-gray-500 mb-4">رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية</p>
          <Link href="/forgot-password" className="text-primary-600 hover:text-primary-700">طلب رابط جديد</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reportify</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">تم إعادة التعيين بنجاح</h2>
              <p className="text-gray-500 mb-6 text-sm">يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة</p>
              <Link href="/login" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">تسجيل الدخول</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold mb-2">إعادة تعيين كلمة المرور</h2>
              <p className="text-gray-500 mb-6 text-sm">أدخل كلمة المرور الجديدة</p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">كلمة المرور الجديدة</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pr-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="••••••••" required minLength={6} />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">تأكيد كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pr-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="••••••••" required minLength={6} />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                إعادة تعيين كلمة المرور
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><p className="text-gray-500">جاري التحميل...</p></div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
