function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";
  const logPayload = {
    status,
    message,
    method: req.method,
    path: req.originalUrl
  };
  if (status >= 500) {
    console.error("API error:", logPayload);
  } else {
    console.warn("API warning:", logPayload);
  }
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
