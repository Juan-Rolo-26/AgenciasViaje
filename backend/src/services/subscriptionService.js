const nodemailer = require("nodemailer");

const DEFAULT_TO = "topotoursviajes@gmail.com";

function buildTransport() {
  const {
    SMTP_SERVICE,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE
  } = process.env;

  if (!SMTP_SERVICE && !SMTP_HOST) {
    throw new Error("SMTP no configurado.");
  }

  const transportConfig = SMTP_SERVICE
    ? { service: SMTP_SERVICE }
    : {
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: SMTP_SECURE === "true"
      };

  if (SMTP_USER && SMTP_PASS) {
    transportConfig.auth = {
      user: SMTP_USER,
      pass: SMTP_PASS
    };
  }

  return nodemailer.createTransport(transportConfig);
}

async function sendSubscriptionEmail(payload) {
  const transport = buildTransport();
  const mailTo = process.env.MAIL_TO || DEFAULT_TO;
  const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER || mailTo;
  const subject = "Nueva suscripción a notificaciones";

  const plainText = [
    "Nueva suscripción registrada:",
    "",
    `Email: ${payload.email || "-"}`
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2a44;">
      <h2 style="margin: 0 0 12px;">Nueva suscripción</h2>
      <p><strong>Email:</strong> ${payload.email || "-"}</p>
    </div>
  `;

  return transport.sendMail({
    from: `Topotours Notificaciones <${fromAddress}>`,
    to: mailTo,
    replyTo: payload.email || fromAddress,
    subject,
    text: plainText,
    html
  });
}

module.exports = {
  sendSubscriptionEmail
};
