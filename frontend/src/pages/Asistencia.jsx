export default function Asistencia() {
  return (
    <main>
      <section className="highlight">
        <div className="highlight-content">
          <h2>Asistencia en cada etapa</h2>
          <p>
            Soporte antes, durante y después del viaje. Coordinadores y
            asistencia médica disponibles en tus paquetes.
          </p>
          <ul>
            <li>Chat y soporte 24/7.</li>
            <li>Asistencia al viajero incluida.</li>
            <li>Reprogramaciones flexibles.</li>
          </ul>
        </div>
        <div className="highlight-panel">
          <div>
            <h3>Atención personalizada</h3>
            <p>Escribinos y te armamos la mejor propuesta.</p>
          </div>
          <button className="primary" type="button">
            Hablar con un asesor
          </button>
        </div>
      </section>

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
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="form-field">
              <label className="form-label" htmlFor="complaint-name">
                Nombre completo
              </label>
              <input
                className="form-input"
                id="complaint-name"
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
                type="tel"
                placeholder="351 555 1234"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="complaint-topic">
                Tema
              </label>
              <select className="form-input" id="complaint-topic">
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
                rows="4"
                placeholder="Contanos el detalle para ayudarte mejor."
              ></textarea>
            </div>
            <button className="form-button" type="submit">
              Enviar reclamo
            </button>
          </form>

          <aside className="complaint-info">
            <h3>Canales rápidos</h3>
            <p>
              Si tu consulta es urgente, podés escribirnos por los siguientes
              medios:
            </p>
            <ul>
              <li>
                <strong>Mail</strong>
                <span>topotoursviajes@gmail.com</span>
              </li>
              <li>
                <strong>Teléfono</strong>
                <span>351 878 5667</span>
              </li>
              <li>
                <strong>Instagram</strong>
                <span>@topotoursviajes</span>
              </li>
            </ul>
            <div className="complaint-note">
              <span>Tiempo estimado de respuesta</span>
              <strong>24 a 48 horas hábiles</strong>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
