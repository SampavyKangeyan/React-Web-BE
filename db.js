const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('react_web_project', 'root', '0731', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
