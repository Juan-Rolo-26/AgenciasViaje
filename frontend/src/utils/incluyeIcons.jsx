const incluyeIconos = {
  transporte: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="7" width="18" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M7 7V5H17V7" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  traslado: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="7" width="18" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M7 7V5H17V7" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  aereo: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2 12l20-8-6.5 8 6.5 8-20-8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 13l-1.5 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 11l-1.5-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  alojamiento: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="11" width="18" height="6" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M7 11V8H11V11" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M3 17V20M21 17V20" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  comida: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  asistencia: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3l7 3v6c0 5-3.5 9-7 9s-7-4-7-9V6l7-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 8v6M9 11h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  equipaje: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="7" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 7V5H15V7" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  excursion: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 4v14M15 6v14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  entrada: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 8h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  guia: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M5 20a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  servicio: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="12" width="3" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="18" y="12" width="3" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 18v2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v8M8 12h8" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
};

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const hasAny = (value, matches) => matches.some((item) => value.includes(item));

const matchIconKey = (normalized) => {
  if (!normalized) {
    return "default";
  }
  if (incluyeIconos[normalized]) {
    return normalized;
  }
  if (hasAny(normalized, ["aereo", "vuelo", "avion", "flight"])) {
    return "aereo";
  }
  if (hasAny(normalized, ["traslado", "traslados", "transfer", "transfers"])) {
    return "traslado";
  }
  if (hasAny(normalized, ["aloj", "hotel", "hosped", "hostel", "habitacion"])) {
    return "alojamiento";
  }
  if (hasAny(normalized, ["comida", "desayuno", "almuerzo", "cena", "pension", "regimen", "all inclusive", "todo incluido"])) {
    return "comida";
  }
  if (hasAny(normalized, ["asistencia", "seguro", "medic", "salud", "assist"])) {
    return "asistencia";
  }
  if (hasAny(normalized, ["equipaje", "maleta", "valija", "baggage", "luggage"])) {
    return "equipaje";
  }
  if (hasAny(normalized, ["excursion", "excursiones", "tour", "visita", "actividad"])) {
    return "excursion";
  }
  if (hasAny(normalized, ["entrada", "entradas", "ticket", "tickets", "pase", "ingreso"])) {
    return "entrada";
  }
  if (hasAny(normalized, ["guia", "guide", "coordinador"])) {
    return "guia";
  }
  if (hasAny(normalized, ["servicio", "servicios"])) {
    return "servicio";
  }
  if (hasAny(normalized, ["transporte", "bus", "micro", "autobus"])) {
    return "transporte";
  }
  return "default";
};

export const getIncluyeIcon = (tipo) => {
  const normalized = normalizeText(tipo);
  const key = matchIconKey(normalized);
  return incluyeIconos[key] || incluyeIconos.default;
};

