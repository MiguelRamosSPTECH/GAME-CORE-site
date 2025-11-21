var layoutsModel = require("../models/layoutsModel");

function buscar(req, res) {
    const idEmpresa = req.params.idEmpresa;

    layoutsModel.buscar(idEmpresa)
        .then(result => res.json(result))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });

}

function buscarCompleto(req,res) {
    const idEmpresa = req.params.idEmpresa;

    layoutsModel.buscarCompleto(idEmpresa)
    .then(result => res.status(201).json(result))
    .catch(erro => {
        console.log(erro)
        res.status(500).json(erro.sqlMessage);
    })
    ;
}

function usarLayout(req,res) {
    const {idLayout, idEmpresa } = req.params;
    layoutsModel.usarLayout(idLayout, idEmpresa)
    .then(result => res.status(201).json(result))
    .catch(erro => {
        console.log(erro)
        res.status(500).json(erro.sqlMessage);
    })
    ;
}

function buscarLayoutConfiguracao(req, res) {
    const idEmpresa = req.params.idEmpresa;

    layoutsModel.buscarLayoutConfiguracao(idEmpresa)
        .then(result => res.json(result))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}


module.exports = {
    buscar,
    buscarCompleto,
    usarLayout,
    buscarLayoutConfiguracao
};
