var cadastroEmpresaModel = require("../models/cadastroEmpresaModel");

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nomeEmpresarial = req.body.nomeEmpresarialServer
    var cnpj = req.body.cnpjServer
    var nomeRepresentante = req.body.nomeRepresentanteServer
    var email = req.body.emailServer


    // Faça as validações dos valores
    if (nomeEmpresarial == undefined) {
        res.status(400).send("O nome empresarial está indefinido!");
    } else if (cnpj == undefined) {
        res.status(400).send("Seu CNPJ está indefinido!");
    }  else if (nomeRepresentante == undefined) {
        res.status(400).send("O nome do representante está indefinido!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está indefinido!");
    }else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        cadastroEmpresaModel.cadastrar(nomeEmpresarial, cnpj, nomeRepresentante,  email)
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



module.exports = {
    cadastrar
}