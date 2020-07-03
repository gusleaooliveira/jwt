require("dotenv-safe").config();

const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

function verifiqueJwt(req, res, next){
  let token = req.headers["x-access-token"];
  if(!token)return res.status(401).json({auth: false, message: "Nenhum token fornecido"});

  jwt.verify(token, process.env.SECRET, function(err, decoded){
    if(err)return res.status(500).json({auth: false, message: "Falha au autenticar o token"});

    req.userId = decoded.id;
    next();
  });
}

let usuarios = [
  {"usuario": "gustavo", "senha": "lorem123"},
  {"usuario": "sonia", "senha": "lorem321"},
  {"usuario": "barbara", "senha": "123lorem"}
];

let tarefas = [];
let id = 0;

app.get("/", (req, res, next) => {
    res.json({message: "faça login em: /login"});
});

app.post("/login", (req, res, next) => {
  usuarios.forEach((item, i) => {
    if(item["usuario"] == req.body.usuario && item["senha"] == req.body.senha){
      id++;
      let token = jwt.sign({id}, process.env.SECRET, {expiresIn: 300 });
      return res.json({auth: true, token: token});
    }
  });
  return res.status(500).json({message: "Login Invalido faça o login em /login"});
});

app.get("/tarefas", verifiqueJwt, (req, res, next) => {
  res.json(tarefas);
});
app.post("/tarefas", verifiqueJwt, (req, res, next) => {
  tarefas.push(req.body);
  res.json(tarefas);
});
app.put("/tarefas/:id", verifiqueJwt, (req, res, next) => {
  if(tarefas[req.params.id]){
        tarefas[req.params.id]=req.body;
        return res.json(tarefas);
  }
  else{ return res.json({mensage: "Erro ao alterar a tarefa"}); }
});
app.delete("/tarefas/:id", verifiqueJwt, (req, res, next) => {
  if(tarefas[req.params.id]){
        tarefas[req.params.id]=req.body;
        return res.json(tarefas);
  }
  else{ return res.json({mensage: "Erro ao alterar a tarefa"}); }
});

app.listen(3000);

console.log("https://localhost:3000/");
