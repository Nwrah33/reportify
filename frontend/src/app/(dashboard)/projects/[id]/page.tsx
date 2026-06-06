'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Download, Trash2, Star, Sparkles, Palette, Type, Image as ImageIcon, Save } from 'lucide-react';

export default function ProjectEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('edit');
  const [content, setContent] = useState('');

  const tabs = [
    { id: 'edit', label: 'تعديل المحتوى', icon: Edit },
    { id: 'design', label: 'التصميم', icon: Palette },
    { id: 'ai', label: 'تحسين بالذكاء الاصطناعي', icon: Sparkles },
  ];

  return (
    <div className="py-8">
      <div className="container-custom">
        <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> العودة للمشاريع
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">تقرير يوم التأسيس السعودي</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Star className="w-5 h-5 text-gray-400" /></button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Trash2 className="w-5 h-5 text-red-500" /></button>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 inline-flex items-center gap-2">
              <Download className="w-4 h-4" /> تحميل
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            {activeTab === 'edit' && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">العنوان</label>
                  <input type="text" defaultValue="تقرير يوم التأسيس السعودي" className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">المحتوى</label>
                  <textarea rows={15} value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700 font-arabic" placeholder="المحتوى هنا..." />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><Type className="w-4 h-4" /> خط</button>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><ImageIcon className="w-4 h-4" /> صورة</button>
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الألوان</label>
                  <div className="flex gap-2">
                    {['#1E3A5F', '#3498DB', '#2ECC71', '#E74C3C', '#F39C12', '#9B59B6'].map((color) => (
                      <button key={color} className="w-8 h-8 rounded-full border-2 border-gray-300" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الخطوط</label>
                  <select className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700">
                    <option>Cairo</option>
                    <option>Noto Sans Arabic</option>
                    <option>Tajawal</option>
                    <option>Almarai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">القالب</label>
                  <select className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700">
                    <option>عصري - أزرق</option>
                    <option>كلاسيكي - ذهبي</option>
                    <option>بسيط - أبيض</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div>
                <p className="text-gray-500 mb-4">استخدم الذكاء الاصطناعي لتحسين المحتوى أو إعادة صياغته</p>
                <textarea rows={5} className="w-full p-2.5 border rounded-lg mb-4 bg-white dark:bg-gray-700" placeholder="اكتب تعليمات للتحسين..." />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> تحسين المحتوى
                </button>
              </div>
            )}
          </div>

          {/* Preview / Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4">معلومات المشروع</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">النوع</span><span>تقرير</span></div>
              <div className="flex justify-between"><span className="text-gray-500">القالب</span><span>أزرق عصري</span></div>
              <div className="flex justify-between"><span className="text-gray-500">تاريخ الإنشاء</span><span>٥ يونيو ٢٠٢٤</span></div>
              <div className="flex justify-between"><span className="text-gray-500">الحالة</span><span className="text-green-600">مكتمل</span></div>
            </div>
            <hr className="my-4" />
            <h3 className="font-semibold mb-3">خيارات التصدير</h3>
            <div className="space-y-2">
              {['PDF', 'DOCX', 'PPTX', 'PNG', 'JPG'].map((fmt) => (
                <button key={fmt} className="w-full text-right px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center justify-between">
                  <span>.{fmt.toLowerCase()}</span>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
