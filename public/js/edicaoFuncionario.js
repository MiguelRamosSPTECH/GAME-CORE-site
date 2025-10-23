var idEmpresa = sessionStorage.ID_EMPRESA;


async function buscarFunc() {

    fetch(`/cargos/buscarFunc/${idEmpresa}`, { cache: 'no-store' })
        .then(response => response.json())
        .then(resposta => {
            console.log("Dado recebido: ", resposta);

            var select = document.getElementById("funcionario");
            select.innerHTML = '<option value="">Selecionar</option>';

            resposta.forEach(funcionario => {
            select.innerHTML += `<option value="${funcionario.id}">${funcionario.nome}</option>`;
            
            return nomeFunc = funcionario.nome
        });
        console.log("Options do select:", select.innerHTML);

        console.log("Nome do Funcionário: " + nomeFunc)

        })
        .catch(erro => console.error("Erro:", erro));

}

async function buscarCargos() {

    fetch(`/cargos/buscar/${idEmpresa}`, { cache: 'no-store' })
        .then(response => response.json())
        .then(resposta => {
            console.log("Dado recebido: ", resposta);

            var select = document.getElementById("ipt_cargo");
            select.innerHTML = '<option value="">Selecionar</option>';

            resposta.forEach(cargo => {
            select.innerHTML += `<option value="${cargo.id}">${cargo.nome}</option>`;
            return idCargo = cargo.id
        });
        console.log("Options do select:", select.innerHTML);

        console.log("ID do cargo" + idCargo)

        })
        .catch(erro => console.error("Erro:", erro));

}



function removerFunc(){

        var nomeFuncionario = nomeFunc;

        console.log("Funcionário: ", nomeFuncionario);

        fetch("/cargos/removerFunc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // crie um atributo que recebe o valor recuperado aqui
                // Agora vá para o arquivo routes/usuario.js

                // codigoServer: codigoVar,
                nomeFuncServer: nomeFuncionario,

            }),
        })
            .then(function (resposta) {
                console.log("resposta: ", resposta);

                if (resposta.ok) {
                    cardErro.style.display = "block";

                    mensagem_erro.innerHTML =
                        "Alteração realizada com sucesso!";

                    console.log("Cargo alterado com sucesso!")

                    setTimeout(() => {
                        // window.location = "login.html";
                    }, "2000");

                    // limparFormulario();
                    finalizarAguardar();
                } else {
                    throw "Houve um erro ao tentar realizar a alteração!";
                }
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
                finalizarAguardar();
            });

        return false;
    }


    function alterarCargo(){

        var nomeFuncionario = ipt_nome.value;
        var emailFuncionario = ipt_email.value;
        var cpfFuncionario = ipt_cpf.value;
        var senhaFuncionrio = ipt_senha.value;
        var id_do_Cargo = idCargo;
        var idEmpresa = sessionStorage.ID_EMPRESA;


        console.log("Funcionário: ", nomeFuncionario);
        console.log("Cargo: ", id_do_Cargo)


        fetch("/cargos/alterarCargo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // crie um atributo que recebe o valor recuperado aqui
                // Agora vá para o arquivo routes/usuario.js

                // codigoServer: codigoVar,
                nomeFuncServer: nomeFuncionario,
                idCargoServer: id_do_Cargo

            }),
        })
            .then(function (resposta) {
                console.log("resposta: ", resposta);

                if (resposta.ok) {
                    cardErro.style.display = "block";

                    mensagem_erro.innerHTML =
                        "Alteração realizada com sucesso!";

                    console.log("Cargo alterado com sucesso!")

                    setTimeout(() => {
                        // window.location = "login.html";
                    }, "2000");

                    // limparFormulario();
                    finalizarAguardar();
                } else {
                    throw "Houve um erro ao tentar realizar a alteração!";
                }
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
                finalizarAguardar();
            });

        return false;
    }

