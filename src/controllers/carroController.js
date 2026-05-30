const Carro = require('../models/Carro');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      if (req.file && req.file.public_id) {
        await cloudinary.uploader.destroy(req.file.public_id);
      }
      return res.status(400).json({ ok: false, error: 'Los campos placas y serie son obligatorios' });
    }

    // Cloudinary devuelve la URL directamente en req.file.path
    const foto = req.file ? req.file.path : null;

    const carro = await Carro.create({ placas, serie, color, foto });

    return res.status(201).json({
      ok: true,
      mensaje: 'Carro creado correctamente',
      data: carro,
    });
  } catch (error) {
    if (req.file && req.file.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id);
    }

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
      if (req.file && req.file.public_id) {
        await cloudinary.uploader.destroy(req.file.public_id);
      }
      return res.status(404).json({ ok: false, error: 'Carro no encontrado' });
    }

    // Si se sube nueva foto, eliminar la anterior de Cloudinary
    if (req.file && carro.foto) {
      try {
        const urlPartes = carro.foto.split('/');
        const publicIdConExtension = urlPartes[urlPartes.length - 1];
        const folder = urlPartes[urlPartes.length - 2];
        const publicId = `${folder}/${publicIdConExtension.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (e) {
        console.error('Error eliminando foto anterior:', e.message);
      }
    }

    await carro.update({
      placas: placas || carro.placas,
      serie: serie || carro.serie,
      color: color !== undefined ? color : carro.color,
      foto: req.file ? req.file.path : carro.foto,
    });

    return res.json({
      ok: true,
      mensaje: 'Carro actualizado correctamente',
      data: carro,
    });
  } catch (error) {
    if (req.file && req.file.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id);
    }

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

    // Eliminar foto de Cloudinary si existe
    if (carro.foto) {
      try {
        const urlPartes = carro.foto.split('/');
        const publicIdConExtension = urlPartes[urlPartes.length - 1];
        const folder = urlPartes[urlPartes.length - 2];
        const publicId = `${folder}/${publicIdConExtension.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (e) {
        console.error('Error eliminando foto de Cloudinary:', e.message);
      }
    }

    await carro.destroy();

    return res.json({ ok: true, mensaje: 'Carro eliminado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Error al eliminar el carro' });
  }
};

module.exports = { listarCarros, obtenerCarro, crearCarro, actualizarCarro, eliminarCarro };
