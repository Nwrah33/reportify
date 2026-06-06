import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcryptjs.hash('Admin123!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@reportify.ai' },
    update: {},
    create: {
      email: 'admin@reportify.ai',
      passwordHash: adminPassword,
      name: 'مدير النظام',
      role: 'SUPER_ADMIN',
      emailVerified: true,
    },
  });

  // Sample templates
  const templates = [
    {
      name: 'Business Report - Modern Blue',
      nameAr: 'تقرير أعمال - أزرق عصري',
      description: 'Professional business report template with modern blue design',
      descriptionAr: 'قالب تقرير أعمال احترافي بتصميم أزرق عصري',
      category: 'business',
      thumbnailUrl: '/templates/business-blue.png',
      templateData: {
        layout: 'modern',
        sections: ['header', 'executive-summary', 'content', 'charts', 'footer'],
        styles: { primary: '#1E3A5F', secondary: '#3498DB', accent: '#2ECC71' }
      },
      colors: { primary: '#1E3A5F', secondary: '#3498DB', accent: '#2ECC71', background: '#FFFFFF', text: '#2C3E50' },
      fonts: { heading: 'Cairo', body: 'Noto Sans Arabic' },
      isPublished: true,
    },
    {
      name: 'Corporate Brochure - Minimal',
      nameAr: 'بروشور شركة - minimalist',
      description: 'Clean and minimal corporate brochure template',
      descriptionAr: 'قالب بروشور شركة نظيف ومينيمالي',
      category: 'brochure',
      thumbnailUrl: '/templates/brochure-minimal.png',
      templateData: {
        layout: 'tri-fold',
        sections: ['cover', 'about', 'services', 'contact'],
        styles: { primary: '#2C3E50', secondary: '#7F8C8D', accent: '#E74C3C' }
      },
      colors: { primary: '#2C3E50', secondary: '#7F8C8D', accent: '#E74C3C', background: '#ECF0F1', text: '#2C3E50' },
      fonts: { heading: 'Cairo', body: 'Noto Sans Arabic' },
      isPublished: true,
    },
    {
      name: 'Academic Report - University',
      nameAr: 'تقرير أكاديمي - جامعة',
      description: 'Formal academic report template suitable for universities',
      descriptionAr: 'قالب تقرير أكاديمي رسمي مناسب للجامعات',
      category: 'academic',
      thumbnailUrl: '/templates/academic-formal.png',
      templateData: {
        layout: 'classic',
        sections: ['cover', 'abstract', 'introduction', 'methodology', 'results', 'discussion', 'references'],
        styles: { primary: '#8B0000', secondary: '#DAA520', accent: '#333333' }
      },
      colors: { primary: '#8B0000', secondary: '#DAA520', accent: '#333333', background: '#FFFFF8', text: '#333333' },
      fonts: { heading: 'Cairo', body: 'Noto Sans Arabic' },
      isPublished: true,
    },
    {
      name: 'Marketing Brochure - Vibrant',
      nameAr: 'بروشور تسويقي - vibrant',
      description: 'Eye-catching marketing brochure with vibrant colors',
      descriptionAr: 'بروشور تسويقي جذاب بألوان زاهية',
      category: 'marketing',
      thumbnailUrl: '/templates/marketing-vibrant.png',
      templateData: {
        layout: 'modern',
        sections: ['hero', 'features', 'testimonials', 'cta'],
        styles: { primary: '#FF6B35', secondary: '#F7C59F', accent: '#004E89' }
      },
      colors: { primary: '#FF6B35', secondary: '#F7C59F', accent: '#004E89', background: '#FFFFFF', text: '#1A1A2E' },
      fonts: { heading: 'Cairo', body: 'Noto Sans Arabic' },
      isPublished: true,
    },
    {
      name: 'CV Template - Professional',
      nameAr: 'قالب سيرة ذاتية - احترافي',
      description: 'Professional CV template for job applications',
      descriptionAr: 'قالب سيرة ذاتية احترافي للتقديم على الوظائف',
      category: 'cv',
      thumbnailUrl: '/templates/cv-professional.png',
      templateData: {
        layout: 'two-column',
        sections: ['header', 'summary', 'experience', 'education', 'skills', 'certifications'],
        styles: { primary: '#2C3E50', secondary: '#3498DB', accent: '#27AE60' }
      },
      colors: { primary: '#2C3E50', secondary: '#3498DB', accent: '#27AE60', background: '#FFFFFF', text: '#2C3E50' },
      fonts: { heading: 'Cairo', body: 'Noto Sans Arabic' },
      isPublished: true,
    },
    {
      name: 'Company Profile - Premium',
      nameAr: 'ملف شركة - بريميوم',
      description: 'Premium company profile with elegant design',
      descriptionAr: 'ملف تعريف شركة بريميوم بتصميم أنيق',
      category: 'company-profile',
      thumbnailUrl: '/templates/company-premium.png',
      templateData: {
        layout: 'premium',
        sections: ['cover', 'about', 'vision-mission', 'team', 'services', 'achievements', 'contact'],
        styles: { primary: '#1A1A2E', secondary: '#16213E', accent: '#E94560' }
      },
      colors: { primary: '#1A1A2E', secondary: '#16213E', accent: '#E94560', background: '#FFFFFF', text: '#1A1A2E' },
      fonts: { heading: 'Cairo', body: 'Noto Sans Arabic' },
      isPublished: true,
    },
    {
      name: 'Educational Report - Kids',
      nameAr: 'تقرير تعليمي - أطفال',
      description: 'Fun and colorful educational report template for children',
      descriptionAr: 'قالب تقرير تعليمي مرح وملون للأطفال',
      category: 'educational',
      thumbnailUrl: '/templates/educational-kids.png',
      templateData: {
        layout: 'playful',
        sections: ['header', 'content', 'activities', 'achievements', 'footer'],
        styles: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D' }
      },
      colors: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D', background: '#FFFFFF', text: '#2C3E50' },
      fonts: { heading: 'Cairo', body: 'Noto Sans Arabic' },
      isPublished: true,
    },
    {
      name: 'Financial Report - Dark Theme',
      nameAr: 'تقرير مالي - داكن',
      description: 'Modern financial report with dark theme design',
      descriptionAr: 'تقرير مالي حديث بتصميم داكن',
      category: 'financial',
      thumbnailUrl: '/templates/financial-dark.png',
      templateData: {
        layout: 'modern',
        sections: ['summary', 'revenue', 'expenses', 'projections', 'charts'],
        styles: { primary: '#0F0F0F', secondary: '#1A1A2E', accent: '#00D2FF' }
      },
      colors: { primary: '#0F0F0F', secondary: '#1A1A2E', accent: '#00D2FF', background: '#1A1A2E', text: '#FFFFFF' },
      fonts: { heading: 'Cairo', body: 'Noto Sans Arabic' },
      isPublished: true,
    },
    {
      name: 'HR Report - Clean',
      nameAr: 'تقرير موارد بشرية - نظيف',
      description: 'Clean and organized HR report template',
      descriptionAr: 'قالب تقرير موارد بشرية نظيف ومنظم',
      category: 'hr',
      thumbnailUrl: '/templates/hr-clean.png',
      templateData: {
        layout: 'clean',
        sections: ['overview', 'headcount', 'attendance', 'performance', 'recruitment'],
        styles: { primary: '#6C5CE7', secondary: '#A29BFE', accent: '#00B894' }
      },
      colors: { primary: '#6C5CE7', secondary: '#A29BFE', accent: '#00B894', background: '#FFFFFF', text: '#2D3436' },
      fonts: { heading: 'Cairo', body: 'Noto Sans Arabic' },
      isPublished: true,
    },
    {
      name: 'Technical Report - Developer',
      nameAr: 'تقرير تقني - مطورين',
      description: 'Technical documentation and report template for developers',
      descriptionAr: 'قالب تقرير وتوثيق تقني للمطورين',
      category: 'technical',
      thumbnailUrl: '/templates/technical-dev.png',
      templateData: {
        layout: 'technical',
        sections: ['title', 'overview', 'architecture', 'implementation', 'testing', 'deployment', 'appendix'],
        styles: { primary: '#282A36', secondary: '#44475A', accent: '#50FA7B' }
      },
      colors: { primary: '#282A36', secondary: '#44475A', accent: '#50FA7B', background: '#282A36', text: '#F8F8F2' },
      fonts: { heading: 'Cairo', body: 'Noto Sans Arabic' },
      isPublished: true,
    },
    {
      name: 'Presentation - Corporate',
      nameAr: 'عرض تقديمي - شركات',
      description: 'Professional corporate presentation template',
      descriptionAr: 'قالب عرض تقديمي احترافي للشركات',
      category: 'presentation',
      thumbnailUrl: '/templates/presentation-corporate.png',
      templateData: {
        layout: 'slides',
        sections: ['title', 'agenda', 'content', 'data', 'conclusion'],
        styles: { primary: '#003366', secondary: '#0066CC', accent: '#FF6600' }
      },
      colors: { primary: '#003366', secondary: '#0066CC', accent: '#FF6600', background: '#FFFFFF', text: '#333333' },
      fonts: { heading: 'Cairo', body: 'Noto Sans Arabic' },
      isPublished: true,
    },
    {
      name: 'Product Brochure - Modern',
      nameAr: 'بروشور منتج - عصري',
      description: 'Modern product brochure with clean product showcase',
      descriptionAr: 'بروشور منتج عصري مع عرض منتجات أنيق',
      category: 'product-brochure',
      thumbnailUrl: '/templates/product-brochure.png',
      templateData: {
        layout: 'grid',
        sections: ['hero', 'features', 'specs', 'pricing', 'cta'],
        styles: { primary: '#2D3436', secondary: '#636E72', accent: '#FDCB6E' }
      },
      colors: { primary: '#2D3436', secondary: '#636E72', accent: '#FDCB6E', background: '#FFFFFF', text: '#2D3436' },
      fonts: { heading: 'Cairo', body: 'Noto Sans Arabic' },
      isPublished: true,
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: template.name.toLowerCase().replace(/\s+/g, '-'),
        ...template,
      },
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
