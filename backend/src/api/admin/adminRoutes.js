const express = require("express");
const adminAuth = require("../../middleware/adminAuth");
const prisma = require("../../lib/prisma");

const router = express.Router();
router.use(adminAuth);

/* ── AUTH CHECK ── */
router.get("/me", (_req, res) => res.json({ ok: true, role: "admin" }));

/* ── STATS ── */
router.get("/stats", async (_req, res, next) => {
    try {
        const [totalDestinos, totalOfertas, totalPaquetes, totalGrupales, totalActividades, totalCruceros] =
            await Promise.all([
                prisma.destino.count(),
                prisma.oferta.count(),
                prisma.oferta.count({ where: { tipo: "individual" } }),
                prisma.oferta.count({ where: { tipo: "grupal" } }),
                prisma.actividad.count(),
                prisma.crucero.count(),
            ]);
        res.json({ totalDestinos, totalOfertas, totalPaquetes, totalGrupales, totalActividades, totalCruceros });
    } catch (e) { next(e); }
});

/* ── DESTINOS ── */
router.get("/destinos", async (_req, res, next) => {
    try {
        const list = await prisma.destino.findMany({
            orderBy: [{ orden: "asc" }, { nombre: "asc" }],
            include: { galeria: { orderBy: { orden: "asc" } } },
        });
        res.json(list);
    } catch (e) { next(e); }
});

router.get("/destinos/:id", async (req, res, next) => {
    try {
        const d = await prisma.destino.findUnique({ where: { id: +req.params.id }, include: { galeria: true } });
        if (!d) return res.status(404).json({ error: "No encontrado" });
        res.json(d);
    } catch (e) { next(e); }
});

router.post("/destinos", async (req, res, next) => {
    try {
        const { galeria, ...data } = req.body;
        if (data.precioPesos !== undefined) data.precioPesos = Number(data.precioPesos);
        if (data.precioDolares !== undefined) data.precioDolares = Number(data.precioDolares);
        const d = await prisma.destino.create({
            data: {
                ...data,
                galeria: galeria?.length
                    ? { create: galeria.map((g, i) => ({ imagen: g.imagen, epigrafe: g.epigrafe || null, orden: i })) }
                    : undefined,
            },
            include: { galeria: true },
        });
        res.status(201).json(d);
    } catch (e) { next(e); }
});

router.put("/destinos/:id", async (req, res, next) => {
    try {
        const id = +req.params.id;
        const { galeria, ...data } = req.body;
        if (data.precioPesos !== undefined) data.precioPesos = Number(data.precioPesos);
        if (data.precioDolares !== undefined) data.precioDolares = Number(data.precioDolares);
        await prisma.$transaction(async (tx) => {
            await tx.destino.update({ where: { id }, data });
            if (galeria !== undefined) {
                await tx.imagenDestino.deleteMany({ where: { destinoId: id } });
                if (galeria.length) {
                    await tx.imagenDestino.createMany({
                        data: galeria.map((g, i) => ({ destinoId: id, imagen: g.imagen, epigrafe: g.epigrafe || null, orden: i })),
                    });
                }
            }
        });
        const updated = await prisma.destino.findUnique({ where: { id }, include: { galeria: true } });
        res.json(updated);
    } catch (e) { next(e); }
});

router.delete("/destinos/:id", async (req, res, next) => {
    try {
        await prisma.destino.delete({ where: { id: +req.params.id } });
        res.status(204).send();
    } catch (e) { next(e); }
});

/* ── OFERTAS ── */
router.get("/ofertas", async (req, res, next) => {
    try {
        const { tipo } = req.query;
        const ofertas = await prisma.oferta.findMany({
            where: tipo ? { tipo } : undefined,
            orderBy: [{ orden: "asc" }, { creadaEn: "desc" }],
            include: {
                destino: { select: { id: true, nombre: true, slug: true, paisRegion: true } },
                incluyeItems: true,
                precios: true,
                destinos: { include: { destino: { select: { id: true, nombre: true } } } },
            },
        });
        res.json(ofertas);
    } catch (e) { next(e); }
});

router.get("/ofertas/:id", async (req, res, next) => {
    try {
        const o = await prisma.oferta.findUnique({
            where: { id: +req.params.id },
            include: { destino: true, incluyeItems: true, precios: true, destinos: { include: { destino: true } } },
        });
        if (!o) return res.status(404).json({ error: "No encontrada" });
        res.json(o);
    } catch (e) { next(e); }
});

router.post("/ofertas", async (req, res, next) => {
    try {
        const { incluyeItems, precios, destinosIds, ...data } = req.body;
        if (data.precioPesos !== undefined) data.precioPesos = Number(data.precioPesos);
        if (data.precioDolares !== undefined) data.precioDolares = Number(data.precioDolares);
        const o = await prisma.oferta.create({
            data: {
                ...data,
                destinoId: Number(data.destinoId),
                incluyeItems: incluyeItems?.length ? { create: incluyeItems } : undefined,
                precios: precios?.length ? { create: precios } : undefined,
                destinos: destinosIds?.length
                    ? { create: destinosIds.map((did) => ({ destinoId: Number(did) })) }
                    : undefined,
            },
            include: { destino: true, incluyeItems: true, precios: true },
        });
        res.status(201).json(o);
    } catch (e) { next(e); }
});

router.put("/ofertas/:id", async (req, res, next) => {
    try {
        const id = +req.params.id;
        const { incluyeItems, precios, destinosIds, ...data } = req.body;
        if (data.precioPesos !== undefined) data.precioPesos = Number(data.precioPesos);
        if (data.precioDolares !== undefined) data.precioDolares = Number(data.precioDolares);
        await prisma.$transaction(async (tx) => {
            const updateData = { ...data };
            if (updateData.destinoId) updateData.destinoId = Number(updateData.destinoId);
            await tx.oferta.update({ where: { id }, data: updateData });
            if (incluyeItems !== undefined) {
                await tx.incluyeOferta.deleteMany({ where: { ofertaId: id } });
                if (incluyeItems.length)
                    await tx.incluyeOferta.createMany({ data: incluyeItems.map((i) => ({ ...i, id: undefined, ofertaId: id })) });
            }
            if (precios !== undefined) {
                await tx.precioOferta.deleteMany({ where: { ofertaId: id } });
                if (precios.length)
                    await tx.precioOferta.createMany({ data: precios.map((p) => ({ ...p, id: undefined, ofertaId: id, precio: p.precio || 0, moneda: p.moneda || "ARS" })) });
            }
            if (destinosIds !== undefined) {
                await tx.ofertaDestino.deleteMany({ where: { ofertaId: id } });
                if (destinosIds.length)
                    await tx.ofertaDestino.createMany({ data: destinosIds.map((did) => ({ ofertaId: id, destinoId: Number(did) })) });
            }
        });
        const updated = await prisma.oferta.findUnique({
            where: { id },
            include: { destino: true, incluyeItems: true, precios: true, destinos: { include: { destino: true } } },
        });
        res.json(updated);
    } catch (e) { next(e); }
});

router.delete("/ofertas/:id", async (req, res, next) => {
    try {
        await prisma.oferta.delete({ where: { id: +req.params.id } });
        res.status(204).send();
    } catch (e) { next(e); }
});

/* ── EXCURSIONES / ACTIVIDADES ── */
router.get("/excursiones", async (req, res, next) => {
    try {
        const list = await prisma.actividad.findMany({
            orderBy: [{ orden: "asc" }, { nombre: "asc" }],
            include: { destino: { select: { id: true, nombre: true } } },
        });
        res.json(list);
    } catch (e) { next(e); }
});

router.get("/excursiones/:id", async (req, res, next) => {
    try {
        const a = await prisma.actividad.findUnique({
            where: { id: +req.params.id },
            include: { destino: true },
        });
        if (!a) return res.status(404).json({ error: "No encontrada" });
        res.json(a);
    } catch (e) { next(e); }
});

router.post("/excursiones", async (req, res, next) => {
    try {
        const data = { ...req.body };
        if (data.destinoId) data.destinoId = Number(data.destinoId);
        if (data.precio !== undefined) data.precio = Number(data.precio);
        if (data.precioPesos !== undefined) data.precioPesos = Number(data.precioPesos);
        if (data.precioDolares !== undefined) data.precioDolares = Number(data.precioDolares);
        if (data.cupos !== undefined) data.cupos = Number(data.cupos);
        const a = await prisma.actividad.create({ data, include: { destino: true } });
        res.status(201).json(a);
    } catch (e) { next(e); }
});

router.put("/excursiones/:id", async (req, res, next) => {
    try {
        const id = +req.params.id;
        const data = { ...req.body };
        if (data.destinoId) data.destinoId = Number(data.destinoId);
        if (data.precio !== undefined) data.precio = Number(data.precio);
        if (data.precioPesos !== undefined) data.precioPesos = Number(data.precioPesos);
        if (data.precioDolares !== undefined) data.precioDolares = Number(data.precioDolares);
        if (data.cupos !== undefined) data.cupos = Number(data.cupos);
        const a = await prisma.actividad.update({ where: { id }, data, include: { destino: true } });
        res.json(a);
    } catch (e) { next(e); }
});

router.delete("/excursiones/:id", async (req, res, next) => {
    try {
        await prisma.actividad.delete({ where: { id: +req.params.id } });
        res.status(204).send();
    } catch (e) { next(e); }
});

/* ── CRUCEROS ── */
router.get("/cruceros", async (req, res, next) => {
    try {
        const list = await prisma.crucero.findMany({
            orderBy: [{ orden: "asc" }, { fechaSalida: "asc" }],
            include: {
                destino: { select: { id: true, nombre: true, slug: true } },
                galeria: { orderBy: { orden: "asc" } },
            },
        });
        res.json(list);
    } catch (e) { next(e); }
});

router.get("/cruceros/:id", async (req, res, next) => {
    try {
        const crucero = await prisma.crucero.findUnique({
            where: { id: +req.params.id },
            include: {
                destino: true,
                galeria: { orderBy: { orden: "asc" } },
            },
        });
        if (!crucero) return res.status(404).json({ error: "No encontrado" });
        res.json(crucero);
    } catch (e) { next(e); }
});

router.post("/cruceros", async (req, res, next) => {
    try {
        const { galeria, ...rawData } = req.body;
        const data = { ...rawData };

        // Handle optional numeric fields
        if (data.destinoId) {
            data.destinoId = Number(data.destinoId);
        } else {
            delete data.destinoId;
        }

        data.duracionNoches = data.duracionNoches !== undefined ? Number(data.duracionNoches) : 0;
        data.precio = data.precio !== undefined ? Number(data.precio) : 0;
        data.precioPesos = data.precioPesos !== undefined ? Number(data.precioPesos) : 0;
        data.precioDolares = data.precioDolares !== undefined ? Number(data.precioDolares) : 0;
        data.cupos = data.cupos !== undefined ? Number(data.cupos) : 0;
        data.orden = data.orden !== undefined ? Number(data.orden) : 0;

        // Limpiar campos vacíos para que Prisma use null o el default correctamente
        Object.keys(data).forEach(key => {
            if (data[key] === "" || data[key] === null) {
                delete data[key];
            }
        });

        const crucero = await prisma.crucero.create({
            data: {
                ...data,
                galeria: galeria?.length
                    ? {
                        create: galeria.map((item, index) => ({
                            imagen: item.imagen,
                            epigrafe: item.epigrafe || null,
                            orden: index,
                        })),
                    }
                    : undefined,
            },
            include: {
                destino: true,
                galeria: { orderBy: { orden: "asc" } },
            },
        });
        res.status(201).json(crucero);
    } catch (e) { next(e); }
});

router.put("/cruceros/:id", async (req, res, next) => {
    try {
        const id = +req.params.id;
        const { galeria, ...rawData } = req.body;
        const data = { ...rawData };

        // Handle optional numeric fields
        data.destinoId = data.destinoId ? Number(data.destinoId) : null;
        if (data.duracionNoches !== undefined) data.duracionNoches = Number(data.duracionNoches);
        if (data.precio !== undefined) data.precio = Number(data.precio);
        if (data.precioPesos !== undefined) data.precioPesos = Number(data.precioPesos);
        if (data.precioDolares !== undefined) data.precioDolares = Number(data.precioDolares);
        if (data.cupos !== undefined) data.cupos = Number(data.cupos);
        if (data.orden !== undefined) data.orden = Number(data.orden);

        await prisma.$transaction(async (tx) => {
            await tx.crucero.update({ where: { id }, data });
            if (galeria !== undefined) {
                await tx.imagenCrucero.deleteMany({ where: { cruceroId: id } });
                if (galeria.length) {
                    await tx.imagenCrucero.createMany({
                        data: galeria.map((item, index) => ({
                            cruceroId: id,
                            imagen: item.imagen,
                            epigrafe: item.epigrafe || null,
                            orden: index,
                        })),
                    });
                }
            }
        });

        const updated = await prisma.crucero.findUnique({
            where: { id },
            include: {
                destino: true,
                galeria: { orderBy: { orden: "asc" } },
            },
        });
        res.json(updated);
    } catch (e) { next(e); }
});

router.delete("/cruceros/:id", async (req, res, next) => {
    try {
        await prisma.crucero.delete({ where: { id: +req.params.id } });
        res.status(204).send();
    } catch (e) { next(e); }
});

/* ── MODO FANÁTICO ── */
router.get("/modo-fanatico", async (_req, res, next) => {
    try {
        const list = await prisma.modoFanatico.findMany({
            orderBy: [{ orden: "asc" }, { nombre: "asc" }],
            include: { imagenes: { orderBy: { orden: "asc" } } },
        });
        res.json(list);
    } catch (e) { next(e); }
});

router.get("/modo-fanatico/:id", async (req, res, next) => {
    try {
        const item = await prisma.modoFanatico.findUnique({
            where: { id: +req.params.id },
            include: { imagenes: { orderBy: { orden: "asc" } } },
        });
        if (!item) return res.status(404).json({ error: "No encontrado" });
        res.json(item);
    } catch (e) { next(e); }
});

router.post("/modo-fanatico", async (req, res, next) => {
    try {
        const { imagenes, ...data } = req.body;
        if (data.precioPesos !== undefined) data.precioPesos = Number(data.precioPesos);
        if (data.precioDolares !== undefined) data.precioDolares = Number(data.precioDolares);
        const item = await prisma.modoFanatico.create({
            data: {
                ...data,
                imagenes: imagenes?.length
                    ? { create: imagenes.map((img, i) => ({ imagen: img.imagen, epigrafe: img.epigrafe || null, orden: i })) }
                    : undefined,
            },
            include: { imagenes: { orderBy: { orden: "asc" } } },
        });
        res.status(201).json(item);
    } catch (e) { next(e); }
});

router.put("/modo-fanatico/:id", async (req, res, next) => {
    try {
        const id = +req.params.id;
        const { imagenes, ...data } = req.body;
        if (data.precioPesos !== undefined) data.precioPesos = Number(data.precioPesos);
        if (data.precioDolares !== undefined) data.precioDolares = Number(data.precioDolares);
        await prisma.$transaction(async (tx) => {
            await tx.modoFanatico.update({ where: { id }, data });
            if (imagenes !== undefined) {
                await tx.imagenFanatico.deleteMany({ where: { modoFanaticoId: id } });
                if (imagenes.length) {
                    await tx.imagenFanatico.createMany({
                        data: imagenes.map((img, i) => ({ modoFanaticoId: id, imagen: img.imagen, epigrafe: img.epigrafe || null, orden: i })),
                    });
                }
            }
        });
        const updated = await prisma.modoFanatico.findUnique({
            where: { id },
            include: { imagenes: { orderBy: { orden: "asc" } } },
        });
        res.json(updated);
    } catch (e) { next(e); }
});

router.delete("/modo-fanatico/:id", async (req, res, next) => {
    try {
        await prisma.modoFanatico.delete({ where: { id: +req.params.id } });
        res.status(204).send();
    } catch (e) { next(e); }
});

module.exports = router;
