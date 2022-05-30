const express = require("express"); 
const app = express();
const bodyParser = require("body-parser");
const connection = require("./Database/database");
const modelPergunta = require("./Database/Pergunta");


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
    modelPergunta.findAll({raw: true, order: [
        ['id','DESC']
    ]}).then((perguntas)=>{
        console.log(perguntas);
        res.render("index",{
            perguntas: perguntas
        });
    });
   
});


app.get("/perguntar",(req,res)=>{
    res.render("perguntar");
});


app.post("/salvarperguntas",(req,res)=>{
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;
    
    modelPergunta.create({ // INSERT
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/");
    });
});


app.get("/pergunta/:id",(req,res) => {
    let id = req.params.id;
    modelPergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            res.render("pergunta");
        }
        else{
            res.redirect("/");
        }
    })
})



//SERVER
app.listen(3000,()=>{
    console.log("App rodando...");
});