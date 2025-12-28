const express = require("express");
const cors = require("cors");

const destinationRoutes = require("./api/destinations/destinationRoutes");
const offerRoutes = require("./api/offers/offerRoutes");
const activityRoutes = require("./api/activities/activityRoutes");
const aboutRoutes = require("./api/about/aboutRoutes");
const { API_PREFIX } = require("./config/serverConfig");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API de agencias en línea" });
});

app.use(`${API_PREFIX}/destinos`, destinationRoutes);
app.use(`${API_PREFIX}/ofertas`, offerRoutes);
app.use(`${API_PREFIX}/actividades`, activityRoutes);
app.use(`${API_PREFIX}/nosotros`, aboutRoutes);

app.use(errorHandler);

module.exports = app;
