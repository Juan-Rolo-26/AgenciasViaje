function getNumberEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function computeBodySize(body) {
  if (body === undefined || body === null) {
    return 0;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (typeof body === "string") {
    return Buffer.byteLength(body);
  }
  try {
    return Buffer.byteLength(JSON.stringify(body));
  } catch (error) {
    return Number.POSITIVE_INFINITY;
  }
}

function createResponseCache(options = {}) {
  const ttlMs =
    options.ttlMs ?? getNumberEnv("CACHE_TTL_MS", 60 * 1000);
  const maxEntries =
    options.maxEntries ?? getNumberEnv("CACHE_MAX_ENTRIES", 200);
  const maxBodyBytes =
    options.maxBodyBytes ?? getNumberEnv("CACHE_MAX_BODY_BYTES", 256 * 1024);
  const keyPrefix = options.keyPrefix || "";
  const cache = new Map();
  let lastPrune = Date.now();

  function prune(now) {
    if (now - lastPrune < ttlMs) {
      return;
    }
    for (const [key, entry] of cache) {
      if (entry.expiresAt <= now) {
        cache.delete(key);
      }
    }
    if (cache.size > maxEntries) {
      let toRemove = cache.size - maxEntries;
      for (const key of cache.keys()) {
        cache.delete(key);
        toRemove -= 1;
        if (toRemove <= 0) {
          break;
        }
      }
    }
    lastPrune = now;
  }

  return function responseCache(req, res, next) {
    if (process.env.CACHE_DISABLED === "true") {
      return next();
    }
    if (req.method !== "GET") {
      return next();
    }
    if (req.query?.noCache === "1") {
      return next();
    }
    if (req.headers["cache-control"]?.includes("no-cache")) {
      return next();
    }

    const now = Date.now();
    const key = `${keyPrefix}${req.originalUrl}`;
    const cached = cache.get(key);
    if (cached && cached.expiresAt > now) {
      res.set(cached.headers);
      res.status(cached.status);
      return res.send(cached.body);
    }

    const originalSend = res.send.bind(res);
    res.send = (body) => {
      const status = res.statusCode;
      if (status >= 200 && status < 300) {
        const size = computeBodySize(body);
        if (size <= maxBodyBytes) {
          const cacheSeconds = Math.max(1, Math.floor(ttlMs / 1000));
          const headers = {};
          const contentType = res.get("Content-Type");
          if (contentType) {
            headers["Content-Type"] = contentType;
          }
          headers["Cache-Control"] =
            res.get("Cache-Control") ||
            `public, max-age=${cacheSeconds}, stale-while-revalidate=${cacheSeconds}`;
          cache.set(key, {
            body,
            status,
            headers,
            expiresAt: Date.now() + ttlMs
          });
          prune(Date.now());
        }
      }
      return originalSend(body);
    };
    next();
  };
}

module.exports = {
  createResponseCache
};
