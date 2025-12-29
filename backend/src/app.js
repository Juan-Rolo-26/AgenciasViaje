const path = require("path");
const express = require("express");
const cors = require("cors");

const destinationRoutes = require("./api/destinations/destinationRoutes");
const offerRoutes = require("./api/offers/offerRoutes");
const activityRoutes = require("./api/activities/activityRoutes");
const aboutRoutes = require("./api/about/aboutRoutes");
const complaintRoutes = require("./api/complaints/complaintRoutes");
const { API_PREFIX } = require("./config/serverConfig");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use(`${API_PREFIX}/destinos`, destinationRoutes);
app.use(`${API_PREFIX}/ofertas`, offerRoutes);
app.use(`${API_PREFIX}/actividades`, activityRoutes);
app.use(`${API_PREFIX}/nosotros`, aboutRoutes);
app.use(`${API_PREFIX}/quejas`, complaintRoutes);

const frontendDist = path.resolve(__dirname, "..", "public");
app.use(express.static(frontendDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith(API_PREFIX)) {
    return next();
  }
  res.sendFile(path.join(frontendDist, "index.html"));
});

app.use(errorHandler);

module.exports = app;
