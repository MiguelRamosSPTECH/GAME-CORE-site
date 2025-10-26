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

module.exports = router;