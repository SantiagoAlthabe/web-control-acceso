// routes/authRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PlatformUser = require('../models/platformUser');

const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', 
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('password').isLength({ min: 5 }).withMessage('La contraseña debe tener al menos 5 caracteres'),
  async (req, res) => {
    const { name, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingUser = await PlatformUser.findOne({ name });
      if (existingUser) {
        return res.status(401).json({ success: false, message: 'El nombre de usuario ya está en uso' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new PlatformUser({ name, password: hashedPassword });

      await newUser.save();

      const payload = { id: newUser.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '999h' });

      res.status(201).json({ success: true, token, user: newUser });
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Ruta para autenticar un usuario
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos' });
  }

  try {
    const user = await PlatformUser.findOne({ name });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario o contraseña incorrecta' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrecta' });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '999h' });

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;
