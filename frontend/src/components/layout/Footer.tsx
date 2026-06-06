import Link from 'next/link';
import { FileText, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <FileText className="w-6 h-6" />
              <span>Reportify</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              منصة متخصصة في تصميم وإنشاء التقارير والبروشورات والعروض التقديمية بشكل تلقائي باستخدام الذكاء الاصطناعي.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/templates" className="hover:text-white transition-colors">القوالب</Link></li>
              <li><Link href="/create" className="hover:text-white transition-colors">إنشاء مشروع</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">الباقات</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">الأسئلة الشائعة</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">روابط مهمة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">شروط الاستخدام</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">اتصل بنا</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">سياسة الاسترداد</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> info@reportify.ai
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> +966 123 456 789
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Reportify. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
