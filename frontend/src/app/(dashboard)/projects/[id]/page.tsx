'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Download, Trash2, Star, Sparkles, Eye, Save, Loader2, FileText, AlertCircle, Check, Upload, X } from 'lucide-react';
import { getProject, updateProject, toggleFavorite, deleteProject } from '@/lib/projects-api';
import { exportProject, downloadFile } from '@/lib/export-api';
import api from '@/lib/api';

export default function ProjectEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('preview');
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPosition, setLogoPosition] = useState('top-left');

  useEffect(() => {
    getProject(params.id).then((p) => {
      setProject(p);
      setTitle(p.title);
      const text = p.generatedContent?.body || p.content?.body || p.generatedContent?.text || p.content?.text || '';
      setContent(typeof text === 'string' ? text : JSON.stringify(text));
      if (p.settings?.logoPosition) setLogoPosition(p.settings.logoPosition);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProject(params.id, { title, content: { body: content } });
      setProject(updated);
    } catch (e) {
      alert('فشل الحفظ');
    }
    setSaving(false);
  };

  const handleExport = async (format: string) => {
    setExporting(format);
    setExportError(null);
    try {
      const result = await exportProject(params.id, format);
      await downloadFile(result.downloadUrl);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'فشل التصدير';
      setExportError(msg);
    }
    setExporting(null);
  };

  const handleToggleFavorite = async () => {
    const result = await toggleFavorite(params.id);
    setProject((prev: any) => ({ ...prev, isFavorite: result.isFavorite }));
  };

  const handleDelete = async () => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      await deleteProject(params.id);
      router.push('/projects');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post(`/files/logo/${params.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProject((prev: any) => ({
        ...prev,
        settings: { ...prev.settings, ...data.settings, logoUrl: data.logoUrl },
      }));
    } catch {
      alert('فشل رفع الشعار');
    }
    setUploadingLogo(false);
  };

  const handleLogoPositionChange = async (position: string) => {
    setLogoPosition(position);
    const newSettings = { ...project.settings, logoPosition: position };
    try {
      const updated = await updateProject(params.id, { settings: newSettings });
      setProject(updated);
    } catch {
      alert('فشل حفظ مكان الشعار');
    }
  };

  const handleRemoveLogo = async () => {
    const newSettings = { ...project.settings };
    delete newSettings.logoUrl;
    delete newSettings.logoPosition;
    try {
      const updated = await updateProject(params.id, { settings: newSettings });
      setProject(updated);
      setLogoPosition('top-left');
    } catch {
      alert('فشل إزالة الشعار');
    }
  };

  const getPositionStyle = (pos: string) => {
    switch (pos) {
      case 'top-left': return 'position:absolute;top:20px;left:20px';
      case 'top-right': return 'position:absolute;top:20px;right:20px';
      case 'top-center': return 'position:absolute;top:20px;left:50%;transform:translateX(-50%)';
      case 'bottom-left': return 'position:absolute;bottom:20px;left:20px';
      case 'bottom-right': return 'position:absolute;bottom:20px;right:20px';
      case 'bottom-center': return 'position:absolute;bottom:20px;left:50%;transform:translateX(-50%)';
      default: return 'position:absolute;top:20px;left:20px';
    }
  };

  const getPreviewHtml = () => {
    const colors = project?.template?.colors ? (() => {
      try { return JSON.parse(project.template.colors); } catch { return {}; }
    })() : {};
    const primary = colors.primary || '#1E3A5F';
    const titleColor = colors.titleColor || primary;
    const logoUrl = project?.settings?.logoUrl;
    const logoPos = project?.settings?.logoPosition || 'top-left';
    const logoHtml = logoUrl
      ? `<img src="${logoUrl}" style="${getPositionStyle(logoPos)};max-width:120px;max-height:60px;object-fit:contain" alt="Logo" />`
      : '';
    return `<div style="max-width:800px;margin:0 auto;padding:40px;font-family:'Cairo',sans-serif;direction:rtl;position:relative">
      ${logoHtml}
      <div style="height:6px;background:${primary};border-radius:8px 8px 0 0;margin-bottom:30px"></div>
      <h1 style="font-size:28px;font-weight:bold;color:${titleColor};text-align:center;margin-bottom:8px">${title}</h1>
      <p style="text-align:center;color:#6b7280;font-size:14px;margin-bottom:24px">
        <span style="background:#f3f4f6;padding:4px 12px;border-radius:999px;margin-left:8px">${project?.projectType || ''}</span>
        ${project?.template?.nameAr ? `<span style="background:#f3f4f6;padding:4px 12px;border-radius:999px">${project.template.nameAr}</span>` : ''}
      </p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin-bottom:24px" />
      <div style="font-size:16px;line-height:1.8;color:#374151;white-space:pre-wrap">${content}</div>
    </div>`;
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="container-custom flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-8">
        <div className="container-custom text-center py-20">
          <p className="text-gray-500">المشروع غير موجود</p>
          <Link href="/projects" className="text-primary-600 mt-2 inline-block">العودة للمشاريع</Link>
        </div>
      </div>
    );
  }

  const typeLabels: Record<string, string> = {
    REPORT: 'تقرير', BROCHURE: 'بروشور', PRESENTATION: 'عرض تقديمي',
    FLYER: 'فلير', COMPANY_PROFILE: 'تعريف شركة', CV: 'سيرة ذاتية', PORTFOLIO: 'معرض أعمال', SUMMARY: 'ملخص',
  };

  const tabs = [
    { id: 'preview', label: 'معاينة', icon: Eye },
    { id: 'edit', label: 'تعديل', icon: Edit },
    { id: 'ai', label: 'تحسين بالذكاء الاصطناعي', icon: Sparkles },
  ];

  return (
    <div className="py-8">
      <div className="container-custom">
        <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> العودة للمشاريع
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center gap-2 disabled:opacity-50 text-sm">
              <Save className="w-4 h-4" /> {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button onClick={handleToggleFavorite} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Star className={`w-5 h-5 ${project.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
            </button>
            <button onClick={handleDelete} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm shrink-0 ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            {activeTab === 'preview' && (
              <div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                  <iframe
                    srcDoc={getPreviewHtml()}
                    className="w-full bg-white"
                    style={{ minHeight: 500, height: '70vh' }}
                    title="Preview"
                  />
                </div>
              </div>
            )}

            {activeTab === 'edit' && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">العنوان</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">المحتوى</label>
                  <textarea rows={15} value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-arabic" placeholder="المحتوى هنا..." />
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div>
                <p className="text-gray-500 mb-4">استخدم الذكاء الاصطناعي لتحسين المحتوى أو إعادة صياغته</p>
                <textarea rows={5} className="w-full p-2.5 border rounded-lg mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="اكتب تعليمات للتحسين..." />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> تحسين المحتوى
                </button>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4">معلومات المشروع</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">النوع</span><span>{typeLabels[project.projectType] || project.projectType}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">تاريخ الإنشاء</span><span>{new Date(project.createdAt).toLocaleDateString('ar-SA')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">الحالة</span><span className={`${project.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>{project.status === 'COMPLETED' ? 'مكتمل' : 'مسودة'}</span></div>
            </div>
            <hr className="my-4" />
            <h3 className="font-semibold mb-3">الشعار</h3>
            <div className="space-y-3">
              {project?.settings?.logoUrl ? (
                <div>
                  <div className="relative inline-block mb-2">
                    <img src={project.settings.logoUrl} alt="Logo" className="h-12 border rounded p-1" />
                    <button onClick={handleRemoveLogo} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">مكان الشعار</label>
                    <select
                      value={logoPosition}
                      onChange={(e) => handleLogoPositionChange(e.target.value)}
                      className="w-full text-sm p-1.5 border rounded bg-white dark:bg-gray-700"
                    >
                      <option value="top-left">أعلى يسار</option>
                      <option value="top-center">أعلى وسط</option>
                      <option value="top-right">أعلى يمين</option>
                      <option value="bottom-left">أسفل يسار</option>
                      <option value="bottom-center">أسفل وسط</option>
                      <option value="bottom-right">أسفل يمين</option>
                    </select>
                  </div>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-500">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingLogo ? 'جاري الرفع...' : 'رفع شعار'}</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
                </label>
              )}
            </div>
            <hr className="my-4" />
            <h3 className="font-semibold mb-3">خيارات التصدير</h3>
            <div className="space-y-2">
              {(['pdf', 'docx', 'pptx', 'png', 'jpg'] as const).map((fmt) => (
                <button key={fmt} onClick={() => handleExport(fmt)} disabled={exporting === fmt} className="w-full text-right px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center justify-between disabled:opacity-50">
                  <span>.{fmt}</span>
                  {exporting === fmt ? <Loader2 className="w-4 h-4 animate-spin text-primary-600" /> : <Download className="w-4 h-4 text-gray-400" />}
                </button>
              ))}
            </div>
            {exportError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{exportError}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
