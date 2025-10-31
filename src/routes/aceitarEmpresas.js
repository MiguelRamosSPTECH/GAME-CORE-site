var express = require("express");
var router = express.Router();

var aceitarEmpresasController = require("../controllers/aceitarEmpresasController");


router.post("/buscarCards", function (req, res) {
    aceitarEmpresasController.buscar_cards(req, res);
});

router.put("/editar", function (req, res) {
    aceitarEmpresasController.editar(req, res);
});


router.post("/buscarCargos", function (req, res) {
    aceitarEmpresasController.buscar_Cargos(req, res);
});

router.put("/criar_perfil", function (req, res) {
    aceitarEmpresasController.criar_perfil(req, res);
});

router.put("/atualizar_perfil", function (req, res) {
    aceitarEmpresasController.atualizar_perfil(req, res);
});



module.exports = router;