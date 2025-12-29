require("dotenv").config();

const app = require("./app");
const { connectDb } = require("./config/db");

const PORT = process.env.PORT || 3000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor iniciado correctamente en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  });
