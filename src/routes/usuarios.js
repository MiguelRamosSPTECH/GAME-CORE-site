var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");


router.post("/cadastrarFunc", function (req, res) {
    usuarioController.cadastrarFunc(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/editarFunc", function (req, res) {
    usuarioController.editarFunc(req, res);
})

router.get(`/allFunc/:idEmpresa`, function(req,res) {
    usuarioController.allFunc(req,res);
})

router.get(`/findByIdFunc/:idEmpresa/:idFunc`, function(req,res) {
    usuarioController.findByIdFunc(req,res);
})

router.delete(`/deletarFunc/:idEmpresa/:idFunc`, function(req,res) {
    usuarioController.deletarFunc(req,res);
})

module.exports = router;