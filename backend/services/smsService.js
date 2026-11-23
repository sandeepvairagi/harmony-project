import twilio from 'twilio';

const getClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

export const sendSMS = async ({ to, body }) => {
  const client = getClient();
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.log(`[SMS mock] To: ${to} | ${body}`);
    return { success: true, mocked: true };
  }

  const message = await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
  return { success: true, sid: message.sid };
};

export const sendBookingSMS = async (phone, instructorName, date, time) => {
  if (!phone) return { success: false, message: 'No phone number' };
  return sendSMS({
    to: phone,
    body: `Harmony Bookings: Session with ${instructorName} on ${date} at ${time}. See you on the mat!`,
  });
};
