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

const FROM = process.env.EMAIL_FROM || `"Spot Tours & Travels" <${process.env.SMTP_USER || 'spottoursandtravels@gmail.com'}>`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

/**
 * Common Premium HTML Email Template Layout
 */
function buildEmailLayout({
  badgeText = '',
  title = '',
  subtitle = '',
  recipientGreeting = '',
  messageIntro = '',
  refId = null,
  specs = [],
  highlightBox = null,
  ctaText = null,
  ctaLink = null,
  footerNote = ''
}) {
  const specsRows = specs
    .filter(s => s && s.value)
    .map(s => `
      <tr>
        <td style="padding: 10px 0; font-size: 13px; color: #6B7280; font-weight: 500; border-bottom: 1px solid #F3F4F6; vertical-align: top; width: 42%;">
          ${s.label}
        </td>
        <td style="padding: 10px 0; font-size: 13.5px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #F3F4F6; vertical-align: top;">
          ${s.isPrice ? `<span style="font-weight: 700; color: #111827; font-size: 14.5px;">₹${Number(s.value || 0).toLocaleString('en-IN')}</span>` : s.value}
        </td>
      </tr>
    `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #111827;
    }
    table, td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 16px !important;
      }
      .email-title {
        font-size: 20px !important;
      }
      .email-btn {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF;">
    <tr>
      <td align="center" style="padding: 32px 16px;" class="email-wrapper">
        
        <!-- Main Content Area (No Card, Seamless Max-Width) -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; text-align: left;">
          
          <!-- Brand Header (Clean, Muted Uppercase, No Background Color) -->
          <tr>
            <td style="padding: 0 0 28px 0; text-align: center;">
              <div style="font-size: 12px; font-weight: 700; letter-spacing: 2.5px; color: #6B7280; text-transform: uppercase;">
                SPOT TOURS &amp; TRAVELS
              </div>
            </td>
          </tr>

          <!-- Main Title -->
          <tr>
            <td style="padding: 0 0 16px 0;">
              <h1 class="email-title" style="margin: 0; font-size: 22px; font-weight: 700; color: #111827; line-height: 1.3; letter-spacing: -0.3px;">
                ${title}
              </h1>
            </td>
          </tr>

          <!-- Recipient Greeting (if any) -->
          ${recipientGreeting ? `
          <tr>
            <td style="padding: 0 0 12px 0; font-size: 15px; font-weight: 500; color: #111827; line-height: 1.5;">
              ${recipientGreeting}
            </td>
          </tr>
          ` : ''}

          <!-- Subtitle / Intro Message -->
          ${subtitle ? `
          <tr>
            <td style="padding: 0 0 12px 0; font-size: 14px; color: #4B5563; line-height: 1.6;">
              ${subtitle}
            </td>
          </tr>
          ` : ''}

          ${messageIntro ? `
          <tr>
            <td style="padding: 0 0 16px 0; font-size: 14px; color: #374151; line-height: 1.6;">
              ${messageIntro}
            </td>
          </tr>
          ` : ''}

          <!-- Booking Reference / ID Notice (if any) -->
          ${refId ? `
          <tr>
            <td style="padding: 4px 0 16px 0;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F9FAFB; border: 1px solid #F3F4F6; border-radius: 6px; padding: 12px 14px;">
                <tr>
                  <td style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">
                    Booking Reference
                  </td>
                  <td align="right" style="font-size: 14px; font-weight: 700; color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;">
                    ${refId}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- Specifications / Details List (if any) -->
          ${specs.length > 0 ? `
          <tr>
            <td style="padding: 8px 0 16px 0;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #E5E7EB; border-collapse: collapse;">
                ${specsRows}
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- Highlight / Info Box (if any) -->
          ${highlightBox ? `
          <tr>
            <td style="padding: 6px 0 18px 0;">
              <div style="background-color: #F9FAFB; border-left: 3px solid #111827; border-radius: 4px; padding: 12px 16px; font-size: 13.5px; color: #374151; line-height: 1.5;">
                ${highlightBox.html}
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- CTA Button (if any) -->
          ${ctaText && ctaLink ? `
          <tr>
            <td style="padding: 12px 0 20px 0;">
              <a href="${ctaLink}" class="email-btn" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #111827; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 13.5px; font-weight: 600; letter-spacing: 0.2px;">
                ${ctaText}
              </a>
            </td>
          </tr>
          ` : ''}

          <!-- Support Note -->
          <tr>
            <td style="padding: 8px 0 20px 0; font-size: 13.5px; color: #4B5563; line-height: 1.6;">
              If you have any questions or need immediate assistance, please feel free to call us directly at <a href="tel:09500551404" style="color: #111827; font-weight: 600; text-decoration: underline;">+91 95005 51404</a>.
            </td>
          </tr>

          <!-- Thin Divider & Clean Footer (No background color) -->
          <tr>
            <td style="padding: 12px 0 0 0;">
              <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 0 0 20px 0;" />
              <div style="font-size: 12px; color: #6B7280; line-height: 1.5;">
                <div>Spot Tours and Travels, 8/95, Palakkad - Coimbatore Rd, Kuniyamuthur, Coimbatore, Tamil Nadu 641008</div>
                <div style="margin-top: 6px; color: #9CA3AF;">
                  ${footerNote || 'This is an automated message. Please do not reply directly to this email.'}
                </div>
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. BOOKING NOTIFICATIONS (NEW BOOKING)
// ─────────────────────────────────────────────────────────────────────────────

export async function sendBookingNotification(booking) {
  if (!process.env.SMTP_USER) return;
  const transporter = createTransporter();

  // Specs Array
  const specs = [
    { label: 'Booking Ref', value: booking.bookingRef },
    { label: 'Package Name', value: booking.packageTitle },
    { label: 'Destination', value: booking.destination },
    { label: 'Duration', value: booking.duration },
    { label: 'Lead Traveler', value: booking.fullName },
    { label: 'Mobile Number', value: booking.phone },
    { label: 'Email', value: booking.email || 'Not Provided' },
    { label: 'Travel Date', value: booking.travelDate },
    { label: 'Guests', value: `${booking.adults || 1} Adults${booking.children > 0 ? `, ${booking.children} Children` : ''}` },
    { label: 'Vehicle Type', value: booking.vehicleType || 'Standard Tourist Vehicle' },
    { label: 'Hotel Category', value: booking.hotelCategory || 'Standard Deluxe' },
    { label: 'Estimated Total', value: booking.totalAmount, isPrice: true },
    { label: 'Special Notes', value: booking.specialNotes || '' }
  ];

  // 1. Email to ADMIN
  if (ADMIN_EMAIL) {
    const adminHtml = buildEmailLayout({
      badgeText: 'NEW RESERVATION',
      badgeColor: '#D97706',
      badgeBg: '#FEF3C7',
      title: 'New Customer Booking Request',
      subtitle: 'A new tour booking has just been submitted on Spot Tours website.',
      refId: booking.bookingRef,
      messageIntro: `Customer <strong>${booking.fullName}</strong> (${booking.phone}) has booked <strong>${booking.packageTitle}</strong>. Please review their schedule and confirm hotel & vehicle availability.`,
      specs,
      highlightBox: {
        bg: '#FEF3C7',
        border: '#D97706',
        color: '#92400E',
        html: '⚡ <strong>Action Required:</strong> Log in to the Admin Console to review, confirm or assign tourist fleet for this reservation.'
      },
      ctaText: 'Open Admin Console',
      ctaLink: `${process.env.APP_URL || 'https://spot-tours-and-travels.vercel.app'}/admin/bookings`
    });

    await transporter.sendMail({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `🎫 [New Booking] ${booking.packageTitle} — ${booking.bookingRef}`,
      html: adminHtml
    }).catch(err => console.error('Admin booking email error:', err.message));
  }

  // 2. Acknowledgment Email to CUSTOMER (if email provided)
  if (booking.email && booking.email.includes('@')) {
    const customerHtml = buildEmailLayout({
      badgeText: 'REQUEST RECEIVED',
      badgeColor: '#0E7490',
      badgeBg: '#E0F2FE',
      title: 'Booking Request Received!',
      subtitle: `Thank you for choosing Spot Tours & Travels Coimbatore for your ${booking.destination || 'holiday'} trip.`,
      refId: booking.bookingRef,
      recipientGreeting: `Dear ${booking.fullName},`,
      messageIntro: `We have successfully received your booking request for <strong>${booking.packageTitle}</strong>. Our dedicated trip coordinator is currently verifying room availability and driver allocation. We will call you within 30 minutes to confirm your itinerary!`,
      specs: specs.filter(s => s.label !== 'Special Notes' || s.value),
      highlightBox: {
        bg: '#ECFDF5',
        border: '#10B981',
        color: '#065F46',
        html: '✅ <strong>Zero Advance Needed:</strong> No immediate online payment required. Pay safely after verifying your hotel confirmation voucher.'
      },
      ctaText: 'Chat with Us on WhatsApp',
      ctaLink: `https://wa.me/919500551404?text=Hi%20Spot%20Tours,%20my%20booking%20reference%20is%20${booking.bookingRef}`
    });

    await transporter.sendMail({
      from: FROM,
      to: booking.email,
      subject: `✈️ Booking Request Received: ${booking.packageTitle} (${booking.bookingRef})`,
      html: customerHtml
    }).catch(err => console.error('Customer booking ack email error:', err.message));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. BOOKING STATUS CHANGE NOTIFICATIONS (CONFIRMED / COMPLETED / CANCELLED)
// ─────────────────────────────────────────────────────────────────────────────

export async function sendBookingStatusNotification(booking, newStatus) {
  if (!process.env.SMTP_USER || !booking.email || !booking.email.includes('@')) return;
  const transporter = createTransporter();

  const specs = [
    { label: 'Booking Ref', value: booking.bookingRef },
    { label: 'Package Name', value: booking.packageTitle },
    { label: 'Destination', value: booking.destination },
    { label: 'Travel Date', value: booking.travelDate },
    { label: 'Vehicle & Driver', value: booking.vehicleType || 'Private AC Chauffeur Vehicle' },
    { label: 'Hotel Category', value: booking.hotelCategory || 'Verified 3-Star/4-Star Stay' },
    { label: 'Total Package Price', value: booking.totalAmount, isPrice: true }
  ];

  let config = {};

  if (newStatus === 'confirmed') {
    config = {
      badgeText: 'BOOKING CONFIRMED',
      badgeColor: '#059669',
      badgeBg: '#ECFDF5',
      title: '🎉 Your Tour Booking is Confirmed!',
      subtitle: `Your trip to ${booking.destination || 'your destination'} has been verified and confirmed by Spot Tours & Travels.`,
      refId: booking.bookingRef,
      recipientGreeting: `Dear ${booking.fullName},`,
      messageIntro: `Great news! Your booking for <strong>${booking.packageTitle}</strong> starting on <strong>${booking.travelDate}</strong> is 100% confirmed. Your verified hotel stays and dedicated tourist cab with an experienced polite chauffeur are reserved.`,
      specs,
      highlightBox: {
        bg: '#ECFDF5',
        border: '#059669',
        color: '#065F46',
        html: '🌟 <strong>Trip Coordinator Assigned:</strong> Your dedicated travel manager and driver details will be shared on your WhatsApp 24 hours prior to travel date.'
      },
      ctaText: 'View Details / WhatsApp Help',
      ctaLink: `https://wa.me/919500551404?text=Hi%20Spot%20Tours,%20regarding%20my%20confirmed%20booking%20${booking.bookingRef}`
    };
  } else if (newStatus === 'completed') {
    config = {
      badgeText: 'TOUR COMPLETED',
      badgeColor: '#0E7490',
      badgeBg: '#E0F2FE',
      title: '🌟 Thank You for Traveling With Us!',
      subtitle: `We hope you made cherished memories on your ${booking.packageTitle} trip.`,
      refId: booking.bookingRef,
      recipientGreeting: `Dear ${booking.fullName},`,
      messageIntro: `Thank you for choosing <strong>Spot Tours and Travels Coimbatore</strong> for your vacation. It was our pleasure serving you and your family! We hope your journey was comfortable, safe, and truly unforgettable.`,
      specs: specs.slice(0, 4),
      highlightBox: {
        bg: '#FEF3C7',
        border: '#F59E0B',
        color: '#92400E',
        html: '⭐ <strong>Share Your Experience:</strong> Your feedback helps other travelers in Coimbatore choose the best trips. Please leave us a quick Google review!'
      },
      ctaText: 'Rate Us on Google Reviews',
      ctaLink: 'https://g.page/r/spot-tours-coimbatore/review'
    };
  } else if (newStatus === 'cancelled') {
    config = {
      badgeText: 'BOOKING CANCELLED',
      badgeColor: '#DC2626',
      badgeBg: '#FEF2F2',
      title: 'Booking Status Update',
      subtitle: `Reservation ${booking.bookingRef} has been cancelled.`,
      refId: booking.bookingRef,
      recipientGreeting: `Dear ${booking.fullName},`,
      messageIntro: `Your tour booking request for <strong>${booking.packageTitle}</strong> has been cancelled as requested or due to scheduling changes.`,
      specs: specs.slice(0, 4),
      highlightBox: {
        bg: '#FEF2F2',
        border: '#DC2626',
        color: '#991B1B',
        html: 'ℹ️ <strong>Need Rescheduling or Custom Quote?</strong> Contact our Coimbatore team anytime to plan an alternate date or custom itinerary with zero extra fees.'
      },
      ctaText: 'Contact Trip Support',
      ctaLink: 'tel:09500551404'
    };
  } else {
    return; // No notification needed for other internal states
  }

  const html = buildEmailLayout(config);

  await transporter.sendMail({
    from: FROM,
    to: booking.email,
    subject: `${config.badgeText}: ${booking.packageTitle} — ${booking.bookingRef}`,
    html
  }).catch(err => console.error(`Booking status (${newStatus}) email error:`, err.message));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ENQUIRY NOTIFICATIONS (NEW ENQUIRY & STATUS UPDATES)
// ─────────────────────────────────────────────────────────────────────────────

export async function sendEnquiryNotification(enquiry) {
  if (!process.env.SMTP_USER) return;
  const transporter = createTransporter();

  const specs = [
    { label: 'Customer Name', value: enquiry.name },
    { label: 'Phone Number', value: enquiry.phone },
    { label: 'Email Address', value: enquiry.email || 'Not Provided' },
    { label: 'Destination', value: enquiry.destination || 'Flexible / Custom Vacation' },
    { label: 'Expected Date', value: enquiry.travelDate || 'Flexible Dates' },
    { label: 'Requirements / Notes', value: enquiry.message || 'Standard custom package enquiry' }
  ];

  // 1. To ADMIN
  if (ADMIN_EMAIL) {
    const adminHtml = buildEmailLayout({
      badgeText: 'NEW TRAVEL LEAD',
      badgeColor: '#D83A56',
      badgeBg: '#FFE4E6',
      title: 'New Customer Travel Enquiry',
      subtitle: `Inquiry submitted from Contact Form by ${enquiry.name}.`,
      messageIntro: `Customer <strong>${enquiry.name}</strong> (${enquiry.phone}) is looking for travel assistance to <strong>${enquiry.destination || 'a vacation destination'}</strong>.`,
      specs,
      highlightBox: {
        bg: '#F0FDF4',
        border: '#22C55E',
        color: '#166534',
        html: '💬 <strong>Speed Matters:</strong> Contact the customer via WhatsApp or phone call within 15–30 minutes for the highest conversion rate.'
      },
      ctaText: 'Open Enquiries Console',
      ctaLink: `${process.env.APP_URL || 'https://spot-tours-and-travels.vercel.app'}/admin/enquiries`
    });

    await transporter.sendMail({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `📩 [New Lead] ${enquiry.name} (${enquiry.phone}) — ${enquiry.destination || 'Tour Plan'}`,
      html: adminHtml
    }).catch(err => console.error('Admin enquiry email error:', err.message));
  }

  // 2. To CUSTOMER (if email provided)
  if (enquiry.email && enquiry.email.includes('@')) {
    const customerHtml = buildEmailLayout({
      badgeText: 'ENQUIRY RECEIVED',
      badgeColor: '#0E7490',
      badgeBg: '#E0F2FE',
      title: 'Thank You for Contacting Spot Tours!',
      subtitle: 'We have received your custom tour query and are crafting your itinerary.',
      recipientGreeting: `Dear ${enquiry.name},`,
      messageIntro: `Thank you for reaching out to <strong>Spot Tours and Travels Coimbatore</strong>. We have received your query for <strong>${enquiry.destination || 'your upcoming trip'}</strong>. Our travel specialist will connect with you shortly with handpicked stay options, vehicle quotes, and full itinerary details!`,
      specs: specs.slice(0, 5),
      highlightBox: {
        bg: '#ECFDF5',
        border: '#10B981',
        color: '#065F46',
        html: '✨ <strong>100% Customized Plans:</strong> Everything from AC sedan/Innova rentals to 3-star/5-star luxury resorts can be customized to match your budget.'
      },
      ctaText: 'Chat Directly on WhatsApp',
      ctaLink: `https://wa.me/919500551404?text=Hi%20Spot%20Tours,%20I%20am%20${encodeURIComponent(enquiry.name)}%20inquiring%20about%20${encodeURIComponent(enquiry.destination || 'a tour')}`
    });

    await transporter.sendMail({
      from: FROM,
      to: enquiry.email,
      subject: `✈️ Spot Tours & Travels: We Received Your Enquiry for ${enquiry.destination || 'Your Vacation'}`,
      html: customerHtml
    }).catch(err => console.error('Customer enquiry ack email error:', err.message));
  }
}

export async function sendEnquiryStatusNotification(enquiry, newStatus) {
  if (!process.env.SMTP_USER || !enquiry.email || !enquiry.email.includes('@')) return;
  if (newStatus !== 'resolved') return;

  const transporter = createTransporter();
  const html = buildEmailLayout({
    badgeText: 'ENQUIRY RESOLVED',
    badgeColor: '#059669',
    badgeBg: '#ECFDF5',
    title: 'Your Travel Query Has Been Resolved',
    subtitle: 'Spot Tours & Travels Coimbatore Follow-up',
    recipientGreeting: `Dear ${enquiry.name},`,
    messageIntro: `We are glad we could assist you regarding your travel plans to <strong>${enquiry.destination || 'your destination'}</strong>. If you have any additional questions or need further customizations, our team is always just a call away!`,
    specs: [
      { label: 'Customer Name', value: enquiry.name },
      { label: 'Destination', value: enquiry.destination || 'Tour Plan' },
      { label: 'Status', value: 'Resolved & Followed Up' }
    ],
    highlightBox: {
      bg: '#F8FAFC',
      border: '#0E7490',
      color: '#0F172A',
      html: '📞 <strong>24/7 Booking Desk:</strong> Call <strong>095005 51404</strong> anytime for outstation cab rentals, flight ticketing, and holiday packages.'
    },
    ctaText: 'Visit Our Website',
    ctaLink: 'https://spot-tours-and-travels.vercel.app'
  });

  await transporter.sendMail({
    from: FROM,
    to: enquiry.email,
    subject: `✅ Your Travel Enquiry Update — Spot Tours and Travels`,
    html
  }).catch(err => console.error('Enquiry resolution email error:', err.message));
}
