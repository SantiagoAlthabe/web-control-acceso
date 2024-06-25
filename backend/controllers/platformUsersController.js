const PlatformUser = require('../models/platformUser');

exports.getAllPlatformUsers = async (req, res) => {
  try {
    const users = await PlatformUser.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createPlatformUser = async (req, res) => {
  const body = req.body;

  if (!body.name || !body.password || !body.confirmPassword) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const newUser = new PlatformUser({
    name: body.name,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  try {
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Otros métodos para actualizar y eliminar
