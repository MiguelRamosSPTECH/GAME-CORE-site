var cargoModel = require("../models/cargoModel");

function criar(req, res){
    var nome = req.body.cargoServer;
    var permissoes = req.body.permissoesSelecionadas;
    var fk_empresa = req.body.fk_empresaServer;

    cargoModel.criar(nome, permissoes, fk_empresa)
        .then(
            function(resultado){
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao criar o cargo! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
        );
}

function buscar(req, res){
    var fk_empresa = req.params.idEmpresa;

    cargoModel.buscar(fk_empresa)
        .then(
            function(resultado){
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao criar o cargo! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
        );
}

module.exports = {
    criar,
    buscar
}