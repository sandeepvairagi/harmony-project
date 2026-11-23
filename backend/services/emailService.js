import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[Email mock] To: ${to} | Subject: ${subject}`);
    return { success: true, mocked: true };
  }

  const info = await transporter.sendMail({
    from: `"Harmony Bookings" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text: text || subject,
  });
  return { success: true, messageId: info.messageId };
};

export const sendBookingConfirmation = async (user, booking, instructor) => {
  const html = `
    <h2>Booking Confirmed - Harmony Bookings</h2>
    <p>Hi ${user.name},</p>
    <p>Your session with <strong>${instructor.name}</strong> is confirmed.</p>
    <ul>
      <li>Date: ${new Date(booking.sessionDate).toLocaleDateString()}</li>
      <li>Time: ${booking.startTime} - ${booking.endTime}</li>
      <li>Type: ${booking.yogaType}</li>
      <li>Price: $${booking.price}</li>
    </ul>
    ${booking.meetingLink ? `<p><a href="${booking.meetingLink}">Join Live Session</a></p>` : ''}
  `;
  return sendEmail({
    to: user.email,
    subject: 'Your Yoga Session is Confirmed',
    html,
  });
};

export const sendSessionReminder = async (user, booking, instructor) => {
  const html = `
    <h2>Session Reminder</h2>
    <p>Hi ${user.name}, your session with ${instructor.name} starts soon!</p>
    <p>${new Date(booking.sessionDate).toLocaleDateString()} at ${booking.startTime}</p>
  `;
  return sendEmail({ to: user.email, subject: 'Upcoming Yoga Session Reminder', html });
};
