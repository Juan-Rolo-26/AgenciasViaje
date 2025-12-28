require("dotenv").config();

const app = require("./app");
const { PORT } = require("./config/serverConfig");
const { connectDb } = require("./config/db");

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  });
