# Reportify - منصة إنشاء التقارير والبروشورات الذكية

## نشر على Vercel + Render

### Frontend (Vercel)
1. اذهب إلى https://vercel.com
2. استورد مستودع GitHub
3. اختر مجلد `frontend`
4. أضف المتغير: `NEXT_PUBLIC_API_URL` = رابط API من Render
5. انشر

### Backend (Render)
1. اذهب إلى https://render.com
2. استورد مستودع GitHub
3. اختر مجلد `backend`
4. أضف المتغيرات البيئية من `.env`
5. أنشئ قاعدة بيانات PostgreSQL
6. انشر

### بعد النشر
- عدل `NEXT_PUBLIC_API_URL` في Vercel ليشير إلى رابط Render
