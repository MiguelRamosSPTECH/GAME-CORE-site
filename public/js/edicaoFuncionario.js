var idEmpresa = sessionStorage.ID_EMPRESA;
var listaFuncionarios = [];


async function buscarFunc() {

    await fetch(`/cargos/buscarFunc/${idEmpresa}`, { cache: 'no-store' })
        .then(response => response.json())
        .then(resposta => {
            console.log("Dado recebido: ", resposta);

            var select = document.getElementById("funcionario");
            select.innerHTML = '<option value="">Selecionar</option>';

            resposta.forEach(funcionario => {
                select.innerHTML += `<option value="${funcionario.id}">${funcionario.nome}</option>`;

                return funcionario

            });

            listaFuncionarios = resposta

            console.log("Options do select:", select.innerHTML);

        })
        .catch(erro => console.error("Erro:", erro));

}



async function receberCampos() {

    var inputs = document.querySelectorAll('#funcionario')

    console.log(inputs)

    for (let i = 0; i < inputs.length; i++) {

        inputs[i].addEventListener('change', () => {

            let idSelect = inputs[i].value

            var idFunc = listaFuncionarios.find(func => func.id == idSelect)
            sessionStorage.ID_USUARIO_MODIFICADO = idFunc.id;

            var nomeFuncionario = document.getElementById("ipt_nome");
            var funcName = listaFuncionarios.find(func => func.id == idSelect)
            nomeFuncionario.value = funcName.nome;

            var emailFuncionario = document.getElementById("ipt_email");
            var funcEmail = listaFuncionarios.find(func => func.id == idSelect)
            emailFuncionario.value = funcEmail.email;

            var cpfFuncionario = document.getElementById("ipt_cpf");
            var funcCpf = listaFuncionarios.find(func => func.id == idSelect)
            cpfFuncionario.value = funcCpf.cpf;

            var senhaFuncionario = document.getElementById("ipt_senha");
            var funcSenha = listaFuncionarios.find(func => func.id == idSelect)
            senhaFuncionario.value = funcSenha.senha;

        })

    }

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



function editarFunc() {

    var nomeFuncionario = ipt_nome.value;
    var emailFuncionario = ipt_email.value;
    var cpfFuncionario = ipt_cpf.value;
    var senhaFuncionrio = ipt_senha.value;
    var id_do_Cargo = idCargo;
    var id_do_funcionario = sessionStorage.ID_USUARIO_MODIFICADO;


    console.log("Funcionário: ", nomeFuncionario);
    console.log("Cargo: ", id_do_Cargo)


    fetch("/usuarios/editarFunc", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({

            nomeFuncServer: nomeFuncionario,
            idCargoServer: id_do_Cargo,
            emailFuncServer : emailFuncionario,
            cpfFuncServer : cpfFuncionario,
            senhaFuncServer: senhaFuncionrio,
            idFunc : id_do_funcionario

        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                cardErro.style.display = "block";

                mensagem_erro.innerHTML =
                    "Alteração realizada com sucesso!";

                console.log("Cargo alterado com sucesso!")

                alert("Cargo Alterado com sucesso!")

                //setTimeout(() => {
                //     window.location = "login.html";
                //}, "2000");

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



//var permissoesNecessarias = [4];
//
//function iniciarPagina() {
//
//    validarSessao();
//
//    setTimeout(function () {
//        checarPermissoes(permissoesNecessarias);
//    }, 200);
//
//}

