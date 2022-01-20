const pkg = require('sequelize');
const { DataTypes } = pkg;
const sequelize = require('./database');

const Pago = sequelize.define('pagos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_alumno: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  nombre_apoderado: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  curso: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  rut_alumno: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email_apoderado: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  monto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING(65),
    allowNull: false
  },
  estado: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = Pago;