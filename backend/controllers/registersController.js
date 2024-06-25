const Register = require('../models/register');

exports.getAllRegisters = async (req, res) => {
  try {
    const registers = await Register.find({}).sort({ fecha: -1 });
    res.json(registers);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los registros" });
  }
};

exports.createRegister = async (req, res) => {
  const body = req.body;

  if (!body.fecha || !body.identity || !body.event) {
    return res.status(400).json({
      error: "Todos los campos son requeridos",
    });
  }

  const newRegister = new Register({
    fecha: body.fecha,
    identity: body.identity,
    event: body.event,
  });

  try {
    const savedRegister = await newRegister.save();
    res.json(savedRegister);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el registro" });
  }
};
