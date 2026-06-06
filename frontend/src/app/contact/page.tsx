'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  if (sent) return (
    <div className="py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">✓</div>
      <h2 className="text-2xl font-bold mb-2">تم إرسال رسالتك</h2>
      <p className="text-gray-500">سنتواصل معك في أقرب وقت ممكن</p>
    </div>
  );

  return (
    <div className="py-12">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">تواصل معنا</h1>
          <p className="text-gray-500">نحن هنا للإجابة على استفساراتك ومساعدتك</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border"><Mail className="w-6 h-6 mx-auto mb-3 text-primary-600" /><h3 className="font-semibold mb-1">البريد الإلكتروني</h3><p className="text-sm text-gray-500">info@reportify.ai</p></div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border"><Phone className="w-6 h-6 mx-auto mb-3 text-primary-600" /><h3 className="font-semibold mb-1">الهاتف</h3><p className="text-sm text-gray-500">+966 123 456 789</p></div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border"><MapPin className="w-6 h-6 mx-auto mb-3 text-primary-600" /><h3 className="font-semibold mb-1">الموقع</h3><p className="text-sm text-gray-500">الرياض، المملكة العربية السعودية</p></div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border p-8">
          <h2 className="text-xl font-bold mb-6">أرسل لنا رسالة</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">الاسم</label><input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700" required /></div>
              <div><label className="block text-sm font-medium mb-1">البريد الإلكتروني</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700" required /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">الموضوع</label><input type="text" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700" required /></div>
            <div><label className="block text-sm font-medium mb-1">الرسالة</label><textarea rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-700" required /></div>
            <button type="submit" className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 inline-flex items-center gap-2"><Send className="w-4 h-4" /> إرسال الرسالة</button>
          </form>
        </div>
      </div>
    </div>
  );
}
