const bookingService = require("../../services/bookingService");

async function getBookings(req, res, next) {
  try {
    const bookings = bookingService.listBookings();
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

async function createBooking(req, res, next) {
  try {
    const { packageId, travelerName, passengers } = req.body || {};
    if (!packageId || !travelerName || !passengers) {
      return res
        .status(400)
        .json({ error: "packageId, travelerName y passengers son obligatorios" });
    }

    const booking = bookingService.createBooking({
      packageId,
      travelerName,
      passengers
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBookings,
  createBooking
};
