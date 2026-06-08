import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly fromName: string;
  private readonly fromEmail: string;

  constructor(private config: ConfigService) {
    this.fromName = this.config.get('MAIL_FROM_NAME', 'Reportify');
    this.fromEmail = this.config.get('MAIL_FROM_EMAIL', 'noreply@reportify.ai');

    const host = this.config.get('SMTP_HOST');
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.config.get('SMTP_PORT', 587),
        secure: this.config.get('SMTP_SECURE', 'false') === 'true',
        auth: {
          user: this.config.get('SMTP_USER'),
          pass: this.config.get('SMTP_PASS'),
        },
      });
      this.logger.log('البريد الإلكتروني مهيأ');
    } else {
      this.logger.warn('SMTP غير مهيأ - البريد الإلكتروني لن يعمل');
    }
  }

  async send(options: { to: string; subject: string; html: string; text?: string }) {
    if (!this.transporter) {
      this.logger.warn(`SMTP غير مهيأ. تعذر إرسال البريد إلى ${options.to}`);
      this.logger.log(`[البريد] إلى: ${options.to}, الموضوع: ${options.subject}`);
      return { success: false, message: 'SMTP غير مهيأ' };
    }
    try {
      await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
        html: options.html,
      });
      this.logger.log(`تم إرسال البريد إلى ${options.to}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`فشل إرسال البريد إلى ${options.to}: ${error.message}`);
      throw error;
    }
  }

  async sendWelcome(email: string, name: string) {
    return this.send({
      to: email,
      subject: 'مرحباً بك في Reportify',
      html: `<div dir="rtl" style="font-family:Cairo,sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#1E3A5F">مرحباً بك ${name}!</h1>
        <p>شكراً لتسجيلك في Reportify - منصة التقارير الذكية.</p>
        <p>يمكنك الآن إنشاء تقارير احترافية باستخدام الذكاء الاصطناعي.</p>
        <hr><p style="color:#6b7280;font-size:13px">إذا لم تكن قمت بإنشاء هذا الحساب، يرجى تجاهل هذا البريد.</p>
      </div>`,
    });
  }

  async sendPasswordReset(email: string, resetLink: string) {
    return this.send({
      to: email,
      subject: 'إعادة تعيين كلمة المرور - Reportify',
      html: `<div dir="rtl" style="font-family:Cairo,sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#1E3A5F">إعادة تعيين كلمة المرور</h1>
        <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك.</p>
        <a href="${resetLink}" style="display:inline-block;background:#2563EB;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0">إعادة تعيين كلمة المرور</a>
        <p style="color:#6b7280;font-size:13px">الرابط صالح لمدة ساعة واحدة. إذا لم تطلب إعادة التعيين، يرجى تجاهل هذا البريد.</p>
      </div>`,
    });
  }

  async sendEmailVerification(email: string, verifyLink: string) {
    return this.send({
      to: email,
      subject: 'تأكيد البريد الإلكتروني - Reportify',
      html: `<div dir="rtl" style="font-family:Cairo,sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#1E3A5F">تأكيد البريد الإلكتروني</h1>
        <p>يرجى تأكيد بريدك الإلكتروني بالضغط على الرابط أدناه:</p>
        <a href="${verifyLink}" style="display:inline-block;background:#2563EB;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0">تأكيد البريد الإلكتروني</a>
        <p style="color:#6b7280;font-size:13px">إذا لم تقم بإنشاء حساب، يرجى تجاهل هذا البريد.</p>
      </div>`,
    });
  }

  async sendProjectShared(email: string, sharedLink: string, sharerName: string) {
    return this.send({
      to: email,
      subject: `تمت مشاركة مشروع معك - Reportify`,
      html: `<div dir="rtl" style="font-family:Cairo,sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#1E3A5F">تمت مشاركة مشروع معك</h1>
        <p>قام ${sharerName} بمشاركة مشروع معك على Reportify.</p>
        <a href="${sharedLink}" style="display:inline-block;background:#2563EB;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0">عرض المشروع</a>
      </div>`,
    });
  }
}
