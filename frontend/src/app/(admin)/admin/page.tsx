'use client';
import Link from 'next/link';
import { Users, FileText, CreditCard, TrendingUp, Template, MessageSquare, DollarSign, Activity } from 'lucide-react';

const stats = [
  { label: 'إجمالي المستخدمين', value: '١,٢٣٤', change: '+١٢٪', icon: Users, color: 'bg-blue-500' },
  { label: 'إجمالي المشاريع', value: '٥,٦٧٨', change: '+٢٣٪', icon: FileText, color: 'bg-green-500' },
  { label: 'القوالب', value: '١٢٠', change: '+٥', icon: Template, color: 'bg-purple-500' },
  { label: 'الإيرادات', value: '٤٥,٦٧٠ ر.س', change: '+١٨٪', icon: DollarSign, color: 'bg-orange-500' },
];

const quickLinks = [
  { label: 'إدارة المستخدمين', href: '/admin/users', icon: Users, color: 'text-blue-600 bg-blue-100' },
  { label: 'إدارة القوالب', href: '/admin/templates', icon: Template, color: 'text-purple-600 bg-purple-100' },
  { label: 'الاشتراكات', href: '/admin/subscriptions', icon: CreditCard, color: 'text-green-600 bg-green-100' },
  { label: 'الإحصائيات', href: '/admin/analytics', icon: TrendingUp, color: 'text-orange-600 bg-orange-100' },
];

export default function AdminDashboard() {
  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-2">لوحة الإدارة</h1>
        <p className="text-gray-500 mb-8">مرحباً بك في لوحة التحكم الرئيسية للإدارة</p>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xs text-green-600 mt-1">{stat.change} عن الشهر الماضي</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">إجراءات سريعة</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {quickLinks.map((link, i) => (
            <Link key={i} href={link.href} className="bg-white dark:bg-gray-800 rounded-xl border p-6 card-hover">
              <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center mb-3`}>
                <link.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">{link.label}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
