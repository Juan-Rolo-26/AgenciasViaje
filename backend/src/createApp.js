const path = require("path");
const express = require("express");
const cors = require("cors");

const { createRateLimiter } = require("./middleware/rateLimiter");
const destinationRoutes = require("./api/destinations/destinationRoutes");
const offerRoutes = require("./api/offers/offerRoutes");
const activityRoutes = require("./api/activities/activityRoutes");
const cruiseRoutes = require("./api/cruises/cruiseRoutes");
const aboutRoutes = require("./api/about/aboutRoutes");
const complaintRoutes = require("./api/complaints/complaintRoutes");
const subscriptionRoutes = require("./api/subscriptions/subscriptionRoutes");
const assistantRoutes = require("./api/assistant/assistantRoutes");
const adminRoutes = require("./api/admin/adminRoutes");
const { API_PREFIX } = require("./config/serverConfig");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || "200kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});
app.get(`${API_PREFIX}/health`, (_req, res) => {
  res.json({ ok: true });
});

app.use(API_PREFIX, createRateLimiter());
app.use(`${API_PREFIX}/destinos`, destinationRoutes);
app.use(`${API_PREFIX}/ofertas`, offerRoutes);
app.use(`${API_PREFIX}/actividades`, activityRoutes);
app.use(`${API_PREFIX}/cruceros`, cruiseRoutes);
app.use(`${API_PREFIX}/nosotros`, aboutRoutes);
app.use(`${API_PREFIX}/quejas`, complaintRoutes);
app.use(`${API_PREFIX}/suscripciones`, subscriptionRoutes);
app.use(`${API_PREFIX}/assistant`, assistantRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);

const frontendDist = path.resolve(__dirname, "..", "public");
app.use(
  express.static(frontendDist, {
    maxAge: "1d",
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      } else {
        res.setHeader(
          "Cache-Control",
          "public, max-age=86400, immutable"
        );
      }
    }
  })
);
app.get("*", (req, res, next) => {
  if (req.path.startsWith(API_PREFIX)) {
    return next();
  }

  res.set("Cache-Control", "no-cache");
  if (req.path.startsWith("/admin")) {
    return res.sendFile(path.join(frontendDist, "admin", "index.html"));
  }

  res.sendFile(path.join(frontendDist, "index.html"));
});

app.use(errorHandler);

module.exports = app;
