var idEmpresa = sessionStorage.ID_EMPRESA;
var listaFuncionarios = [];


function buscarFunc() {
    let idFunc = new URLSearchParams(window.location.search).get("idFunc");
    
    fetch(`/usuarios/findByIdFunc/${idEmpresa}/${idFunc}`,{
        method: "GET",
    })
    .then(async resposta => {
        if(resposta.ok) {
            let funcionarioDados =  await resposta.json();
            console.log(funcionarioDados)
            ipt_nome.value = funcionarioDados[0].nome
            ipt_email.value = funcionarioDados[0].email
            ipt_cpf.value = funcionarioDados[0].cpf
            ipt_senha.value = funcionarioDados[0].senha
            ipt_cargo.value = funcionarioDados[0].idCargo
        }
    })


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
    let id_do_funcionario = new URLSearchParams(window.location.search).get("idFunc");
    var nomeFuncionario = ipt_nome.value;
    var emailFuncionario = ipt_email.value;
    var cpfFuncionario = ipt_cpf.value;
    var senhaFuncionrio = ipt_senha.value;
    var id_do_Cargo = ipt_cargo.value;


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
                window.location.href="index.html"
            } else {
                throw "Houve um erro ao tentar realizar a alteração!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
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

