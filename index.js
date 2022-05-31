const express = require("express"); 
const app = express();
const bodyParser = require("body-parser");
const connection = require("./Database/database");
const modelPergunta = require("./Database/Pergunta");
const modelResposta = require("./Database/Resposta");



//CONNECTION BD
connection
        .authenticate()
        .then(()=>{
            console.log("Conexão estabelecida com o BD.");
        })
        .catch((msgErro)=>{
            console.log(msgErro);
        })


//EJS
app.set('view engine','ejs');
app.use(express.static('public'));


//BODY-PARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//ROTAS
app.get("/",(req,res)=>{
    modelPergunta.findAll({
        raw: true, 
        order:[
            ['id','DESC']
        ]
    }).then((perguntas)=>{
        res.render("index",{
            perguntas: perguntas
        });
    });
   
});


app.get("/perguntar",(req,res)=>{
    res.render("perguntar");
});


app.post("/salvarperguntas",(req,res)=>{ // RECEBENDO DO FRONT E CRIANDO LISTA NA TABELA PERGUNTAS
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;
    
    modelPergunta.create({ // INSERT
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/");
    });
});


app.get("/pergunta/:id",(req,res) => { // EQUIVALENTE A ROTA "PERGUNTAR" // ENCONTRA E JOGA DE VOLTA PRO FRONT
    let id = req.params.id;
    modelPergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){

            modelResposta.findAll({
                where: {perguntaId: id},
                order: [
                    ['id','DESC']
                ]
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta:pergunta,
                    respostas:respostas
                });
            });
            
        }
        else{
            res.redirect("/");
        }
    })
    
})

app.post("/salvarresposta",(req,res) => {
    let conteudo = req.body.conteudo; // RECEBENDO DO FRONT
    let perguntaId = req.body.perguntaId; // RECEBENDO DO FRONT --> PARA CRIAR UM ITEM NA TABELA RESPOSTAS

    modelResposta.create({
        conteudo: conteudo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId);
    })


})



//SERVER
app.listen(3000,()=>{
    console.log("App rodando...");
});