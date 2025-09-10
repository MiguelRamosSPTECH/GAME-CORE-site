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

module.exports = router;