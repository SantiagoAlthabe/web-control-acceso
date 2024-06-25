const mongoose = require("mongoose");



const url = `mongodb+srv://isaac:ami40816117@cluster0.osq4c.mongodb.net/Control-de-acceso?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set("strictQuery", false);

mongoose.connect(url);

const registersSchema = new mongoose.Schema({
  fecha: Date,
  event: String,
  identity: String,
});

const Register = mongoose.model("Register", registersSchema);

const newUser = new Register({
  fecha: "7/6/2024",
  event: "acceso denegado",
  identity: "1235578",
});

newUser.save().then((result) => {
  console.log("Registro guardado!");
  mongoose.connection.close();
});
