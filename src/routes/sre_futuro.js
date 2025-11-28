var express = require("express");
var router = express.Router();

var sre_futuroController = require("../controllers/sre_futuroController");

router.post("/entrar", function (req, res) {
    sre_futuroController.entrar(req, res);
});

router.post("/buscar", function (req, res) {
    sre_futuroController.buscar(req, res);
});

module.exports = router;

