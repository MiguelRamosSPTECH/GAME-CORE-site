var express = require("express");
var router = express.Router();

var cargoController = require("../controllers/cargoController");

router.post("/criar", function(req, res){
    cargoController.criar(req, res);
});

router.get("/buscar", function(req, res){
    cargoController.buscar(req, res);
})

router.get('/buscar/:idEmpresa', function(req, res){
    cargoController.buscar(req, res);
})

router.get('/buscarFunc', function(req, res){
    cargoController.buscarFunc(req, res);
})

router.get('/buscarFunc/:idEmpresa', function(req, res){
    cargoController.buscarFunc(req, res);
})

router.post('/alterarCargo', function(req, res){
    cargoController.alterarCargo(req, res);
})

router.post('/removerFunc', function(req, res){
    cargoController.removerFunc(req, res);
})

router.post("/buscarPermissoes", function(req, res) {
    cargoController.buscarPermissoes(req, res);
});

module.exports = router;