var cargoModel = require("../models/cargoModel");

function criar(req, res){
    var nome = req.body.cargoServer;
    var permissoes = req.body.permissoesServer;
    var fk_empresa_cargo = req.body.fk_empresaServer;

    console.log(permissoes)

    cargoModel.criar(nome, permissoes, fk_empresa_cargo)
        .then(
            function(resultado){
                console.log("Permissões Escolhidas: "+permissoes)
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
                        "\nHouve um erro ao buscar o cargo! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
        );
}


function buscarFunc(req, res){
    var fk_empresa_func = req.params.idEmpresa;

    cargoModel.buscarFunc(fk_empresa_func)
        .then(
            function(resultado){
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao buscar o funcionário! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
        );
}

function alterarCargo(req, res){

    var funcionario = req.body.nomeFuncServer
    var cargo = req.body.idCargoServer

    cargoModel.alterarCargo(funcionario, cargo)
        .then(
        function(resultado){
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao alterar o cargo! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
        );

}


function removerFunc(req, res){

    var funcionario = req.body.nomeFuncServer

    cargoModel.removerFunc(funcionario)
        .then(
        function(resultado){
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao alterar o cargo! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
        );

}

module.exports = {
    criar,
    buscar,
    buscarFunc,
    alterarCargo,
    removerFunc
}