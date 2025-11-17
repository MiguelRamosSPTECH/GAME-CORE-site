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

router.post("/buscarPermissoes", function(req, res) {
    cargoController.buscarPermissoes(req, res);
});
router.get("/allCargos/:idEmpresa", function(req,res) {
    cargoController.allCargos(req,res);
})
router.delete("/deletarCargo/:idEmpresa/:idCargo", function(req,res) {
    cargoController.deletarCargo(req,res);
})

module.exports = router;