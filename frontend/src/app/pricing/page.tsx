'use client';
import Link from 'next/link';
import { Check, Star } from 'lucide-react';

const plans = [
  {
    name: 'مجاني', nameEn: 'Free', price: '٠', period: 'شهر', popular: false,
    features: ['٥ مشاريع', '٣ تصديرات شهرياً', '٥ مرات ذكاء اصطناعي', 'قوالب أساسية', 'تصدير PDF'],
  },
  {
    name: 'شهري', nameEn: 'Monthly', price: '٩٩', period: 'شهر', popular: true,
    features: ['١٠٠ مشروع', '١٠٠ تصدير شهرياً', '٢٠٠ مرة ذكاء اصطناعي', 'جميع القوالب', 'رفع وتحليل ملفات', 'تصدير PDF و DOCX', 'دعم فني'],
  },
  {
    name: 'سنوي', nameEn: 'Yearly', price: '٤٩٩', period: 'سنة', popular: false, saveAmount: 'توفير ٦٨٩ ريال',
    features: ['مشاريع غير محدودة', 'تصدير غير محدود', 'ذكاء اصطناعي غير محدود', 'جميع القوالب المميزة', 'رفع وتحليل ملفات', 'جميع صيغ التصدير', 'دعم فني مميز', 'أولوية في المعالجة'],
  },
];

const faqs = [
  { q: 'هل يمكنني الترقية من الباقة المجانية؟', a: 'نعم، يمكنك الترقية إلى أي باقة مدفوعة في أي وقت.' },
  { q: 'هل يمكن إلغاء الاشتراك؟', a: 'نعم، يمكنك إلغاء الاشتراك في أي وقت.' },
  { q: 'هل يتم استرداد المبلغ إذا ألغيت الاشتراك؟', a: 'نعم، نوفر استرداد كامل خلال أول ١٤ يوماً من الاشتراك.' },
  { q: 'هل يمكنني استخدام القوالب المميزة في الباقة المجانية؟', a: 'القوالب المميزة متاحة للمشتركين في الباقات المدفوعة فقط.' },
];

export default function PricingPage() {
  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">الباقات والأسعار</h1>
          <p className="text-gray-500 max-w-xl mx-auto">اختر الباقة التي تناسب احتياجاتك، وابدأ في إنشاء محتوى احترافي</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {plans.map((plan, i) => (
            <div key={i} className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 border ${
              plan.popular ? 'border-primary-500 ring-2 ring-primary-500 shadow-xl' : 'border-gray-200 dark:border-gray-700'
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-6 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1">
                  <Star className="w-3 h-3" /> الأكثر طلباً
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{plan.nameEn}</p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-gray-500 mr-2">ريال / {plan.period}</span>
                {plan.saveAmount && <p className="text-green-600 text-sm mt-1">{plan.saveAmount}</p>}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.price === '٠' ? '/register' : '/create'} className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-primary-500'
              }`}>
                {plan.price === '٠' ? 'ابدأ مجاناً' : 'اشترك الآن'}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">الأسئلة الشائعة</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{faq.q}</summary>
                <p className="mt-3 text-gray-500 text-sm">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
