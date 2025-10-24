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

function buscarCompleto(req, res) {
    const idEmpresa = req.params.idEmpresa;

    layoutsModel.buscarCompleto(idEmpresa)
        .then(result => res.status(201).json(result))
        .catch(erro => {
            console.log(erro)
            res.status(500).json(erro.sqlMessage);
        })
        ;
}

function usarLayout(req, res) {
    var idLayout = req.body.idLayoutServer;
    var idEmpresa = req.body.idEmpresaServer;

    if (idLayout == undefined) {
        res.status(400).send("O idlayout está indefinido!");
    } else if (idEmpresa == undefined) {
        res.status(400).send("Seu idempresa está indefinido!");
    } else {
        layoutsModel.usarLayout(idLayout, idEmpresa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            )
            .catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    buscar,
    buscarCompleto,
    usarLayout
};
