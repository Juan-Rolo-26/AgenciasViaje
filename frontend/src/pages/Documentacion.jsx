import { useState } from "react";
import { Link } from "react-router-dom";

export default function Documentacion() {
  const [openSection, setOpenSection] = useState("mercosur");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? "" : section);
  };

  return (
    <main className="docs-page premium-docs-page">
      {/* Hero Section */}
      <section className="docs-hero-premium">
        <div className="docs-hero-overlay"></div>
        <div className="docs-hero-content">
          <div className="back-button-container" style={{ marginBottom: '24px' }}>
            <Link className="premium-back-button" to="/">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Volver al Inicio</span>
            </Link>
          </div>
          <div className="docs-hero-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Ministerio del Interior - Dirección Nacional de Migraciones</span>
          </div>
          <h1 className="docs-hero-title">Documentación para Viajar</h1>
          <p className="docs-hero-subtitle">
            Guía completa sobre los requisitos documentales para viajar al MERCOSUR y destinos internacionales
          </p>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="docs-quick-info">
        <div className="quick-info-grid">
          <div className="quick-info-card">
            <div className="quick-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h3>MERCOSUR</h3>
            <p>DNI o Pasaporte válido</p>
          </div>
          <div className="quick-info-card">
            <div className="quick-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3>Internacional</h3>
            <p>Pasaporte + Visa si corresponde</p>
          </div>
          <div className="quick-info-card">
            <div className="quick-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Menores</h3>
            <p>Autorización + Partida de nacimiento</p>
          </div>
        </div>
      </section>

      {/* Main Documentation Content */}
      <section className="docs-content-premium">
        <div className="docs-container">
          {/* MERCOSUR Section */}
          <article className="docs-accordion-card">
            <button
              className={`docs-accordion-header ${openSection === "mercosur" ? "active" : ""}`}
              onClick={() => toggleSection("mercosur")}
            >
              <div className="accordion-header-content">
                <div className="accordion-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" strokeLinejoin="round" />
                    <path d="M9 4v14M15 6v14" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h2>Destinos MERCOSUR y Asociados</h2>
                  <p>Requisitos para viajar a países miembros del MERCOSUR</p>
                </div>
              </div>
              <svg className="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div className={`docs-accordion-content ${openSection === "mercosur" ? "open" : ""}`}>
              <div className="docs-section-block">
                <div className="docs-block-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <h3>Documentos Válidos de Viaje</h3>
                </div>
                <ul className="docs-list">
                  <li>DNI (ver observaciones)</li>
                  <li>Cédula de Identidad MERCOSUR, expedida por la Policía Federal Argentina</li>
                  <li>Cédula de Identidad, expedida por la Policía Federal Argentina (formato viejo sin Código de Lectura Mecánica)</li>
                  <li>Cédula de Identidad Provincial, expedida por los Gobiernos Provinciales (para Bolivia y Chile)</li>
                  <li>Libreta Cívica y/o de Enrolamiento</li>
                  <li>Pasaporte de su nacionalidad vigente</li>
                </ul>
              </div>

              <div className="docs-section-block">
                <div className="docs-block-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  <h3>Observaciones Importantes</h3>
                </div>
                <ul className="docs-list">
                  <li>Cualquiera sea el documento que presente, deberá estar en buen estado de conservación</li>
                  <li>El menor que cumplió 16 años tiene un plazo de 180 días para el canje de su DNI (Decreto Nº 538/04)</li>
                  <li>No se puede viajar con la constancia de trámite del DNI o Cédulas vencidas</li>
                  <li>Tampoco se podrá salir del país sin la correspondiente actualización de los 8 años en el DNI</li>
                </ul>
              </div>

              <div className="docs-section-block">
                <div className="docs-block-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <h3>Menores de Edad</h3>
                </div>

                <div className="docs-subsection">
                  <h4>Viajan solos o con uno de sus padres</h4>
                  <ul className="docs-list">
                    <li>Permiso/Autorización de viaje del padre faltante (tramitado ante escribano público)</li>
                    <li>Partida de nacimiento o libreta de matrimonio (originales)</li>
                    <li>Documento de identidad válido (DNI, Cédula o Pasaporte)</li>
                  </ul>
                </div>

                <div className="docs-subsection">
                  <h4>Viajan con ambos padres</h4>
                  <ul className="docs-list">
                    <li>Partida de nacimiento o libreta de matrimonio (originales)</li>
                    <li>Documento de identidad válido (DNI, Cédula o Pasaporte)</li>
                  </ul>
                </div>
              </div>

              <div className="docs-section-block">
                <div className="docs-block-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <h3>Países del MERCOSUR y Asociados</h3>
                </div>
                <div className="countries-grid">
                  <div className="country-item">
                    <strong>Argentina</strong>
                    <span>DNI, Cédula, Pasaporte, Libreta</span>
                  </div>
                  <div className="country-item">
                    <strong>Brasil</strong>
                    <span>Cédula de Identidad, Pasaporte</span>
                  </div>
                  <div className="country-item">
                    <strong>Paraguay</strong>
                    <span>Cédula de Identidad, Pasaporte</span>
                  </div>
                  <div className="country-item">
                    <strong>Uruguay</strong>
                    <span>Cédula de Identidad, Pasaporte</span>
                  </div>
                  <div className="country-item">
                    <strong>Bolivia</strong>
                    <span>Cédula de Identidad, Pasaporte</span>
                  </div>
                  <div className="country-item">
                    <strong>Chile</strong>
                    <span>Cédula de Identidad, Pasaporte</span>
                  </div>
                  <div className="country-item">
                    <strong>Colombia</strong>
                    <span>Pasaporte, Cédula, Cédula de Extranjería</span>
                  </div>
                  <div className="country-item">
                    <strong>Ecuador</strong>
                    <span>Cédula de Ciudadanía, Pasaporte</span>
                  </div>
                  <div className="country-item">
                    <strong>Perú</strong>
                    <span>Pasaporte, DNI, Carné de Extranjería</span>
                  </div>
                  <div className="country-item">
                    <strong>Venezuela</strong>
                    <span>Pasaporte, Cédula de Identidad</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* International Section */}
          <article className="docs-accordion-card">
            <button
              className={`docs-accordion-header ${openSection === "international" ? "active" : ""}`}
              onClick={() => toggleSection("international")}
            >
              <div className="accordion-header-content">
                <div className="accordion-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div>
                  <h2>Destinos Internacionales (NO MERCOSUR)</h2>
                  <p>Requisitos para viajar fuera del bloque regional</p>
                </div>
              </div>
              <svg className="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div className={`docs-accordion-content ${openSection === "international" ? "open" : ""}`}>
              <div className="docs-section-block">
                <div className="docs-block-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <h3>Documentos Válidos de Viaje</h3>
                </div>
                <ul className="docs-list">
                  <li>Pasaporte de su nacionalidad válido y vigente</li>
                  <li>Visación consular si el país de destino lo requiere</li>
                </ul>
                <div className="docs-alert">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p>El pasaporte debe estar en buen estado de conservación</p>
                </div>
              </div>

              <div className="docs-section-block">
                <div className="docs-block-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <h3>Menores de Edad</h3>
                </div>

                <div className="docs-subsection">
                  <h4>Viajan solos o con uno de sus padres</h4>
                  <ul className="docs-list">
                    <li>Pasaporte de su nacionalidad vigente</li>
                    <li>Permiso/Autorización de viaje del padre faltante (escribano o autoridad competente)</li>
                    <li>Partida de nacimiento o libreta de matrimonio (originales)</li>
                  </ul>
                </div>

                <div className="docs-subsection">
                  <h4>Viajan con ambos padres</h4>
                  <ul className="docs-list">
                    <li>Pasaporte de su nacionalidad vigente</li>
                    <li>Partida de nacimiento o libreta de matrimonio (originales)</li>
                  </ul>
                </div>
              </div>

              <div className="docs-section-block">
                <div className="docs-block-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <h3>Régimen para Salida de Menores</h3>
                </div>

                <div className="regime-cases">
                  <div className="regime-case">
                    <div className="regime-case-header">
                      <span className="regime-case-badge">CASO A</span>
                      <h4>Menor con ambos padres</h4>
                    </div>
                    <ul className="docs-list">
                      <li>Partida de nacimiento o libreta de familia</li>
                      <li>DNI, Cédula o Pasaporte vigente</li>
                    </ul>
                  </div>

                  <div className="regime-case">
                    <div className="regime-case-header">
                      <span className="regime-case-badge">CASO B</span>
                      <h4>Menor con uno de sus padres</h4>
                    </div>
                    <ul className="docs-list">
                      <li>Partida de nacimiento o libreta de familia</li>
                      <li>Autorización del otro progenitor (judicial, escribano o autoridad competente)</li>
                      <li>DNI, Cédula o Pasaporte vigente</li>
                    </ul>
                  </div>

                  <div className="regime-case">
                    <div className="regime-case-header">
                      <span className="regime-case-badge">CASO C</span>
                      <h4>Menor sin sus padres</h4>
                    </div>
                    <ul className="docs-list">
                      <li>Partida de nacimiento o libreta de familia</li>
                      <li>Autorización de ambos padres (judicial, escribano o autoridad competente)</li>
                      <li>
                        <strong>0 a 13 años:</strong> Autorización debe incluir país de destino y datos completos de quien lo recibirá
                      </li>
                      <li>
                        <strong>14 a 17 años:</strong> Autorización debe incluir país de destino
                      </li>
                      <li>DNI, Cédula o Pasaporte vigente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Contact Section */}
      <section className="docs-contact-section">
        <div className="docs-contact-card">
          <div className="docs-contact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3>¿Tenés dudas sobre la documentación?</h3>
          <p>Contactanos y te asesoramos sobre todos los requisitos para tu viaje</p>
          <a href="https://wa.me/5493512345678" className="docs-contact-button" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </section>
    </main>
  );
}
