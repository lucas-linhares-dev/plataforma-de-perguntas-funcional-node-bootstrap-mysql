const Sequelize = require("sequelize");
const connection = require("./database"); // CHAMANDO CONNECTION

const Pergunta = connection.define('perguntas',{ // CIRANDO TABELA/MODEL "Pergunta" no BD
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force: false}).then(()=>{
    console.log("Model criado");
});

module.exports = Pergunta;