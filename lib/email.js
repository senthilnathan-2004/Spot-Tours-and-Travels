import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: { rejectUnauthorized: false }
  });
}

const FROM = process.env.EMAIL_FROM || `"Spot Tours & Travels" <${process.env.SMTP_USER}>`;

export async function sendBookingNotification(booking) {
  const to = process.env.ADMIN_EMAIL;
  if (!to || !process.env.SMTP_USER) return;
  const transporter = createTransporter();
  await transporter.sendMail({
    from: FROM, to,
    subject: `🎫 New Booking: ${booking.packageTitle} — ${booking.bookingRef}`,
    html: `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:28px 24px">
        <h2 style="margin:0;color:#fff;font-size:1.4rem">🎫 New Booking Request</h2>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:0.9rem">Spot Tours & Travels — Admin Notification</p>
      </div>
      <div style="padding:24px;background:#fff">
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
          ${row('Booking Ref', `<strong style="color:#0284c7">${booking.bookingRef}</strong>`, '#f0f9ff')}
          ${row('Package', booking.packageTitle)}
          ${row('Customer', booking.fullName, '#f8fafc')}
          ${row('Phone', booking.phone)}
          ${row('Email', booking.email || 'N/A', '#f8fafc')}
          ${row('Travel Date', booking.travelDate)}
          ${row('Guests', `${booking.adults} Adults, ${booking.children} Children`, '#f8fafc')}
          ${row('Vehicle', booking.vehicleType)}
          ${row('Hotel', booking.hotelCategory, '#f8fafc')}
          ${row('Total Amount', `<strong style="color:#059669;font-size:1.05rem">₹${Number(booking.totalAmount || 0).toLocaleString('en-IN')}</strong>`)}
          ${booking.specialNotes ? row('Special Notes', booking.specialNotes, '#f8fafc') : ''}
        </table>
        <div style="margin-top:20px;padding:14px 16px;background:#fffbeb;border-left:4px solid #fbbf24;border-radius:4px;font-size:0.88rem">
          ⚡ <strong>Action Required:</strong> Login to your admin panel to confirm or manage this booking.
        </div>
      </div>
    </div>`
  });
}

export async function sendEnquiryNotification(enquiry) {
  const to = process.env.ADMIN_EMAIL;
  if (!to || !process.env.SMTP_USER) return;
  const transporter = createTransporter();
  await transporter.sendMail({
    from: FROM, to,
    subject: `📩 New Enquiry from ${enquiry.name} — Spot Tours`,
    html: `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:28px 24px">
        <h2 style="margin:0;color:#fff;font-size:1.4rem">📩 New Contact Enquiry</h2>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:0.9rem">Spot Tours & Travels — Admin Notification</p>
      </div>
      <div style="padding:24px;background:#fff">
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
          ${row('Name', `<strong>${enquiry.name}</strong>`, '#f0f9ff')}
          ${row('Phone', enquiry.phone)}
          ${row('Email', enquiry.email || 'N/A', '#f8fafc')}
          ${row('Destination', enquiry.destination || 'Not specified')}
          ${row('Travel Date', enquiry.travelDate || 'Flexible', '#f8fafc')}
          ${row('Message', enquiry.message || 'N/A')}
        </table>
        <div style="margin-top:20px;padding:14px 16px;background:#f0fdf4;border-left:4px solid #22c55e;border-radius:4px;font-size:0.88rem">
          💬 <strong>Reply promptly</strong> — respond via WhatsApp or call the customer directly.
        </div>
      </div>
    </div>`
  });
}

function row(label, value, bg = '#fff') {
  return `<tr>
    <td style="padding:10px 12px;background:${bg};font-weight:600;color:#374151;width:38%;border-bottom:1px solid #f1f5f9">${label}</td>
    <td style="padding:10px 12px;background:${bg};color:#111827;border-bottom:1px solid #f1f5f9">${value}</td>
  </tr>`;
}
