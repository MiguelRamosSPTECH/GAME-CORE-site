var cargoModel = require("../models/cargoModel");

function criar(req, res){
    var nome = req.body.cargoServer;
    var permissoes = req.body.permissoesServer;
    var fk_empresa_cargo = req.body.fk_empresaServer;

    console.log(permissoes)

    cargoModel.criar(nome, permissoes, fk_empresa_cargo)
        .then(
            function(resultado){
                console.log("BBBBBBBBBBBBBBBBBBBBBB"+permissoes)
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
    var fk_empresa_cargo = req.params.idEmpresa;

    cargoModel.buscar(fk_empresa_cargo)
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