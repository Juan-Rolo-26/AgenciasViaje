export default function Politicas() {
  const lastUpdated = new Date().toLocaleDateString("es-AR");

  return (
    <main className="policy-page">
      <section className="page-hero policy-hero">
        <div className="page-hero-inner">
          <span className="page-hero-kicker">Legal</span>
          <h1>Política de privacidad y cookies</h1>
          <p>Transparencia y cuidado en el uso de tus datos personales.</p>
        </div>
      </section>

      <section className="policy-section">
        <article className="policy-card">
          <div className="policy-header">
            <h2>Política de privacidad</h2>
            <span className="policy-updated">Última actualización: {lastUpdated}</span>
          </div>
          <p>
            En Topotours (en adelante, “la Agencia”), valoramos y protegemos la
            privacidad de nuestros usuarios y clientes. La presente Política de
            Privacidad describe cómo recopilamos, utilizamos, almacenamos y
            protegemos los datos personales de quienes utilizan nuestro sitio web
            y nuestros servicios.
          </p>

          <ol className="policy-list">
            <li>
              <h3>Responsable del tratamiento de los datos</h3>
              <div className="policy-meta">
                <p>Razón social: Topotours</p>
                <p>Domicilio: Córdoba, Argentina</p>
                <p>
                  Correo electrónico de contacto:{" "}
                  <a href="mailto:topotoursviajes@gmail.com">
                    topotoursviajes@gmail.com
                  </a>
                </p>
                <p>Teléfono / WhatsApp: +54 9 351 878 5667</p>
              </div>
            </li>
            <li>
              <h3>Datos personales que recopilamos</h3>
              <ul>
                <li>Nombre y apellido</li>
                <li>Correo electrónico</li>
                <li>Número de teléfono / WhatsApp</li>
                <li>Documento de identidad (cuando sea necesario para reservas)</li>
                <li>Fecha de nacimiento</li>
                <li>Información de viaje (destinos, fechas, preferencias)</li>
                <li>
                  Datos de facturación y pago (gestionados a través de plataformas
                  seguras de terceros)
                </li>
                <li>Dirección IP y datos de navegación</li>
              </ul>
            </li>
            <li>
              <h3>Finalidad del uso de los datos</h3>
              <ul>
                <li>Gestionar consultas y solicitudes de información</li>
                <li>Cotizar, reservar y organizar viajes</li>
                <li>Contactar al usuario por correo, teléfono o WhatsApp</li>
                <li>Gestionar pagos y facturación</li>
                <li>Mejorar nuestros servicios y la experiencia del usuario</li>
                <li>Cumplir con obligaciones legales y contractuales</li>
                <li>
                  Enviar promociones u ofertas (solo si el usuario lo autoriza)
                </li>
              </ul>
            </li>
            <li>
              <h3>Base legal para el tratamiento</h3>
              <ul>
                <li>El consentimiento del usuario</li>
                <li>La ejecución de un contrato o precontrato</li>
                <li>El cumplimiento de obligaciones legales</li>
              </ul>
            </li>
            <li>
              <h3>Compartición de datos con terceros</h3>
              <p>La Agencia no vende ni comercializa datos personales.</p>
              <p>Podemos compartir información únicamente con:</p>
              <ul>
                <li>
                  Proveedores de servicios turísticos (aerolíneas, hoteles,
                  operadores)
                </li>
                <li>Plataformas de pago seguras</li>
                <li>Proveedores tecnológicos (hosting, email, sistemas de gestión)</li>
              </ul>
              <p>
                Todos ellos cumplen con normas de confidencialidad y protección
                de datos.
              </p>
            </li>
            <li>
              <h3>Seguridad de la información</h3>
              <p>
                Implementamos medidas técnicas y organizativas razonables para
                proteger los datos personales frente a accesos no autorizados,
                pérdida o destrucción, uso indebido o divulgación.
              </p>
            </li>
            <li>
              <h3>Derechos del usuario</h3>
              <p>El usuario puede ejercer los siguientes derechos:</p>
              <ul>
                <li>Acceder a sus datos personales</li>
                <li>Rectificar datos incorrectos o incompletos</li>
                <li>Solicitar la eliminación de sus datos</li>
                <li>Limitar u oponerse al tratamiento</li>
                <li>Retirar su consentimiento en cualquier momento</li>
              </ul>
              <p>
                Para ejercer estos derechos, puede escribir a{" "}
                <a href="mailto:topotoursviajes@gmail.com">
                  topotoursviajes@gmail.com
                </a>
                .
              </p>
            </li>
            <li>
              <h3>Conservación de los datos</h3>
              <ul>
                <li>Mientras exista una relación comercial</li>
                <li>Mientras sea necesario para cumplir obligaciones legales</li>
                <li>Hasta que el usuario solicite su eliminación</li>
              </ul>
            </li>
            <li>
              <h3>Enlaces a sitios externos</h3>
              <p>
                Nuestro sitio puede contener enlaces a páginas de terceros. La
                Agencia no es responsable por las políticas de privacidad de
                dichos sitios.
              </p>
            </li>
            <li>
              <h3>Modificaciones</h3>
              <p>
                Nos reservamos el derecho de modificar esta Política de
                Privacidad. Cualquier cambio será publicado en esta página.
              </p>
            </li>
          </ol>
        </article>

        <article className="policy-card">
          <div className="policy-header">
            <h2>Política de cookies</h2>
            <span className="policy-updated">Última actualización: {lastUpdated}</span>
          </div>
          <p>
            En Topotours utilizamos cookies para mejorar la experiencia del
            usuario y optimizar el funcionamiento del sitio web.
          </p>
          <ol className="policy-list">
            <li>
              <h3>¿Qué son las cookies?</h3>
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en el
                dispositivo del usuario cuando visita un sitio web. Permiten
                reconocer al usuario y recordar información sobre su navegación.
              </p>
            </li>
            <li>
              <h3>Tipos de cookies que utilizamos</h3>
              <div className="policy-subsections">
                <div>
                  <h4>Cookies necesarias</h4>
                  <ul>
                    <li>Seguridad</li>
                    <li>Gestión de sesiones</li>
                    <li>Formularios</li>
                  </ul>
                </div>
                <div>
                  <h4>Cookies de análisis</h4>
                  <ul>
                    <li>Páginas visitadas</li>
                    <li>Tiempo de navegación</li>
                    <li>Origen del tráfico</li>
                    <li>Ejemplo: Google Analytics u herramientas similares</li>
                  </ul>
                </div>
                <div>
                  <h4>Cookies de personalización</h4>
                  <ul>
                    <li>Idioma</li>
                    <li>Destinos de interés</li>
                    <li>Preferencias de navegación</li>
                  </ul>
                </div>
                <div>
                  <h4>Cookies de marketing</h4>
                  <p>
                    Se utilizan para mostrar publicidad relevante y ofertas
                    personalizadas, solo si el usuario lo acepta.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <h3>Gestión de cookies</h3>
              <p>El usuario puede:</p>
              <ul>
                <li>Aceptar o rechazar cookies desde el banner inicial</li>
                <li>Configurar su navegador para bloquear o eliminar cookies</li>
              </ul>
              <p>
                La desactivación de cookies puede afectar algunas funcionalidades
                del sitio.
              </p>
            </li>
            <li>
              <h3>Cookies de terceros</h3>
              <p>
                Podemos utilizar servicios de terceros que instalan cookies para
                análisis, pagos o integración con redes sociales. Estos terceros
                gestionan sus propias políticas de privacidad.
              </p>
            </li>
            <li>
              <h3>Cambios en la política de cookies</h3>
              <p>
                Esta política puede actualizarse en cualquier momento. Las
                modificaciones se publicarán en esta misma página.
              </p>
            </li>
          </ol>
        </article>
      </section>
    </main>
  );
}
