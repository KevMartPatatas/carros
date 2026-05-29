const Carro = require('../models/Carro');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Formato URL de la foto
const fotoUrl = (foto) => foto ? `${BASE_URL}/uploads/${foto}` : null;

// GET /api/carros — Listar todos
const listarCarros = async (req, res) => {
  try {
    const carros = await Carro.findAll();
    const data = carros.map(c => ({
      ...c.toJSON(),
      foto: fotoUrl(c.foto),
    }));
    return res.json({ ok: true, data });
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

    return res.json({ ok: true, data: { ...carro.toJSON(), foto: fotoUrl(carro.foto) } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Error al obtener el carro' });
  }
};

// POST /api/carros — Crear
const crearCarro = async (req, res) => {
  try {
    const { placas, serie, color } = req.body;

    // Validar campos obligatorios
    if (!placas || !serie) {
      // Si se subió foto pero faltan campos, eliminarla
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ ok: false, error: 'Los campos placas y serie son obligatorios' });
    }

    const foto = req.file ? req.file.filename : null;

    const carro = await Carro.create({ placas, serie, color, foto });

    return res.status(201).json({
      ok: true,
      mensaje: 'Carro creado correctamente',
      data: { ...carro.toJSON(), foto: fotoUrl(carro.foto) },
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);

    // Error de unicidad (placas o serie duplicadas)
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
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ ok: false, error: 'Carro no encontrado' });
    }

    // Si se sube nueva foto, eliminar la anterior
    if (req.file && carro.foto) {
      const fotoAnterior = path.join('uploads', carro.foto);
      if (fs.existsSync(fotoAnterior)) fs.unlinkSync(fotoAnterior);
    }

    await carro.update({
      placas: placas || carro.placas,
      serie: serie || carro.serie,
      color: color !== undefined ? color : carro.color,
      foto: req.file ? req.file.filename : carro.foto,
    });

    return res.json({
      ok: true,
      mensaje: 'Carro actualizado correctamente',
      data: { ...carro.toJSON(), foto: fotoUrl(carro.foto) },
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);

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

    // Eliminar foto si existe
    if (carro.foto) {
      const fotoPath = path.join('uploads', carro.foto);
      if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
    }

    await carro.destroy();

    return res.json({ ok: true, mensaje: 'Carro eliminado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Error al eliminar el carro' });
  }
};

module.exports = { listarCarros, obtenerCarro, crearCarro, actualizarCarro, eliminarCarro };
