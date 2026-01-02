function getNumberEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function parseBypassList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || "";
}

function createRateLimiter(options = {}) {
  const windowMs =
    options.windowMs ?? getNumberEnv("RATE_LIMIT_WINDOW_MS", 60 * 1000);
  const max = options.max ?? getNumberEnv("RATE_LIMIT_MAX", 120);
  const cleanupMs =
    options.cleanupMs ?? getNumberEnv("RATE_LIMIT_CLEANUP_MS", 5 * 60 * 1000);
  const bypass = new Set(
    parseBypassList(process.env.RATE_LIMIT_BYPASS || "")
  );
  const skip = options.skip;
  const hits = new Map();
  let lastCleanup = Date.now();

  return function rateLimiter(req, res, next) {
    if (process.env.RATE_LIMIT_DISABLED === "true") {
      return next();
    }
    if (typeof skip === "function" && skip(req)) {
      return next();
    }

    const ip = getClientIp(req);
    if (!ip || bypass.has(ip)) {
      return next();
    }

    const now = Date.now();
    if (now - lastCleanup > cleanupMs) {
      for (const [key, entry] of hits) {
        if (entry.resetAt <= now) {
          hits.delete(key);
        }
      }
      lastCleanup = now;
    }

    const entry = hits.get(ip);
    if (!entry || entry.resetAt <= now) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.set("Retry-After", String(retryAfter));
      return res
        .status(429)
        .json({ error: "Demasiadas solicitudes. Intenta más tarde." });
    }

    return next();
  };
}

module.exports = {
  createRateLimiter
};
