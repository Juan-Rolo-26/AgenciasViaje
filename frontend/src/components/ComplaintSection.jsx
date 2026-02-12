import { useState } from "react";
import { apiRequest } from "../api/api.js";
import { CONTACT_EMAIL, getWhatsappLink } from "../utils/contactLinks.js";

export default function ComplaintSection() {
  const contactPhone = "351 878 5667";
  const contactPhoneLink = getWhatsappLink(
    "Hola! Quiero hacer una consulta. Me pueden ayudar?"
  );
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
            <a
              className="complaint-channel"
              href={contactPhoneLink}
              target="_blank"
              rel="noreferrer"
            >
              <span className="channel-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                  />
                </svg>
              </span>
              <span className="channel-content">
                <span className="channel-label">WhatsApp</span>
                <span className="channel-value">{contactPhone}</span>
              </span>
              <span className="channel-cta">WhatsApp</span>
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
