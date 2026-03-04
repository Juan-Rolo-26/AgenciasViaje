const ADMIN_SECRET = process.env.ADMIN_SECRET || "topotours2026admin";

module.exports = function adminAuth(req, res, next) {
    const auth = req.headers["authorization"] || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token || token !== ADMIN_SECRET) {
        return res.status(401).json({ error: "No autorizado" });
    }
    next();
};
