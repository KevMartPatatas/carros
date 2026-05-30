const Carro = require('../models/Carro');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Sube buffer a Cloudinary
const subirACloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'carros' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// GET /api/carros — Listar todos
const listarCarros = async (req, res) => {
  try {
    const carros = await Carro.findAll();
    return res.json({ ok: true, data: carros });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Error al obtener los carros' });
  }
};

// GET /api/carros/:id — Obtener uno
const obtenerCarro = async (req, res) => {
  try {
    const { id } = req.params;
    const carro = await Carro.findByPk(id);
    if (!carro) {
      return res.status(404).json({ ok: false, error: 'Carro no encontrado' });
    }
    return res.json({ ok: true, data: carro });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Error al obtener el carro' });
  }
};

// POST /api/carros — Crear
const crearCarro = async (req, res) => {
  try {
    const { placas, serie, color } = req.body;

    if (!placas || !serie) {
      return res.status(400).json({ ok: false, error: 'Los campos placas y serie son obligatorios' });
    }

    let fotoUrl = null;
    if (req.file) {
      const resultado = await subirACloudinary(req.file.buffer);
      fotoUrl = resultado.secure_url;
    }

    const carro = await Carro.create({ placas, serie, color, foto: fotoUrl });

    return res.status(201).json({
      ok: true,
      mensaje: 'Carro creado correctamente',
      data: carro,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const campo = error.errors[0]?.path;
      return res.status(400).json({ ok: false, error: `El campo '${campo}' ya existe` });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ ok: false, error: error.errors[0]?.message || 'Datos inválidos' });
    }
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Error al crear el carro' });
  }
};

// PUT /api/carros/:id — Actualizar
const actualizarCarro = async (req, res) => {
  try {
    const { id } = req.params;
    const { placas, serie, color } = req.body;

    const carro = await Carro.findByPk(id);
    if (!carro) {
      return res.status(404).json({ ok: false, error: 'Carro no encontrado' });
    }

    let fotoUrl = carro.foto;
    if (req.file) {
      const resultado = await subirACloudinary(req.file.buffer);
      fotoUrl = resultado.secure_url;
    }

    await carro.update({
      placas: placas || carro.placas,
      serie: serie || carro.serie,
      color: color !== undefined ? color : carro.color,
      foto: fotoUrl,
    });

    return res.json({
      ok: true,
      mensaje: 'Carro actualizado correctamente',
      data: carro,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const campo = error.errors[0]?.path;
      return res.status(400).json({ ok: false, error: `El campo '${campo}' ya existe` });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ ok: false, error: error.errors[0]?.message || 'Datos inválidos' });
    }
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Error al actualizar el carro' });
  }
};

// DELETE /api/carros/:id — Eliminar
const eliminarCarro = async (req, res) => {
  try {
    const { id } = req.params;
    const carro = await Carro.findByPk(id);

    if (!carro) {
      return res.status(404).json({ ok: false, error: 'Carro no encontrado' });
    }

    await carro.destroy();
    return res.json({ ok: true, mensaje: 'Carro eliminado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Error al eliminar el carro' });
  }
};

module.exports = { listarCarros, obtenerCarro, crearCarro, actualizarCarro, eliminarCarro };
