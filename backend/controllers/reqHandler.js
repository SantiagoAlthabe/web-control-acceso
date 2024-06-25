const accs_users = require('../models/accsUser');

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

module.exports = reqHandler;
