const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  listarCarros,
  obtenerCarro,
  crearCarro,
  actualizarCarro,
  eliminarCarro,
} = require('../controllers/carroController');

// GET    /api/carros        — Listar todos
router.get('/', listarCarros);

// GET    /api/carros/:id    — Obtener uno
router.get('/:id', obtenerCarro);

// POST   /api/carros        — Crear (con foto opcional)
router.post('/', upload.single('foto'), (req, res, next) => {
  next();
}, crearCarro);

// PUT    /api/carros/:id    — Actualizar (con foto opcional)
router.put('/:id', upload.single('foto'), (req, res, next) => {
  next();
}, actualizarCarro);

// DELETE /api/carros/:id    — Eliminar
router.delete('/:id', eliminarCarro);

// Manejo de error de Multer (tipo de archivo inválido)
router.use((err, req, res, next) => {
  if (err.message && err.message.includes('Tipo de archivo')) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  next(err);
});

module.exports = router;
