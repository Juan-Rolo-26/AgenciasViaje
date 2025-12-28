const packages = [
  {
    id: "1",
    agencyId: "1",
    name: "Caribe Soñado",
    durationDays: 7,
    priceUsd: 890
  },
  {
    id: "2",
    agencyId: "1",
    name: "Europa Cultural",
    durationDays: 12,
    priceUsd: 1490
  },
  {
    id: "3",
    agencyId: "2",
    name: "Patagonia Viva",
    durationDays: 5,
    priceUsd: 640
  }
];

function listPackages() {
  return packages;
}

function getPackageById(id) {
  return packages.find((pkg) => pkg.id === id) || null;
}

module.exports = {
  listPackages,
  getPackageById
};
