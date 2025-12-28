const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0
});

export function parseAmount(value) {
  if (value === null || value === undefined) {
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
  return new Date(value).toLocaleDateString("es-AR");
}

export function getPrecioVigente(precios = []) {
  if (!precios.length) {
    return null;
  }
  const hoy = new Date();
  const vigente = precios.find((precio) => {
    const inicio = new Date(precio.fechaInicio);
    const fin = new Date(precio.fechaFin);
    return hoy >= inicio && hoy <= fin;
  });
  if (vigente) {
    return vigente;
  }
  return [...precios].sort(
    (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
  )[0];
}
