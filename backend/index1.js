// Importar el módulo express
const express = require("express");
const app = express(); // Crear una instancia de la aplicación Express
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors"); // Importar el middleware CORS

// Middleware para permitir CORS
app.use(cors());

// Mongoose
const mongoose = require("mongoose");

const url = `mongodb+srv://isaac:ami40816117@cluster0.osq4c.mongodb.net/Control-de-acceso?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

// Define el modelo para los usuarios para el dispositivo de acceso
const Usuarios_accesoSchema = new mongoose.Schema({
  user_name: String,
  accs_code: String,
  card_number: String,
  allowed_accs: String,
});

const accs_users = mongoose.model("accs_users", Usuarios_accesoSchema);

// Define el modelo para la colección registers
const RegistersSchema = new mongoose.Schema({

// Define el modelo para los usuarios de la plataforma
const platformUsersSchema = new mongoose.Schema(
  {
    name: String,
    password: String,
    confirmPassword: String,
  },
  { collection: "platformusers" }
); // Especifica el nombre de la colección

const PlatformUser = mongoose.model("PlatformUser", platformUsersSchema);

Usuarios_accesoSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Middleware para registrar solicitudes
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

// Middleware para parsear el cuerpo de las solicitudes a JSON
app.use(express.json());

// Middleware para registrar solicitudes
app.use(requestLogger);

// Función para manejar rutas desconocidas
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

//========================================= Rutas para usuarios del dispositivo de acceso ============================

// Ruta principal
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// Ruta para obtener todos los usuarios con acceso
app.get("/accs_users", (request, response) => {
  accs_users
    .find({})
    .then((users) => {
      response.json(users);
    })
    .catch((error) => {
      response.status(500).json({ error: "Internal server error" });
    });
});

// Ruta para agregar un nuevo usuario con acceso
app.post("/accs_users", (request, response) => {
  const body = request.body;

  if (!body.user_name) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const newUser = new accs_users({
    user_name: body.user_name,
    accs_code: body.accs_code,
    card_number: body.card_number,
    allowed_accs: body.allowed_accs,
  });

  newUser
    .save()
    .then((savedUser) => {
      response.json(savedUser);
    })
    .catch((error) => {
      response.status(500).json({ error: "Internal server error" });
    });
});

// Ruta para obtener un usuario con acceso por su ID
app.get("/accs_users/:id", (request, response) => {
  const id = request.params.id;

  accs_users
    .findById(id)
    .then((user) => {
      if (user) {
        response.json(user);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      response.status(500).json({ error: "Internal server error" });
    });
});

// Ruta para eliminar un usuario con acceso por su ID
app.delete("/accs_users/:id", (request, response) => {
  const id = request.params.id;

  accs_users
    .findByIdAndDelete(id)
    .then((deletedUser) => {
      if (deletedUser) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      response.status(500).json({ error: "Internal server error" });
    });
});

// Ruta para actualizar un usuario con acceso por su ID
app.put("/accs_users/:id", (request, response) => {
  const id = request.params.id;
  const body = request.body;

  accs_users
    .findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (updatedUser) {
        response.json(updatedUser);
      } else {
        response.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      response.status(500).json({ error: "Internal server error" });
    });
});

//========================================= Rutas para usuarios de la Plataforma ============================

// Ruta para obtener todos los usuarios de la plataforma
app.get("/platformusers", (request, response) => {
  PlatformUser.find({})
    .then((users) => {
      response.json(users);
    })
    .catch((error) => {
      response.status(500).json({ error: "Internal server error" });
    });
});

// Ruta para agregar un nuevo usuario de la plataforma web
app.post("/platformusers", (request, response) => {
  const body = request.body;

  if (!body.name || !body.password || !body.confirmPassword) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const newUser = new PlatformUser({
    name: body.name,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  newUser
    .save()
    .then((savedUser) => {
      response.json(savedUser);
    })
    .catch((error) => {
      response.status(500).json({ error: "Internal server error" });
    });
});

//========================================= Rutas para registros en la colección 'registers' ============================

// Ruta para agregar un nuevo registro
app.post("/registers", (request, response) => {
  const body = request.body;

  if (!body.fecha || !body.identity || !body.event) {
    return response.status(400).json({
      error: "Todos los campos son requeridos",
    });
  }

  const newRegister = new Register({
    fecha: body.fecha,
    identity: body.identity,
    event: body.event,
  });

  newRegister
    .save()
    .then((savedRegister) => {
      response.json(savedRegister);
    })
    .catch((error) => {
      response.status(500).json({ error: "Error al guardar el registro" });
    });
});

// Ruta para obtener todos los registros
app.get("/registers", (request, response) => {
  Register.find({})
    .then((registers) => {
      response.json(registers);
    })
    .catch((error) => {
      response.status(500).json({ error: "Error al obtener los registros" });
    });
});

//==================================================Manejo de solicitudes mqtt====================================

const reqHandler = async (codigo, tipo) => {
  try {
    let user;
    if (tipo === "card_number") {
      // Buscar el documento que coincida con el card_number
      user = await accs_users.findOne({ card_number: codigo });
    } else if (tipo === "accs_code") {
      // Buscar el documento que coincida con el accs_code
      user = await accs_users.findOne({ accs_code: codigo });
    }

    // Verificar si se encontró el usuario y el estado de allowed_accs
    if (user) {
      if (user.allowed_accs === "puerta") {
        return { code: "111", activity: "Acceso permitido a la puerta", userId: user._id.toString() };
      } else if (user.allowed_accs === "cofre") {
        return { code: "101", activity: "Acceso permitido al cofre", userId: user._id.toString() };
      } else {
        return { code: "100", activity: "Acceso denegado", userId: user._id.toString() };
      }
    } else {
      return { code: "100", activity: "Acceso denegado", userId: "Desconocido" };
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return { code: "100", activity: "Error en el procesamiento", userId: "Error" };
  }
};

// Middleware para manejar rutas no definidas
app.use(unknownEndpoint);

// Puerto en el que escucha el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//==========================================MQTT===========================================================

const mqtt = require("mqtt");

// Conectar al broker MQTT
const client = mqtt.connect("mqtt://mqtt.eclipseprojects.io", {
  clean: true,
  username: "user",
  password: "pass",
});

const topic_sol_card = "/cntrlaxs/solicitud/card";
const topic_sol_code = "/cntrlaxs/solicitud/code";
const topic_res = "/cntrlaxs/respuesta";

client.on("connect", () => {
  console.log("Connected");

  // Suscribirse a los topics de solicitud
  client.subscribe([topic_sol_card, topic_sol_code], () => {
    console.log(`Subscribed to topics '${topic_sol_card}' and '${topic_sol_code}'`);
  });
});

client.on("message", async (topic, payload) => {
  console.log("Received Message:", topic, payload.toString());

  let tipo = '';
  if (topic === topic_sol_card) {
    tipo = 'card_number';
  } else if (topic === topic_sol_code) {
    tipo = 'accs_code';
  }

  if (tipo) {
    const codigoAcceso = payload.toString();
    const result = await reqHandler(codigoAcceso, tipo);
    const { code, activity, userId } = result;

    // Guardar el registro de la respuesta
    const newRegister = new Register({
      fecha: new Date(),
      identity: codigoAcceso, // Utilizamos el código de acceso como identidad
      event: activity, // Utilizamos la actividad como evento
    });

    try {
      await newRegister.save();
      console.log("Registro guardado exitosamente:", newRegister);
    } catch (error) {
      console.error("Error al guardar el registro:", error);
    }

    // Publicar la respuesta en el topic de respuesta
    client.publish(topic_res, code, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error("Error publishing:", error);
      } else {
        console.log(`Published '${code}' to '${topic_res}'`);
      }
    });
  }
});
