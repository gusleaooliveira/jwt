const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res, next) => {
	res.send({msg: "Ok / está ok"})
});
app.get("/clientes", (req, res, next) => {
	console.log("Retornou todos os clientes");
	res.json([{id: 1, nome: "Gustavo"}])
});

app.listen(process.env.PORT || 5000);
