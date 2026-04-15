const express = require("express");
const prisma = require("../../lib/prisma");

const router = express.Router();

router.get("/", async (_req, res, next) => {
    try {
        const list = await prisma.modoFanatico.findMany({
            where: { activo: true },
            orderBy: [{ orden: "asc" }, { nombre: "asc" }],
            include: { imagenes: { orderBy: { orden: "asc" } } },
        });
        res.json(list);
    } catch (e) { next(e); }
});

router.get("/:slug", async (req, res, next) => {
    try {
        const item = await prisma.modoFanatico.findUnique({
            where: { slug: req.params.slug },
            include: { imagenes: { orderBy: { orden: "asc" } } },
        });
        if (!item || !item.activo) return res.status(404).json({ error: "No encontrado" });
        res.json(item);
    } catch (e) { next(e); }
});

module.exports = router;
