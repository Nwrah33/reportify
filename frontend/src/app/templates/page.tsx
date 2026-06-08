'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Grid3X3, LayoutList, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['الكل']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/templates').then(r => r.data),
      api.get('/templates/categories').then(r => r.data),
    ]).then(([tplRes, cats]) => {
      setTemplates(tplRes.data || tplRes);
      setCategories(['الكل', ...(Array.isArray(cats) ? cats : [])]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filteredTemplates = templates.filter((t: any) => {
    const cat = t.categoryAr || t.category || '';
    const name = t.nameAr || t.name || '';
    const matchesCategory = activeCategory === 'الكل' || cat === activeCategory;
    const matchesSearch = name.includes(searchQuery) || cat.includes(searchQuery);
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
          {loading ? (
            <div className="col-span-full flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
          ) : filteredTemplates.length === 0 ? (
            <p className="col-span-full text-center text-gray-400 py-16">لا توجد قوالب</p>
          ) : filteredTemplates.map((template: any) => (
            <Link key={template.id} href={`/create?template=${template.id}`} className="block group">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden card-hover">
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-6xl opacity-30">📄</span>
                  </div>
                  {template.isPremium && (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">مميز</span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">اختيار القالب</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{template.nameAr || template.name}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{template.category}</span>
                    <span>{template.downloadsCount?.toLocaleString() || 0} تحميل</span>
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
