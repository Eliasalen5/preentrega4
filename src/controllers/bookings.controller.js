import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager.js";

const bookingManager = new BookingManager();
const serviceManager = new ServiceManager();

export const createBooking = async (req, res) => {
  const createdBooking = await bookingManager.createBooking(req.body);

  if (!createdBooking) {
    return res.status(400).json({
      error:
        "Faltan campos obligatorios (clientName, clientEmail, date, time, status)",
    });
  }

  res.status(201).json(createdBooking);
};

export const getBookingById = async (req, res) => {
  const { bid } = req.params;
  const booking = await bookingManager.getBookingById(bid);

  if (!booking) {
    return res
      .status(404)
      .json({ error: `No existe una reserva con id ${bid}` });
  }

  res.status(200).json(booking);
};

export const addServiceToBooking = async (req, res) => {
  const { bid, sid } = req.params;

  const service = await serviceManager.getServiceById(sid);
  if (!service) {
    return res
      .status(404)
      .json({ error: `No existe un servicio con id ${sid}` });
  }

  const updatedBooking = await bookingManager.addServiceToBooking(bid, sid);
  if (!updatedBooking) {
    return res
      .status(404)
      .json({ error: `No existe una reserva con id ${bid}` });
  }

  res.status(200).json(updatedBooking);
};
