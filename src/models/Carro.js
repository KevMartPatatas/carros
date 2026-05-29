const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Carro = sequelize.define('Carro', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  placas: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Las placas son obligatorias' },
      notNull: { msg: 'Las placas son obligatorias' },
    },
  },
  serie: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'La serie es obligatoria' },
      notNull: { msg: 'La serie es obligatoria' },
    },
  },
  color: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  foto: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'carros',
  timestamps: true,
});

module.exports = Carro;
