import type { Metadata } from 'next';
import { AuthProvider } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Reportify - منصة إنشاء التقارير والبروشورات الذكية',
    template: '%s | Reportify',
  },
  description: 'منصة متخصصة في تصميم وإنشاء التقارير والبروشورات والعروض التقديمية بشكل تلقائي باستخدام الذكاء الاصطناعي',
  keywords: ['تقارير', 'بروشورات', 'عروض تقديمية', 'ذكاء اصطناعي', 'تصميم', 'قوالب'],
  authors: [{ name: 'Reportify' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1e3a5f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
