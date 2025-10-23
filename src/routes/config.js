var express = require("express");
var router = express.Router();

var configController = require("../controllers/configController.js");

router.post("/criarLayout", function (req, res) {
    configController.criarLayout(req,res);
});

module.exports = router;