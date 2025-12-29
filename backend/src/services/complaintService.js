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

function formatTopic(topic) {
  return topic ? topic.trim() : "Consulta";
}

async function sendComplaintEmail(payload) {
  const transport = buildTransport();
  const mailTo = process.env.MAIL_TO || DEFAULT_TO;
  const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER || mailTo;
  const subject = `Queja / Reclamo - ${formatTopic(payload.topic)}`;

  const plainText = [
    "Nuevo reclamo recibido:",
    "",
    `Nombre: ${payload.name || "-"}`,
    `Email: ${payload.email || "-"}`,
    `Teléfono: ${payload.phone || "-"}`,
    `Tema: ${formatTopic(payload.topic)}`,
    "",
    "Mensaje:",
    payload.message || "-"
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2a44;">
      <h2 style="margin: 0 0 12px;">Nuevo reclamo recibido</h2>
      <p><strong>Nombre:</strong> ${payload.name || "-"}</p>
      <p><strong>Email:</strong> ${payload.email || "-"}</p>
      <p><strong>Teléfono:</strong> ${payload.phone || "-"}</p>
      <p><strong>Tema:</strong> ${formatTopic(payload.topic)}</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      <p style="white-space: pre-wrap;">${payload.message || "-"}</p>
    </div>
  `;

  return transport.sendMail({
    from: `Topotours Reclamos <${fromAddress}>`,
    to: mailTo,
    replyTo: payload.email || fromAddress,
    subject,
    text: plainText,
    html
  });
}

module.exports = {
  sendComplaintEmail
};
