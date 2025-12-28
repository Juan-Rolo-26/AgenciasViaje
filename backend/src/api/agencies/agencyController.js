const agencyService = require("../../services/agencyService");

async function getAgencies(req, res, next) {
  try {
    const agencies = agencyService.listAgencies();
    res.json(agencies);
  } catch (error) {
    next(error);
  }
}

async function getAgencyById(req, res, next) {
  try {
    const agency = agencyService.getAgencyById(req.params.id);
    if (!agency) {
      return res.status(404).json({ error: "Agencia no encontrada" });
    }
    res.json(agency);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAgencies,
  getAgencyById
};
