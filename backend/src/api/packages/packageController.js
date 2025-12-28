const packageService = require("../../services/packageService");

async function getPackages(req, res, next) {
  try {
    const packages = packageService.listPackages();
    res.json(packages);
  } catch (error) {
    next(error);
  }
}

async function getPackageById(req, res, next) {
  try {
    const pkg = packageService.getPackageById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ error: "Paquete no encontrado" });
    }
    res.json(pkg);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPackages,
  getPackageById
};
