const agencies = [
  {
    id: "1",
    name: "Topotours",
    city: "Córdoba",
    rating: 4.9
  },
  {
    id: "2",
    name: "Ruta Andina",
    city: "Mendoza",
    rating: 4.7
  }
];

function listAgencies() {
  return agencies;
}

function getAgencyById(id) {
  return agencies.find((agency) => agency.id === id) || null;
}

module.exports = {
  listAgencies,
  getAgencyById
};
