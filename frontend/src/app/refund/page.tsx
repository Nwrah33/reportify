export default function RefundPage() {
  return (
    <div className="py-12">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">سياسة الاسترداد</h1>
        <p className="text-gray-500 mb-8">آخر تحديث: ١ يناير ٢٠٢٤</p>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section><h2 className="text-xl font-semibold mb-3">فترة الاسترداد</h2><p>يمكنك طلب استرداد كامل المبلغ خلال ١٤ يوماً من تاريخ الدفع.</p></section>
          <section><h2 className="text-xl font-semibold mb-3">شروط الاسترداد</h2><ul className="list-disc pr-5 space-y-2"><li>يجب تقديم طلب الاسترداد خلال ١٤ يوماً من تاريخ الاشتراك</li><li>يتم الاسترداد لنفس طريقة الدفع المستخدمة</li><li>تستغرق معالجة الاسترداد من ٥ إلى ١٠ أيام عمل</li></ul></section>
          <section><h2 className="text-xl font-semibold mb-3">كيفية طلب الاسترداد</h2><ol className="list-decimal pr-5 space-y-2"><li>تواصل معنا عبر البريد الإلكتروني support@reportify.ai</li><li>قدم رقم الفاتورة وسبب طلب الاسترداد</li><li>سيتم مراجعة طلبك والرد خلال ٢٤ ساعة</li></ol></section>
          <section><h2 className="text-xl font-semibold mb-3">الاستثناءات</h2><p>لا ينطبق حق الاسترداد بعد ١٤ يوماً من تاريخ الاشتراك أو في حال انتهاك شروط الاستخدام.</p></section>
        </div>
      </div>
    </div>
  );
}
