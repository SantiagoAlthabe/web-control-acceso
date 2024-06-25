const AccsUser = require("../models/accsUser");

exports.checkExists = async (req, res) => {
    const { user_name, accs_code, card_number, exclude_id } = req.query;
  
    if (!user_name && !accs_code && !card_number) {
      return res.status(400).json({ message: 'Missing required parameter: user_name, accs_code, or card_number' });
    }
  
    try {
      let query = { _id: { $ne: exclude_id } }; 
        if (user_name) query.user_name = user_name;
      if (accs_code) query.accs_code = accs_code;
      if (card_number) query.card_number = card_number;
  
      const existingUser = await AccsUser.findOne(query);
      res.json({ exists: !!existingUser, id: existingUser?._id });
    } catch (error) {
      console.error('Error retrieving user:', error); // Log the error for debugging
      res.status(500).json({ message: 'Error retrieving user' }); // Generic error message for the client
    }
  };
  

exports.getAllAccsUsers = async (req, res) => {
  try {
    const users = await AccsUser.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving access users", error });
  }
};

exports.createAccsUser = async (req, res) => {
  const body = req.body;

  if (!body.user_name) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const newUser = new AccsUser({
    user_name: body.user_name,
    accs_code: body.accs_code,
    card_number: body.card_number,
    allowed_accs: body.allowed_accs,
  });

  try {
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
// obtener un usuario con acceso por su ID
exports.getAccsUserById = async (req, res) => {
  try {
    const user = await AccsUser.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

// Actualizar un usuario con acceso por su ID
exports.updateAccsUser = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  if (!body.user_name) {
    return res.status(400).json({
      error: "El nombre de usuario es requerido",
    });
  }

  try {
    const updatedUser = await AccsUser.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Eliminar un usuario con acceso por su ID
exports.deleteAccsUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await AccsUser.findByIdAndDelete(id);
    if (deletedUser) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
