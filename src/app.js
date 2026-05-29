const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const carrosRouter = require('./routes/carros');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir carpeta de imágenes públicamente
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Ruta raíz — health check
app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API de Carros funcionando 🚗' });
});

// Rutas de la API
app.use('/api/carros', carrosRouter);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, error: 'Error interno del servidor' });
});

// Conectar DB y levantar servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de datos conectada y sincronizada');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar la base de datos:', err.message);
    process.exit(1);
  });
