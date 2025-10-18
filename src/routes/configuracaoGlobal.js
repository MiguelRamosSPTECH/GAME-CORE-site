var express = require("express");
var router = express.Router();

var configuracaoGlobalController = require("../controllers/configuracaoGlobalController.js");

router.get("/listar", function (req, res) {
    configuracaoGlobalController.listar(req, res);
});

router.put("/atualizar/:id", function(req,res){
    configuracaoGlobalController.atualizar(req,res);
});


module.exports = router;