const app = require("./createApp");

module.exports = app;

// Compatibilidad con paneles de hosting que ejecutan src/app.js como entrypoint.
if (require.main === module) {
  require("./index");
}
