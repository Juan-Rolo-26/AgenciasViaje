let bookings = [
  {
    id: "1",
    packageId: "1",
    travelerName: "Camila Pérez",
    passengers: 2,
    status: "confirmada"
  }
];

function listBookings() {
  return bookings;
}

function createBooking(payload) {
  const newBooking = {
    id: String(bookings.length + 1),
    status: "pendiente",
    ...payload
  };

  bookings = [...bookings, newBooking];
  return newBooking;
}

module.exports = {
  listBookings,
  createBooking
};
