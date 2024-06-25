require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { subscribeTopics } = require('./services/mqttService');
const authRoutes = require('./routes/authRoutes');
const app = express();

connectDB(); 
app.use(cors());
app.use(express.json());
app.use(require('./middlewares/requestLogger'));

// Rutas
app.use('/api', authRoutes); 
app.use('/accs_users', require('./routes/accsUsers'));
app.use('/platformusers', require('./routes/platformUsers'));
app.use('/registers', require('./routes/registers'));

subscribeTopics();

// Middleware para manejar rutas no definidas
app.use(require('./middlewares/unknownEndpoint'));

// Middleware para manejar errores
app.use(require('./utils/errorHandler'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
