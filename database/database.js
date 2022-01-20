const pkg = require('sequelize');

const { Sequelize } = pkg;
const { HOST_DB, USER_DB, PASSWORD_DB, PORT_DB, NAME_DB } = process.env;
const sequelize = new Sequelize(`mysql://${USER_DB}:${PASSWORD_DB}@${HOST_DB}:${PORT_DB}/${NAME_DB}`, { logging: false });

module.exports = sequelize;