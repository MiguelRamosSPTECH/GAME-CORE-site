var express = require("express");
var router = express.Router();


router.get("/verificarStatus/:idEmpresa", function (req, res) {
    aceitarEmpresasController.verificarStatus(req, res);
});

module.exports = router;