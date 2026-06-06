'use client';
import { Search } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  { category: 'عام', items: [
    { q: 'ما هي منصة Reportify؟', a: 'منصة متخصصة في إنشاء التقارير والبروشورات والعروض التقديمية باستخدام الذكاء الاصطناعي.' },
    { q: 'هل المنصة مجانية؟', a: 'نعم، نوفر باقة مجانية تتيح لك إنشاء 5 مشاريع و3 تصديرات شهرياً.' },
    { q: 'هل أحتاج إلى خبرة في التصميم؟', a: 'لا، كل ما عليك هو اختيار قالب وكتابة طلبك والنظام يقوم بالباقي.' },
  ]},
  { category: 'الاشتراكات', items: [
    { q: 'كيف يمكنني الترقية؟', a: 'يمكنك الترقية من لوحة التحكم الخاصة بك عبر قسم الباقات.' },
    { q: 'هل يمكن إلغاء الاشتراك؟', a: 'نعم، يمكنك إلغاء الاشتراك في أي وقت من إعدادات الحساب.' },
    { q: 'كيف تعمل سياسة الاسترداد؟', a: 'نوفر استرداد كامل خلال أول 14 يوماً من تاريخ الاشتراك.' },
  ]},
  { category: 'المشاريع', items: [
    { q: 'هل يمكنني تعديل المحتوى بعد الإنشاء؟', a: 'نعم، يمكنك تعديل النصوص والألوان والخطوط قبل التحميل.' },
    { q: 'ما هي صيغ التصدير المدعومة؟', a: 'ندعم التصدير بصيغ PDF, DOCX, PPTX, PNG, JPG.' },
    { q: 'هل يتم حفظ مشاريعي؟', a: 'نعم، جميع مشاريعك محفوظة في حسابك ويمكنك الرجوع إليها في أي وقت.' },
  ]},
  { category: 'التقني', items: [
    { q: 'هل بياناتي آمنة؟', a: 'نعم، جميع البيانات مشفرة ومحمية حسب أعلى معايير الأمان.' },
    { q: 'هل يمكنني رفع ملفات للتحليل؟', a: 'نعم، يدعم النظام رفع PDF, Word, Excel, PowerPoint والصور.' },
    { q: 'كيف يعمل الذكاء الاصطناعي؟', a: 'يحلل النظام طلبك أو ملفك وينشئ محتوى احترافياً متكاملاً.' },
  ]},
];

export default function FAQPage() {
  const [search, setSearch] = useState('');

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(i => i.q.includes(search) || i.a.includes(search)),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="py-12">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">الأسئلة الشائعة</h1>
          <p className="text-gray-500 mb-6">إجابات على أكثر الأسئلة تكراراً</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="ابحث في الأسئلة..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pr-10 pl-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        {filteredFaqs.map((cat, i) => (
          <div key={i} className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{cat.category}</h2>
            <div className="space-y-3">
              {cat.items.map((item, j) => (
                <details key={j} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{item.q}</summary>
                  <p className="mt-3 text-gray-500 text-sm">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
