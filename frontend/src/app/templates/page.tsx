'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Grid3X3, LayoutList, Heart } from 'lucide-react';

const categories = [
  'الكل', 'تقارير الأعمال', 'تقارير إدارية', 'تقارير تعليمية', 'تقارير جامعية',
  'تقارير مدرسية', 'تقارير مشاريع', 'تقارير تسويق', 'تقارير موارد بشرية',
  'تقارير مالية', 'تقارير تقنية', 'بروشورات تجارية', 'بروشورات تسويقية',
  'كتيبات تعريفية', 'نشرات إعلانية', 'ملفات شركات', 'عروض منتجات',
  'سير ذاتية', 'ملفات إنجاز', 'عروض تقديمية'
];

// Sample templates data - in production, fetch from API
const sampleTemplates = [
  { id: 1, name: 'تقرير أعمال - أزرق عصري', category: 'تقارير الأعمال', image: '/templates/business-blue.png', downloads: 1234, premium: false },
  { id: 2, name: 'بروشور شركة - مينيمال', category: 'بروشورات تجارية', image: '/templates/brochure-minimal.png', downloads: 892, premium: false },
  { id: 3, name: 'تقرير أكاديمي - جامعة', category: 'تقارير جامعية', image: '/templates/academic-formal.png', downloads: 2156, premium: true },
  { id: 4, name: 'بروشور تسويقي - فيبرانت', category: 'بروشورات تسويقية', image: '/templates/marketing-vibrant.png', downloads: 3451, premium: false },
  { id: 5, name: 'سيرة ذاتية - احترافية', category: 'سير ذاتية', image: '/templates/cv-professional.png', downloads: 5678, premium: false },
  { id: 6, name: 'ملف شركة - بريميوم', category: 'ملفات شركات', image: '/templates/company-premium.png', downloads: 987, premium: true },
  { id: 7, name: 'تقرير تعليمي - أطفال', category: 'تقارير تعليمية', image: '/templates/educational-kids.png', downloads: 654, premium: false },
  { id: 8, name: 'تقرير مالي - داكن', category: 'تقارير مالية', image: '/templates/financial-dark.png', downloads: 4321, premium: true },
  { id: 9, name: 'تقرير موارد بشرية', category: 'تقارير موارد بشرية', image: '/templates/hr-clean.png', downloads: 765, premium: false },
  { id: 10, name: 'تقرير تقني - مطورين', category: 'تقارير تقنية', image: '/templates/technical-dev.png', downloads: 2345, premium: false },
  { id: 11, name: 'عرض تقديمي - شركات', category: 'عروض تقديمية', image: '/templates/presentation-corporate.png', downloads: 1890, premium: false },
  { id: 12, name: 'بروشور منتج - عصري', category: 'عروض منتجات', image: '/templates/product-brochure.png', downloads: 2098, premium: true },
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTemplates = sampleTemplates.filter(t => {
    const matchesCategory = activeCategory === 'الكل' || t.category === activeCategory;
    const matchesSearch = t.name.includes(searchQuery) || t.category.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">مكتبة القوالب</h1>
          <p className="text-gray-500">اختر من بين مئات القوالب الاحترافية وابدأ مشروعك</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن قالب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:bg-gray-100'}`}>
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:bg-gray-100'}`}>
              <LayoutList className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredTemplates.map((template) => (
            <Link key={template.id} href={`/create?template=${template.id}`} className="block group">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden card-hover">
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-6xl opacity-30">📄</span>
                  </div>
                  {template.premium && (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">مميز</span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">اختيار القالب</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{template.category}</span>
                    <span>{template.downloads.toLocaleString()} تحميل</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
