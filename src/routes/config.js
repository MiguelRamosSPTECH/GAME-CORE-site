var express = require("express");
var router = express.Router();

var configController = require("../controllers/configController.js");

router.post("/criarLayout", function (req, res) {
    configController.criarLayout(req, res);
});

router.get("/listarLayout/:idLayout/:idEmpresa", (req, res) => {
    console.log("controler listarlayout")
    configController.listarLayout(req, res);
})

router.put("/editarLayout/:idLayout", function (req, res) {
    configController.editarLayout(req, res);
});

router.delete("/deletarLayout/:idEmpresa/:idLayout", function (req, res){
    configController.deletarLayout(req,res);
})

module.exports = router;