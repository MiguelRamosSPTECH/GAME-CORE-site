// sessão
function validarSessao() {

    var nomeCargo = sessionStorage.NOME_CARGO
    var quebraURL = window.location.href.split(`/`)
    console.log(quebraURL)
    if(quebraURL[3] == "dashboard") {
        if(quebraURL[4] == "dash_adm" && nomeCargo != "Administrador Master") {
            limparSessao()
        } else if(quebraURL[4] == "dash_sre" && nomeCargo != "Engenheiro SRE"){
            limparSessao()
        } else if(nomeCargo != "GAMEOPS" && quebraURL[4] != ("dash_adm" || "dash_sre")) {
            limparSessao()
        }
    }
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