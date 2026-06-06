export default function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">سياسة الخصوصية</h1>
        <p className="text-gray-500 mb-8">آخر تحديث: ١ يناير ٢٠٢٤</p>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section><h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">١. مقدمة</h2><p>نحن في Reportify نلتزم بحماية خصوصية مستخدمينا. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام منصتنا.</p></section>
          <section><h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">٢. المعلومات التي نجمعها</h2><ul className="list-disc pr-5 space-y-2"><li>معلومات الحساب: الاسم، البريد الإلكتروني</li><li>المشاريع والملفات التي تنشئها أو ترفعها</li><li>بيانات الاستخدام: الصفحات التي تزورها، الإجراءات التي تقوم بها</li><li>معلومات الدفع: تتم معالجتها عبر بوابات دفع آمنة ولا نخزن تفاصيل البطاقة</li></ul></section>
          <section><h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">٣. كيفية استخدام معلوماتك</h2><ul className="list-disc pr-5 space-y-2"><li>تقديم وتحسين خدمات المنصة</li><li>معالجة المعاملات والاشتراكات</li><li>التواصل معك بشأن حسابك وخدماتنا</li><li>الامتثال للمتطلبات القانونية</li></ul></section>
          <section><h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">٤. حماية البيانات</h2><p>نستخدم إجراءات أمنية متقدمة لحماية معلوماتك، بما في ذلك تشفير البيانات أثناء النقل والتخزين، التحكم في الوصول والصلاحيات، النسخ الاحتياطي المنتظم، ومراقبة النشاط.</p></section>
          <section><h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">٥. حقوقك</h2><p>لديك الحق في: الوصول إلى بياناتك الشخصية، تصحيح أو تحديث بياناتك، حذف حسابك وبياناتك، تصدير بياناتك، الاعتراض على معالجة بياناتك.</p></section>
          <section><h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">٦. الاتصال بنا</h2><p>للاستفسارات المتعلقة بالخصوصية: privacy@reportify.ai</p></section>
        </div>
      </div>
    </div>
  );
}
