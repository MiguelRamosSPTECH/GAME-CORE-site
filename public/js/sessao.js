// sessão
function validarSessao() {

    // var nomeCargo = sessionStorage.NOME_CARGO
    // var quebraURL = window.location.href.split(`/`)
    // console.log(nomeCargo)
    // if(quebraURL[3] == "dashboard") {
    //     if(quebraURL[4] == "dash_adm" && nomeCargo != "Administrador Master") {
    //         limparSessao()
    //     } else if(quebraURL[4] == "dash_sre" && nomeCargo != "Engenheiro SRE"){
    //         limparSessao()
    //     } else if(quebraURL[4] == ("dash_sre" || "dash_adm") && nomeCargo == "GAMEOPS") { 
    //         limparSessao()
    //     } else if(nomeCargo == undefined) {
    //         limparSessao()
    //     }
    // }
}

function checarPermissoes(permissoesNecessarias) {

    var permissoesJSON = sessionStorage.getItem("PERMISSOES_USUARIO");

    if (!permissoesJSON) {

        alert("ACESSO NEGADO! Você não possui permissões cadastradas.");
        window.location.href = "index.html";
        return;

    }

    var permissoes = JSON.parse(permissoesJSON);

    for (var i = 0; i < permissoesNecessarias.length; i++) {

        if (permissoes.indexOf(permissoesNecessarias[i]) >= 0) {

            return;

        }
    }

    alert("ACESSO NEGADO! Você não possui permissão para acessar esta tela. Solicite tal permissão ao seu gestor.");
    window.location.href = "index.html";

}

function validarSessaoGameCore() {
    if (sessionStorage.EMAIL_GAMECORE == undefined) {
        sessionStorage.clear();
        window.location = "./login.html?AcessoNegado"
    } else {
        nome_login.innerHMTL = sessionStorage.NOME_GAMECORE
        email_login.innerHMTL = sessionStorage.EMAIL_GAMECORE
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../../../login.html";
}


//  function finalizarAguardar(texto) {
//      var divAguardar = document.getElementById("div_aguardar");
//     divAguardar.style.display = "none";

//     var divErrosLogin = document.getElementById("div_erros_login");
//     if (texto) {
//         divErrosLogin.style.display = "flex";
//         divErrosLogin.innerHTML = texto;
//     }
// }