'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, FileText, ChevronDown, LogOut, Settings, User, Layout as LayoutIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-800">
              <FileText className="w-6 h-6" />
              <span>Reportify</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/templates" className="text-gray-600 hover:text-primary-600 transition-colors">القوالب</Link>
              <Link href="/create" className="text-gray-600 hover:text-primary-600 transition-colors">إنشاء مشروع</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-primary-600 transition-colors">الباقات</Link>
              <Link href="/faq" className="text-gray-600 hover:text-primary-600 transition-colors">الأسئلة الشائعة</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm font-medium">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showDropdown && (
                  <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <LayoutIcon className="w-4 h-4" /> لوحة التحكم
                    </Link>
                    <Link href="/projects" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FileText className="w-4 h-4" /> مشاريعي
                    </Link>
                    <Link href="/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Settings className="w-4 h-4" /> الإعدادات
                    </Link>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button onClick={logout} className="flex items-center gap-2 px-4 py-2 w-full text-right hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
                      <LogOut className="w-4 h-4" /> تسجيل خروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-gray-600 hover:text-primary-600 transition-colors">دخول</Link>
                <Link href="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">ابدأ مجاناً</Link>
              </div>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
            <Link href="/templates" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">القوالب</Link>
            <Link href="/create" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">إنشاء مشروع</Link>
            <Link href="/pricing" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">الباقات</Link>
            <Link href="/faq" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">الأسئلة الشائعة</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
