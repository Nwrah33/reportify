'use client';
import Link from 'next/link';
import { ArrowLeft, Sparkles, FileText, Image, Presentation, Shield, Download, Layout, Star, ChevronLeft } from 'lucide-react';

const features = [
  { icon: Sparkles, title: 'ذكاء اصطناعي متقدم', description: 'إنشاء المحتوى تلقائياً باستخدام أحدث تقنيات الذكاء الاصطناعي' },
  { icon: Layout, title: 'مئات القوالب', description: 'مكتبة ضخمة من القوالب الاحترافية المتنوعة' },
  { icon: Download, title: 'تصدير متعدد', description: 'تصدير المشاريع بصيغ PDF, DOCX, PPTX, PNG, JPG' },
  { icon: Shield, title: 'حفظ آمن', description: 'حفظ جميع مشاريعك في حسابك بشكل آمن وسحابي' },
];

const stats = [
  { value: '١٠٠٠+', label: 'قالب احترافي' },
  { value: '٥٠,٠٠٠+', label: 'مستخدم نشط' },
  { value: '١٠٠,٠٠٠+', label: 'مشروع منشأ' },
  { value: '٩٨٪', label: 'رضا العملاء' },
];

const testimonials = [
  { name: 'أحمد السعيد', role: 'مدير تسويق', text: 'منصة رائعة! وفرت عليا وقت كبير في تصميم التقارير الاسبوعية.' },
  { name: 'سارة العتيبي', role: 'طالبة جامعية', text: 'ساعدتني في تقديم مشروع تخرجي بشكل احترافي جداً.' },
  { name: 'محمد الحربي', role: 'رجل أعمال', text: 'البروشورات اللي طلعت من الموقع احترافية وتنافس المكاتب.' },
];

const categories = [
  { name: 'تقارير الأعمال', count: '١٥٠ قالب', color: 'from-blue-500 to-blue-600' },
  { name: 'البروشورات', count: '٢٠٠ قالب', color: 'from-green-500 to-emerald-600' },
  { name: 'العروض التقديمية', count: '١٢٠ قالب', color: 'from-purple-500 to-violet-600' },
  { name: 'السير الذاتية', count: '٨٠ قالب', color: 'from-orange-500 to-amber-600' },
];

const plans = [
  {
    name: 'مجاني', price: '٠', period: 'شهر', popular: false,
    features: ['٥ مشاريع', '٣ تصديرات', '٥ مرات ذكاء اصطناعي', 'قوالب أساسية'],
  },
  {
    name: 'شهري', price: '٩٩', period: 'شهر', popular: true,
    features: ['١٠٠ مشروع', '١٠٠ تصدير', '٢٠٠ مرة ذكاء اصطناعي', 'جميع القوالب', 'رفع وتحليل ملفات'],
  },
  {
    name: 'سنوي', price: '٤٩٩', period: 'سنة', popular: false,
    features: ['غير محدود', 'تصدير غير محدود', 'ذكاء اصطناعي غير محدود', 'جميع القوالب', 'دعم فني مميز'],
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20 md:py-32">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            أنشئ تقارير وبروشورات احترافية<br />
            <span className="text-blue-300">بالذكاء الاصطناعي</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            منصة متكاملة لإنشاء التقارير والبروشورات والعروض التقديمية بلمسة زر واحدة
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="bg-white text-primary-800 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
              ابدأ مجاناً <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/templates" className="border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              استعرض القوالب
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">لماذا Reportify؟</h2>
            <p className="text-gray-500 max-w-xl mx-auto">أسهل وأسرع طريقة لإنشاء المحتوى البصري الاحترافي</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 card-hover">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">تصنيفات القوالب</h2>
            <p className="text-gray-500">مكتبة ضخمة من القوالب المصممة باحترافية</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link key={i} href={`/templates?category=${cat.name}`} className={`bg-gradient-to-r ${cat.color} rounded-xl p-6 text-white card-hover`}>
                <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                <p className="text-white/80 text-sm">{cat.count} قالب</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/templates" className="text-primary-600 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
              عرض جميع القوالب <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">كيف يعمل الموقع؟</h2>
            <p className="text-gray-500">ثلاث خطوات بسيطة لإنشاء محتوى احترافي</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '١', title: 'اختر قالباً', desc: 'تصفح مكتبة القوالب واختر ما يناسب مشروعك' },
              { step: '٢', title: 'اكتب طلبك', desc: 'اكتب وصفاً للمحتوى الذي تريد إنشاءه أو ارفع ملفاً' },
              { step: '٣', title: 'حمّل النتيجة', desc: 'احصل على تقرير أو بروشور احترافي جاهز للتحميل' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">{item.step}</div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">ماذا يقول عملاؤنا؟</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">اختر باقتك</h2>
            <p className="text-gray-500">ابدأ مجاناً وطور اشتراكك عندما تحتاج المزيد</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 border ${plan.popular ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200 dark:border-gray-700'}`}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm">الأكثر طلباً</span>}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 mr-1">ريال / {plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.price === '٠' ? '/register' : '/pricing'} className={`block text-center py-3 rounded-xl font-semibold transition-colors ${plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-primary-500'}`}>
                  {plan.price === '٠' ? 'ابدأ مجاناً' : 'اشترك الآن'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">ابدأ رحلتك الآن</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">أنشئ تقارير وبروشورات احترافية في دقائق، بدون خبرة في التصميم</p>
          <Link href="/register" className="bg-white text-primary-800 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
            إنشاء حساب مجاني <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
