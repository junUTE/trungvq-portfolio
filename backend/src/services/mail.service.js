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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
