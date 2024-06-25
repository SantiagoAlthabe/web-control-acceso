const mqttClient = require('../config/mqtt')();
const reqHandler = require('../controllers/reqHandler');
const Register = require('../models/register');

mqttClient.on('message', async (topic, payload) => {
  console.log("Received Message:", topic, payload.toString());

  try {
    // Parsear el mensaje principal
    const message = JSON.parse(payload.toString());
    const { device_id, status, code, card } = message;

    if (topic === '/cntrlaxs/solicitud') {
      // Manejar la solicitud de conexión de dispositivo
      if (status === "connected") {
        handleDeviceConnection(device_id);
      } else {
        console.error("Estado desconocido:", status);
      }
    } else if (topic === '/cntrlaxs/solicitud/card') {
      // Manejar solicitud de acceso con tarjeta
      if (card) {
        await handleAccessRequest(device_id, card, 'card_number');
      } else {
        console.error("Tarjeta no proporcionada en el mensaje");
      }
    } else if (topic === '/cntrlaxs/solicitud/code') {
      // Manejar solicitud de acceso con código
      if (code) {
        await handleAccessRequest(device_id, code, 'accs_code');
      } else {
        console.error("Código no proporcionado en el mensaje");
      }
    } else {
      console.error("Tópico desconocido:", topic);
    }
  } catch (error) {
    console.error("Error al procesar el mensaje:", error);
  }
});

const handleDeviceConnection = (device_id) => {
  const responseTopic = `/cntrlaxs/respuesta/${device_id}`;

  // Responder al dispositivo con su propio tópico
  mqttClient.publish(responseTopic, "Device connected", { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(`Error publishing to ${responseTopic}:`, error);
    } else {
      console.log(`Published connection acknowledgment to '${responseTopic}'`);
    }
  });
};

const handleAccessRequest = async (device_id, codigo, tipo) => {
  const result = await reqHandler(codigo, tipo);
  const { code: resultCode } = result;

  // Guardar el registro de la respuesta
  const newRegister = new Register({
    fecha: new Date(),
    identity: codigo, // Utilizamos el código de acceso como identidad
    event: resultCode, // Utilizamos el código como evento
  });

  try {
    await newRegister.save();
    console.log("Registro guardado exitosamente:", newRegister);
  } catch (error) {
    console.error("Error al guardar el registro:", error);
  }

  // Publicar la respuesta en el tópico de respuesta
  const responseTopic = `/cntrlaxs/respuesta/${device_id}`;
  mqttClient.publish(responseTopic, resultCode, { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(`Error publishing to '${responseTopic}':`, error);
    } else {
      console.log(`Published '${resultCode}' to '${responseTopic}'`);
    }
  });
};

const subscribeTopics = () => {
  mqttClient.subscribe(['/cntrlaxs/solicitud', '/cntrlaxs/solicitud/card', '/cntrlaxs/solicitud/code'], (err) => {
    if (err) {
      console.error(`Error subscribing: ${err}`);
    } else {
      console.log('Suscrito a los tópicos');
    }
  });
};

module.exports = { subscribeTopics };
