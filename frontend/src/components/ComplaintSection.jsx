import { useState } from "react";
import { apiRequest } from "../api/api.js";
import { CONTACT_EMAIL } from "../utils/contactLinks.js";

export default function ComplaintSection() {
  const contactPhone = "351 878 5667";
  const contactPhoneLink = "tel:+5493518785667";
  const instagramHandle = "@topotoursviajes";
  const instagramLink = "https://instagram.com/topotoursviajes";
  const [formStatus, setFormStatus] = useState({
    type: "idle",
    message: ""
  });

  const handleComplaintSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const topic = (formData.get("topic") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    if (!name || !email || !message) {
      setFormStatus({
        type: "error",
        message: "Completá nombre, email y mensaje para enviar."
      });
      return;
    }

    setFormStatus({ type: "sending", message: "Enviando reclamo..." });

    try {
      await apiRequest("/api/quejas", {
        method: "POST",
        body: {
          name,
          email,
          phone,
          topic,
          message
        }
      });
      setFormStatus({
        type: "success",
        message: "Listo, recibimos tu reclamo. Te respondemos pronto."
      });
      event.currentTarget.reset();
    } catch (err) {
      setFormStatus({
        type: "error",
        message: err?.message || "No pudimos enviar el reclamo."
      });
    }
  };

  return (
    <section className="complaint-section" id="quejas">
      <div className="section-header">
        <h2>Quejas y reclamos</h2>
        <p>
          Queremos ayudarte rápido. Contanos lo que pasó y nuestro equipo se
          contacta a la brevedad.
        </p>
      </div>
      <div className="complaint-grid">
        <form
          className="complaint-card complaint-form"
          onSubmit={handleComplaintSubmit}
        >
          <div className="form-field">
            <label className="form-label" htmlFor="complaint-name">
              Nombre completo
            </label>
            <input
              className="form-input"
              id="complaint-name"
              name="name"
              type="text"
              placeholder="Ej: Ana Martínez"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="complaint-email">
              Email
            </label>
            <input
              className="form-input"
              id="complaint-email"
              name="email"
              type="email"
              placeholder="ana@email.com"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="complaint-phone">
              Teléfono
            </label>
            <input
              className="form-input"
              id="complaint-phone"
              name="phone"
              type="tel"
              placeholder="351 555 1234"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="complaint-topic">
              Tema
            </label>
            <select className="form-input" id="complaint-topic" name="topic">
              <option value="">Seleccioná una opción</option>
              <option value="reserva">Reserva / Cupos</option>
              <option value="pago">Pago / Facturación</option>
              <option value="asistencia">Asistencia en viaje</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="complaint-message">
              Mensaje
            </label>
            <textarea
              className="form-input form-textarea"
              id="complaint-message"
              name="message"
              rows="4"
              placeholder="Contanos el detalle para ayudarte mejor."
            ></textarea>
          </div>
          <button className="form-button" type="submit">
            Enviar reclamo
          </button>
          {formStatus.type !== "idle" ? (
            <p className={`form-status ${formStatus.type}`} role="status">
              {formStatus.message}
            </p>
          ) : null}
        </form>

        <aside className="complaint-info">
          <div className="complaint-info-header">
            <span className="complaint-badge">Respuesta rápida</span>
            <h3>Canales rápidos</h3>
            <p>
              Si tu consulta es urgente, podés escribirnos por los siguientes
              medios:
            </p>
          </div>
          <div className="complaint-channels">
            <a className="complaint-channel" href={`mailto:${CONTACT_EMAIL}`}>
              <span className="channel-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                    strokeWidth="1.7"
                  />
                  <path d="m4 8 8 5 8-5" strokeWidth="1.7" />
                </svg>
              </span>
              <span className="channel-content">
                <span className="channel-label">Mail</span>
                <span className="channel-value">{CONTACT_EMAIL}</span>
              </span>
              <span className="channel-cta">Escribir</span>
            </a>
            <a className="complaint-channel" href={contactPhoneLink}>
              <span className="channel-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 3.9 2 2 0 0 1 4.1 2h2a2 2 0 0 1 2 1.7c.1.8.3 1.6.6 2.3a2 2 0 0 1-.5 2.1L7 9a16 16 0 0 0 6 6l.9-1.2a2 2 0 0 1 2.1-.5c.7.3 1.5.5 2.3.6a2 2 0 0 1 1.7 2Z"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="channel-content">
                <span className="channel-label">Teléfono</span>
                <span className="channel-value">{contactPhone}</span>
              </span>
              <span className="channel-cta">Llamar</span>
            </a>
            <a
              className="complaint-channel"
              href={instagramLink}
              target="_blank"
              rel="noreferrer"
            >
              <span className="channel-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    strokeWidth="1.7"
                  />
                  <circle cx="12" cy="12" r="4" strokeWidth="1.7" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </span>
              <span className="channel-content">
                <span className="channel-label">Instagram</span>
                <span className="channel-value">{instagramHandle}</span>
              </span>
              <span className="channel-cta">Ver perfil</span>
            </a>
          </div>
          <div className="complaint-note">
            <span>Tiempo estimado de respuesta</span>
            <strong>24 a 48 horas hábiles</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
