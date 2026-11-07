const express = require("express");
const prisma = require("../../lib/prisma");
const { createResponseCache } = require("../../middleware/responseCache");

const router = express.Router();
const cache = createResponseCache();

router.get("/", cache, async (_req, res, next) => {
  try {
    const list = await prisma.banner.findMany({
      where: { activo: true },
      orderBy: [{ orden: "asc" }, { creadoEn: "asc" }],
    });
    res.json(list);
  } catch (e) { next(e); }
});

module.exports = router;
