var layoutsModel = require("../models/layoutsModel");

function buscar(req, res) {
    const idEmpresa = req.params.idEmpresa;

    layoutsModel.buscar(idEmpresa)
        .then(result => res.json(result))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });

    // .then(function(resultado){
    //     res.json(resultado);
    // })
    // .catch(function(erro){
    //     console.log("\nErro ao buscar layouts: ", erro.sqlMessage);
    //     res.status(500).json(erro.sqlMessage);
    // });
}

module.exports = {
    buscar
};
