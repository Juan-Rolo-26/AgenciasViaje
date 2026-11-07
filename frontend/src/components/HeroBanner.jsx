import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const INTERVAL = 6000;

export default function HeroBanner() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setBanners(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    timerRef.current = setInterval(() => goTo((prev) => (prev + 1) % banners.length), INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [banners.length]);

  function goTo(getNext) {
    setFading(true);
    setTimeout(() => {
      setIndex((prev) => {
        const next = typeof getNext === "function" ? getNext(prev) : getNext;
        return next;
      });
      setFading(false);
    }, 350);
  }

  function handleDotClick(i) {
    if (i === index) return;
    clearInterval(timerRef.current);
    goTo(i);
    timerRef.current = setInterval(() => goTo((prev) => (prev + 1) % banners.length), INTERVAL);
  }

  if (!banners.length) return null;

  const banner = banners[index];

  return (
    <div className="hero-banner-strip">
      <div className={`hero-banner-slide${fading ? " hero-banner-fade" : ""}`}>
        <div
          className={`hero-banner-link${banner.linkUrl ? " hero-banner-link--clickable" : ""}`}
          style={banner.alturaPx ? { height: banner.alturaPx } : undefined}
          onClick={banner.linkUrl ? () => {
            if (banner.linkUrl.startsWith("/")) {
              navigate(banner.linkUrl);
            } else {
              window.open(banner.linkUrl, "_blank", "noopener,noreferrer");
            }
          } : undefined}
        >
          <img
            src={banner.imagen}
            alt={banner.titulo || "Banner"}
            className="hero-banner-img"
          />
          {(banner.titulo || banner.subtitulo) && (
            <div
              className="hero-banner-overlay"
              style={{ color: banner.colorTexto || "#fff" }}
            >
              {banner.titulo && <p className="hero-banner-title">{banner.titulo}</p>}
              {banner.subtitulo && <p className="hero-banner-sub">{banner.subtitulo}</p>}
              {banner.linkTexto && (
                <span className="hero-banner-cta">{banner.linkTexto}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {banners.length > 1 && (
        <div className="hero-banner-dots">
          {banners.map((_, i) => (
            <button
              key={i}
              className={`hero-banner-dot${i === index ? " active" : ""}`}
              onClick={() => handleDotClick(i)}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      )}

      {banners.length > 1 && (
        <>
          <button
            className="hero-banner-arrow hero-banner-arrow-prev"
            onClick={() => { clearInterval(timerRef.current); handleDotClick((index - 1 + banners.length) % banners.length); }}
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            className="hero-banner-arrow hero-banner-arrow-next"
            onClick={() => { clearInterval(timerRef.current); handleDotClick((index + 1) % banners.length); }}
            aria-label="Siguiente"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
