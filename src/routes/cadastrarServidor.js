var express = require("express");
var router = express.Router();

var cadastroServidorController = require("../controllers/cadastroServidorController.js");

router.post("/cadastrar", function (req, res) {
    cadastroServidorController.cadastrarServidor(req, res);
});

router.get("/exibeLayout", function (req, res) {
    cadastroServidorController.exibeLayout(req, res);
});

router.get("/exibeLayout/:idEmpresa", function (req, res) {
    cadastroServidorController.exibeLayout(req, res);
});

router.get("/buscarServidor/", function (req, res) {
    cadastroServidorController.buscarServidor(req, res);
});

router.get("/buscarServidor/:idEmpresa", function (req, res) {
    cadastroServidorController.buscarServidor(req, res);
});

router.post("/editarServer", function (req, res) {
    cadastroServidorController.editarServer(req, res);
})
router.get('/allServidores/:idEmpresa', function(req,res) {
    cadastroServidorController.allServidores(req,res);
})
router.delete('/deletarServidor/:idEmpresa/:id_do_servidor', function(req,res) {
    cadastroServidorController.deletarServidor(req,res);
})

module.exports = router;