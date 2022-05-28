const Sequelize = require('sequelize');
const connection = new Sequelize('projetoperguntas','root','lucas321',{
    host:'localhost',
    dialect:'mysql'
})

module.exports = connection;