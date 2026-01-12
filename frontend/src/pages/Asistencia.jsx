import { getWhatsappLink } from "../utils/contactLinks.js";
import ComplaintSection from "../components/ComplaintSection.jsx";

export default function Asistencia() {
  const asistenciaWhatsappLink = getWhatsappLink(
    "Hola! Necesito asistencia en cada etapa del viaje. Me pueden ayudar?"
  );

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
          <a
            className="primary"
            href={asistenciaWhatsappLink}
            target="_blank"
            rel="noreferrer"
          >
            Hablar con un asesor
          </a>
        </div>
      </section>

      <ComplaintSection />
    </main>
  );
}
