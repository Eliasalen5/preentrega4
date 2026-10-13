import ServiceManager from "../managers/ServiceManager.js";

const serviceManager = new ServiceManager();

export const getServices = async (req, res) => {
  const services = await serviceManager.getServices(req.query);
  res.status(200).json(services);
};

export const getServiceById = async (req, res) => {
  const { sid } = req.params;
  const service = await serviceManager.getServiceById(sid);

  if (!service) {
    return res
      .status(404)
      .json({ error: `No existe un servicio con id ${sid}` });
  }

  res.status(200).json(service);
};

export const createService = async (req, res) => {
  const createdService = await serviceManager.addService(req.body);

  if (!createdService) {
    return res.status(400).json({
      error:
        "Faltan campos obligatorios (name, description, duration, price, category, available)",
    });
  }

  res.status(201).json(createdService);
};

export const updateService = async (req, res) => {
  const { sid } = req.params;
  const updatedService = await serviceManager.updateService(sid, req.body);

  if (!updatedService) {
    return res
      .status(404)
      .json({ error: `No existe un servicio con id ${sid}` });
  }

  res.status(200).json(updatedService);
};

export const deleteService = async (req, res) => {
  const { sid } = req.params;
  const deletedService = await serviceManager.deleteService(sid);

  if (!deletedService) {
    return res
      .status(404)
      .json({ error: `No existe un servicio con id ${sid}` });
  }

  res.status(200).json(deletedService);
};
