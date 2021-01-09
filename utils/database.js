const Sequelize = require('sequelize');
// const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mailer', 'root', 'password', {
    host: 'localhost',
    port: 3307,
    dialect: "mysql"
});

module.exports = sequelize;
