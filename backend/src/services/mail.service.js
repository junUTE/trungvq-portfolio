import nodemailer from "nodemailer";

function isMailConfigured() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

let transporter;

function getTransporter() {
  if (!isMailConfigured()) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  return transporter;
}

export async function sendContactNotification(contact) {
  const mailTransporter = getTransporter();

  if (!mailTransporter) {
    return {
      delivered: false,
      skipped: true,
      reason: "Email transport is not configured."
    };
  }

  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const toAddress = process.env.EMAIL_TO || process.env.EMAIL_USER;
  const subject = `New portfolio contact from ${contact.name}`;

  await mailTransporter.sendMail({
    from: fromAddress,
    to: toAddress,
    replyTo: contact.email,
    subject,
    text: [
      "You received a new portfolio contact.",
      `Name: ${contact.name}`,
      `Email: ${contact.email}`,
      "",
      "Message:",
      contact.message
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin-bottom:16px;">New portfolio contact</h2>
        <p><strong>Name:</strong> ${escapeHtml(contact.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;">${escapeHtml(contact.message)}</p>
      </div>
    `
  });

  return {
    delivered: true,
    skipped: false
  };
}

export async function sendContactAutoReply(contact) {
  const mailTransporter = getTransporter();

  if (!mailTransporter) {
    return {
      delivered: false,
      skipped: true,
      reason: "Email transport is not configured."
    };
  }

  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const replyToAddress = process.env.EMAIL_TO || process.env.EMAIL_USER;
  const portfolioName = process.env.PORTFOLIO_OWNER_NAME || "Trung";
  const subject = "Thanks for reaching out";

  await mailTransporter.sendMail({
    from: fromAddress,
    to: contact.email,
    replyTo: replyToAddress,
    subject,
    text: [
      `Hi ${contact.name},`,
      "",
      "Thanks for reaching out through my portfolio.",
      "I have received your message and will get back to you as soon as possible.",
      "My usual response time is within 2 days.",
      "",
      "Your message:",
      contact.message,
      "",
      `Best regards,`,
      portfolioName
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#0f172a">
        <p>Hi ${escapeHtml(contact.name)},</p>
        <p>Thanks for reaching out through my portfolio.</p>
        <p>I have received your message and will get back to you as soon as possible. My usual response time is within 2 days.</p>
        <p><strong>Your message:</strong></p>
        <p style="white-space:pre-wrap;">${escapeHtml(contact.message)}</p>
        <p style="margin-top:24px;">Best regards,<br />${escapeHtml(portfolioName)}</p>
      </div>
    `
  });

  return {
    delivered: true,
    skipped: false
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
