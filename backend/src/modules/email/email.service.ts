import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendBookingConfirmation(booking: any, coach: any) {
    const htmlContent = `
      <h2>Thank you for your booking!</h2>
      <p>Hi ${booking.clientName},</p>
      <p>Your session booking has been received. Here are the details:</p>
      <ul>
        <li><strong>Coach:</strong> ${coach.name}</li>
        <li><strong>Date:</strong> ${new Date(booking.sessionDate).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${booking.sessionStartTime} - ${booking.sessionEndTime}</li>
        <li><strong>Subject:</strong> ${booking.subject}</li>
        <li><strong>Duration:</strong> ${booking.sessionDurationMinutes} minutes</li>
      </ul>
      <p>Your booking is pending confirmation from the coach. You will receive a confirmation email shortly.</p>
      <p>If you have any questions, please reply to this email.</p>
      <p>Best regards,<br>${coach.name}</p>
    `;

    await this.sendEmail(
      booking.clientEmail,
      `Booking Confirmation - ${coach.name}`,
      htmlContent,
    );
  }

  async sendBookingNotificationToCoach(booking: any, coach: any) {
    const htmlContent = `
      <h2>New Booking Request</h2>
      <p>Hi ${coach.name},</p>
      <p>You have a new booking request:</p>
      <ul>
        <li><strong>Client Name:</strong> ${booking.clientName}</li>
        <li><strong>Client Email:</strong> ${booking.clientEmail}</li>
        <li><strong>Client Phone:</strong> ${booking.clientPhone}</li>
        <li><strong>Date:</strong> ${new Date(booking.sessionDate).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${booking.sessionStartTime} - ${booking.sessionEndTime}</li>
        <li><strong>Subject:</strong> ${booking.subject}</li>
        ${booking.clientMessage ? `<li><strong>Message:</strong> ${booking.clientMessage}</li>` : ''}
      </ul>
      <p>Please review and confirm this booking in your admin dashboard.</p>
    `;

    await this.sendEmail(
      coach.email,
      'New Booking Request',
      htmlContent,
    );
  }

  async sendBookingNotificationToAdmin(booking: any, coach: any) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('ADMIN_EMAIL not configured in .env');
      return;
    }

    const htmlContent = `
      <h2>🔔 New Booking Received</h2>
      <p>A new coaching session has been booked and is awaiting approval.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f5f5f5;">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Client Name:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${booking.clientName}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Email:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${booking.clientEmail}</td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Phone:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${booking.clientPhone}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Date:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${new Date(booking.sessionDate).toLocaleDateString()}</td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Time:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${booking.sessionStartTime} - ${booking.sessionEndTime}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Subject:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${booking.subject}</td>
        </tr>
        ${booking.clientMessage ? `
        <tr style="background-color: #f5f5f5;">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Message:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${booking.clientMessage}</td>
        </tr>
        ` : ''}
      </table>
      <p style="margin-top: 20px;">
        <strong>Status:</strong> <span style="color: #ff9800; font-weight: bold;">PENDING APPROVAL</span>
      </p>
      <p>Please log in to the admin dashboard to review and approve/reject this booking.</p>
      <hr style="margin: 20px 0;" />
      <p style="color: #999; font-size: 12px;">This is an automated notification. Please do not reply to this email.</p>
    `;

    await this.sendEmail(
      adminEmail,
      `[New Booking] ${booking.clientName} - ${new Date(booking.sessionDate).toLocaleDateString()} at ${booking.sessionStartTime}`,
      htmlContent,
    );
  }

  async sendBookingConfirmed(booking: any, coach: any) {
    const htmlContent = `
      <h2>Your Session is Confirmed!</h2>
      <p>Hi ${booking.clientName},</p>
      <p>Great news! Your session has been confirmed by ${coach.name}.</p>
      <ul>
        <li><strong>Coach:</strong> ${coach.name}</li>
        <li><strong>Date:</strong> ${new Date(booking.sessionDate).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${booking.sessionStartTime} - ${booking.sessionEndTime}</li>
        <li><strong>Duration:</strong> ${booking.sessionDurationMinutes} minutes</li>
      </ul>
      <p>Please mark your calendar. If you need to reschedule, please contact ${coach.email}.</p>
      <p>We look forward to our session!</p>
      <p>Best regards,<br>${coach.name}</p>
    `;

    await this.sendEmail(
      booking.clientEmail,
      'Session Confirmed!',
      htmlContent,
    );
  }

  async sendBookingCancellation(booking: any, coach: any) {
    const htmlContent = `
      <h2>Session Cancelled</h2>
      <p>Hi ${booking.clientName},</p>
      <p>Your session scheduled for ${new Date(booking.sessionDate).toLocaleDateString()} at ${booking.sessionStartTime} has been cancelled.</p>
      <p>If you wish to reschedule, please feel free to book another session.</p>
      <p>If you have any questions, please contact ${coach.email}.</p>
      <p>Best regards,<br>${coach.name}</p>
    `;

    await this.sendEmail(
      booking.clientEmail,
      'Session Cancelled',
      htmlContent,
    );
  }

  async sendBookingRejection(booking: any, coach: any, reason?: string) {
    const htmlContent = `
      <h2>Booking Status Update</h2>
      <p>Hi ${booking.clientName},</p>
      <p>Unfortunately, we cannot accommodate your session request scheduled for ${new Date(booking.sessionDate).toLocaleDateString()} at ${booking.sessionStartTime}.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>Please feel free to contact ${coach.email} to explore alternative dates and times.</p>
      <p>We apologize for any inconvenience and look forward to helping you soon!</p>
      <p>Best regards,<br>${coach.name}</p>
    `;

    await this.sendEmail(
      booking.clientEmail,
      'Booking Status Update',
      htmlContent,
    );
  }

  async sendEmail(to: string, subject: string, htmlContent: string) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${to} with subject: ${subject}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  async sendReminderEmail(booking: any, coach: any) {
    const sessionDate = new Date(booking.sessionDate);
    const dateStr = sessionDate.toLocaleDateString();
    const timeStr = booking.sessionStartTime;

    const htmlContent = `
      <h2>Reminder: Your Session is Tomorrow!</h2>
      <p>Hi ${booking.clientName},</p>
      <p>Just a friendly reminder that you have a session with ${coach.name} tomorrow.</p>
      <ul>
        <li><strong>Date:</strong> ${dateStr}</li>
        <li><strong>Time:</strong> ${timeStr}</li>
        <li><strong>Duration:</strong> ${booking.sessionDurationMinutes} minutes</li>
      </ul>
      <p>Please make sure you're available at the scheduled time. If you need to reschedule, please notify ${coach.email} as soon as possible.</p>
      <p>Looking forward to our session!</p>
      <p>Best regards,<br>${coach.name}</p>
    `;

    await this.sendEmail(
      booking.clientEmail,
      'Reminder: Your Session Tomorrow',
      htmlContent,
    );
  }
}
