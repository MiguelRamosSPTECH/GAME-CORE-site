var express = require("express");
var router = express.Router();

var jiraController = require("./jiraIntegration.js");

router.get("/listar", function (req, res) {
    jiraController.listarChamadosEmAberto(req, res);
});



module.exports = router;