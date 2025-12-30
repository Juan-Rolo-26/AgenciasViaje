const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0
});

export function parseAmount(value) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }
  const parsed =
    typeof value === "number" ? value : Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatCurrency(value, currency) {
  const amount = parseAmount(value);
  if (amount === null) {
    return "";
  }
  if (currency && currency !== "ARS") {
    return `${currency} ${amount.toLocaleString("es-AR")}`;
  }
  return currencyFormatter.format(amount);
}

export function formatDate(value) {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleDateString("es-AR", { timeZone: "UTC" });
}

function toUtcDateOnly(value) {
  const date = new Date(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function getPrecioVigente(precios = []) {
  if (!precios.length) {
    return null;
  }
  const hoy = new Date();
  const hoyUtc = Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate());
  const vigente = precios.find((precio) => {
    const inicio = toUtcDateOnly(precio.fechaInicio);
    const fin = toUtcDateOnly(precio.fechaFin);
    return hoyUtc >= inicio && hoyUtc <= fin;
  });
  if (vigente) {
    return vigente;
  }
  return [...precios].sort(
    (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
  )[0];
}
