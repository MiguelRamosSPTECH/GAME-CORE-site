var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;


    if (email == undefined) {
        res.status(400).send("Seu email está indefinido!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinido!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String


                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);


                        res.json({
                            id: resultadoAutenticar[0].id,
                            nome: resultadoAutenticar[0].nome,
                            cpf: resultadoAutenticar[0].cpf,
                            email: resultadoAutenticar[0].email,
                            senha: resultadoAutenticar[0].senha,
                            idEmpresa: resultadoAutenticar[0].idEmpresa,
                            fk_cargo_func: resultadoAutenticar[0].fk_cargo_func

                        });

                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrarFunc(req, res) {

    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var cpf = req.body.cpfServer;
    var senha = req.body.senhaServer;
    var fk_cargo = req.body.cargoServer;
 

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (cpf == undefined) {
        res.status(400).send("Sua CPF está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {


        usuarioModel.cadastrarFunc(nome, email, cpf, senha, fk_cargo)
            .then(
                function (resultado) {
                    res.json(resultado);
                    
                }
            ).catch(
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



function editarFunc(req, res){

    var funcionario = req.body.nomeFuncServer
    var cargo = req.body.idCargoServer
    var id_do_func = req.body.idFunc
    var email = req.body.emailFuncServer
    var cpf = req.body.cpfFuncServer
    var senha = req.body.senhaFuncServer

    usuarioModel.editarFunc(funcionario, email, cpf, senha, cargo, id_do_func)
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
    autenticar,
    cadastrarFunc,
    editarFunc
}