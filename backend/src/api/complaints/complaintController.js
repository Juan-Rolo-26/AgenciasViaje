const { sendComplaintEmail } = require("../../services/complaintService");

function isValidEmail(value) {
  return Boolean(value && String(value).includes("@"));
}

async function submitComplaint(req, res, next) {
  try {
    const { name, email, phone, topic, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Nombre, email y mensaje son obligatorios."
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "El email ingresado no es válido."
      });
    }

    await sendComplaintEmail({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : "",
      topic: topic ? String(topic).trim() : "",
      message: String(message).trim()
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    if (error && error.message === "SMTP no configurado.") {
      return res.status(500).json({
        error:
          "El servidor de correo no está configurado. Contactá al administrador."
      });
    }
    return next(error);
  }
}

module.exports = {
  submitComplaint
};
