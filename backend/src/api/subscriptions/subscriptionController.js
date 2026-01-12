const { sendSubscriptionEmail } = require("../../services/subscriptionService");

function isValidEmail(value) {
  return Boolean(value && String(value).includes("@"));
}

async function submitSubscription(req, res, next) {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        error: "El email es obligatorio."
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "El email ingresado no es válido."
      });
    }

    await sendSubscriptionEmail({
      email: String(email).trim()
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
  submitSubscription
};
