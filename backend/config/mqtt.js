const mqtt = require('mqtt');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno

const connectMQTT = () => {
  const client = mqtt.connect(process.env.MQTT_URI, {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
  });

  client.on('connect', () => {
    console.log('MQTT Connected');
  });

  client.on('error', (err) => {
    console.error(`MQTT Connection Error: ${err}`);
    client.end();
  });

  return client;
};

module.exports = connectMQTT;
