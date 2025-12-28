import "./DestinationDetail.css";

export default function DestinationDetail({ name, description, images }) {
  return (
    <section className="destination-detail">
      <div className="destination-detail-grid">
        <div className="destination-detail-info">
          <h2>Detalle del destino</h2>

          <p className="destination-detail-description">{description}</p>

          <div className="destination-detail-tags">
            <span>Playas iconicas</span>
            <span>Gastronomia local</span>
            <span>Vida nocturna</span>
            <span>Naturaleza</span>
          </div>

          <div className="destination-detail-highlight">
            <strong>Por que elegir {name}?</strong>
            <p>
              Es un destino que combina paisajes unicos, cultura vibrante y
              experiencias inolvidables, ideal tanto para relajarse como para
              explorar.
            </p>
          </div>
        </div>

        <div className="destination-detail-gallery">
          {images.map((img, index) => (
            <div key={`${img}-${index}`} className="destination-gallery-item">
              <img src={img} alt={`${name} ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
