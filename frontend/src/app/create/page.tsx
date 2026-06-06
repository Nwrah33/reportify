'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Upload, Sparkles, FileText, Image, Presentation } from 'lucide-react';

const projectTypes = [
  { id: 'REPORT', label: 'تقرير', icon: FileText, desc: 'تقارير احترافية منسقة' },
  { id: 'BROCHURE', label: 'بروشور', icon: Image, desc: 'بروشورات وكتيبات تسويقية' },
  { id: 'PRESENTATION', label: 'عرض تقديمي', icon: Presentation, desc: 'عروض شرائح متكاملة' },
];

export default function CreatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState('');
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [generating, setGenerating] = useState(false);

  if (!user) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">تسجيل الدخول مطلوب</h1>
        <p className="text-gray-500 mb-6">يرجى تسجيل الدخول أو إنشاء حساب للبدء في إنشاء المشاريع</p>
        <Link href="/login" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">تسجيل الدخول</Link>
      </div>
    );
  }

  const handleGenerate = async () => {
    setGenerating(true);
    // In production, call API to generate content
    setTimeout(() => {
      setGenerating(false);
      router.push('/projects/demo-project');
    }, 2000);
  };

  return (
    <div className="py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">مشروع جديد</h1>
        <p className="text-gray-500 mb-8">اختر نوع المشروع واكتب طلبك لإنشاء المحتوى تلقائياً</p>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>{s}</div>
              <span className={`text-sm ${step >= s ? 'text-primary-600 font-semibold' : 'text-gray-400'}`}>
                {s === 1 ? 'نوع المشروع' : s === 2 ? 'المحتوى' : 'المراجعة'}
              </span>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Project Type */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">اختر نوع المشروع</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {projectTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setProjectType(type.id)}
                  className={`p-6 rounded-xl border-2 text-center transition-all ${
                    projectType === type.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <type.icon className="w-8 h-8 mx-auto mb-3 text-primary-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{type.label}</h3>
                  <p className="text-sm text-gray-500 mt-1">{type.desc}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} disabled={!projectType} className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
              التالي
            </button>
          </div>
        )}

        {/* Step 2: Content */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">أدخل طلبك</h2>
            
            {/* Prompt Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اكتب وصفاً للمحتوى الذي تريد إنشاءه</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="مثال: أريد تقريراً عن يوم التأسيس السعودي..."
                rows={5}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">أو ارفع ملفاً للتحليل</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500">اسحب الملفات هنا أو اضغط للرفع</p>
                <p className="text-xs text-gray-400 mt-1">يدعم PDF, Word, Excel, PowerPoint, صور</p>
              </div>
            </div>

            {/* AI Enhance */}
            <div className="flex items-center gap-2 mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-purple-700 dark:text-purple-300">سيقوم الذكاء الاصطناعي بإنشاء المحتوى تلقائياً بناءً على طلبك</span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">رجوع</button>
              <button onClick={() => { setStep(3); handleGenerate(); }} disabled={!prompt && files.length === 0} className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> إنشاء المحتوى
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div>
            {generating ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">جاري إنشاء المحتوى...</h2>
                <p className="text-gray-500">يقوم الذكاء الاصطناعي بتحليل طلبك وإنشاء المحتوى</p>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">تم إنشاء المحتوى بنجاح!</h2>
                <p className="text-gray-500 mb-6">يمكنك الآن مراجعة المحتوى وتعديله قبل التحميل</p>
                <Link href="/projects" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">عرض المشروع</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
