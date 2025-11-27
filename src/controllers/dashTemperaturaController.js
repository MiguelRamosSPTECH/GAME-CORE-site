var dashTemperaturaModel = require("../models/dashTemperaturaModel");

function buscarParametros(req, res) {
    const idEmpresa = req.params.idEmpresa;

    dashTemperaturaModel.buscarParametros(idEmpresa)
        .then(result => res.json(result))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    buscarParametros
};