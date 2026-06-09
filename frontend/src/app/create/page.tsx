'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { createProject } from '@/lib/projects-api';
import { FileText, Image, Presentation, Sparkles, Eye, Download, Loader2, Check } from 'lucide-react';

const projectTypes = [
  { id: 'REPORT', label: 'تقرير', icon: FileText, desc: 'تقارير احترافية منسقة' },
  { id: 'BROCHURE', label: 'بروشور', icon: Image, desc: 'بروشورات وكتيبات تسويقية' },
  { id: 'PRESENTATION', label: 'عرض تقديمي', icon: Presentation, desc: 'عروض شرائح متكاملة' },
];

function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createdProject, setCreatedProject] = useState<any>(null);

  const preselectedTemplateId = searchParams.get('template');

  useEffect(() => {
    if (preselectedTemplateId) {
      api.get(`/templates/${preselectedTemplateId}`).then(r => {
        setSelectedTemplate(r.data);
        setProjectType(r.data.category || 'REPORT');
      }).catch(() => {});
    }
  }, [preselectedTemplateId]);

  const fetchTemplates = async (type: string) => {
    setLoading(true);
    try {
      const res = await api.get('/templates', { params: { category: type, limit: 20 } });
      setTemplates(res.data.data || []);
    } catch {
      setTemplates([]);
    }
    setLoading(false);
  };

  const handleTypeSelect = (type: string) => {
    setProjectType(type);
    setSelectedTemplate(null);
    fetchTemplates(type);
    setStep(2);
  };

  const handleTemplateSelect = (tpl: any) => {
    setSelectedTemplate(tpl);
    setStep(3);
  };

  const handleCreate = async () => {
    if (!title.trim()) { alert('الرجاء كتابة عنوان للمشروع'); return; }
    if (!content.trim()) { alert('الرجاء كتابة محتوى المشروع'); return; }
    setCreating(true);
    try {
      const project = await createProject({
        title: title.trim(),
        projectType: projectType as any,
        templateId: selectedTemplate?.id,
        content: { body: content, sections: [{ type: 'text', title: title.trim(), content }] },
        prompt: '',
      });
      setCreatedProject(project);
      setStep(5);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'فشل إنشاء المشروع');
    }
    setCreating(false);
  };

  const typeLabels: Record<string, string> = {
    REPORT: 'تقرير', BROCHURE: 'بروشور', PRESENTATION: 'عرض تقديمي',
    CV: 'سيرة ذاتية', FLYER: 'نشرة', COMPANY_PROFILE: 'ملف شركة',
    PORTFOLIO: 'ملف إنجاز', SUMMARY: 'ملخص',
  };

  return (
    <div className="py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">مشروع جديد</h1>
        <p className="text-gray-500 mb-8">أنشئ مشروعك الاحترافي في خطوات بسيطة</p>

        {/* Steps indicator */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { n: 1, label: 'نوع المشروع' },
            { n: 2, label: 'اختيار قالب' },
            { n: 3, label: 'كتابة المحتوى' },
            { n: 4, label: 'معاينة' },
            { n: 5, label: 'تم الإنشاء' },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= s.n ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>{step > s.n ? <Check className="w-4 h-4" /> : s.n}</div>
              <span className={`text-sm ${step >= s.n ? 'text-primary-600 font-semibold' : 'text-gray-400'}`}>{s.label}</span>
              {i < 4 && <div className={`w-12 h-0.5 ${step > s.n ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
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
                  onClick={() => handleTypeSelect(type.id)}
                  className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-center transition-all hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                >
                  <type.icon className="w-8 h-8 mx-auto mb-3 text-primary-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{type.label}</h3>
                  <p className="text-sm text-gray-500 mt-1">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Template Selection */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">اختر قالباً مناسباً</h2>
              <button onClick={() => setStep(3)} className="text-sm text-primary-600 hover:text-primary-700">تخطي ←</button>
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
            ) : templates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">لا توجد قوالب متاحة لهذا النوع</p>
                <button onClick={() => setStep(3)} className="bg-primary-600 text-white px-4 py-2 rounded-lg">متابعة بدون قالب</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {templates.map((tpl: any) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleTemplateSelect(tpl)}
                    className={`rounded-xl border-2 overflow-hidden text-right transition-all ${
                      selectedTemplate?.id === tpl.id ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-4xl">📄</div>
                    <div className="p-3">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{tpl.nameAr || tpl.name}</p>
                      {tpl.isPremium && <span className="text-xs text-yellow-600">مميز</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">رجوع</button>
            </div>
          </div>
        )}

        {/* Step 3: Content Editor */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">اكتب محتوى المشروع</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">عنوان المشروع</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: تقرير عن تقنية الذكاء الاصطناعي"
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">محتوى المشروع</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب المحتوى هنا... يمكنك كتابة التقارير، النصوص التسويقية، محتوى العروض التقديمية..."
                rows={12}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-2 mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-purple-700 dark:text-purple-300">يمكنك استخدام الذكاء الاصطناعي لتحسين المحتوى بعد الإنشاء</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">رجوع</button>
              <button onClick={() => setStep(4)} disabled={!title.trim() || !content.trim()} className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2">
                <Eye className="w-4 h-4" /> معاينة المشروع
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">معاينة المشروع</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-6" style={{ minHeight: 400 }}>
              {/* Report Preview */}
              <div className="max-w-3xl mx-auto" dir="rtl">
                {selectedTemplate?.colors && (() => {
                  try { return JSON.parse(selectedTemplate.colors); } catch { return {}; }
                })()?.primary && (
                  <div className="h-2 rounded-t-lg mb-6" style={{ backgroundColor: JSON.parse(selectedTemplate.colors).primary }} />
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">{title || 'عنوان المشروع'}</h1>
                <div className="mb-4 text-sm text-gray-500 text-center">
                  <span className="px-3 py-1 bg-gray-100 rounded-full">{typeLabels[projectType] || projectType}</span>
                  {selectedTemplate && <span className="px-3 py-1 bg-gray-100 rounded-full mr-2">{selectedTemplate.nameAr || selectedTemplate.name}</span>}
                </div>
                <hr className="my-6" />
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
                  {content || 'محتوى المشروع يظهر هنا...'}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">تعديل المحتوى</button>
              <button onClick={handleCreate} disabled={creating} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {creating ? 'جاري الإنشاء...' : 'إنشاء المشروع'}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Done */}
        {step === 5 && createdProject && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">تم إنشاء المشروع بنجاح!</h2>
            <p className="text-gray-500 mb-8">يمكنك الآن معاينة المشروع أو تصديره</p>
            <div className="flex items-center justify-center gap-4">
              <Link href={`/projects/${createdProject.id}`} className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
                <Eye className="w-4 h-4 inline ml-2" />عرض المشروع
              </Link>
              <Link href="/projects" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">العودة للمشاريع</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="py-8"><div className="container-custom max-w-4xl text-center py-20 text-gray-500">جاري التحميل...</div></div>}>
      <CreatePageContent />
    </Suspense>
  );
}
