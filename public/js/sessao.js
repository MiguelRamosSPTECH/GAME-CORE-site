// sessão
function validarSessao() {

    var nomeCargo = sessionStorage.NOME_CARGO
    var quebraURL = window.location.href.split(`/`)
    console.log(nomeCargo)
    if (quebraURL[3] == "dashboard") {
        if (quebraURL[4] == "dash_adm" && nomeCargo != "Administrador Master") {
            limparSessao()
        } else if (quebraURL[4] == "dash_sre" && nomeCargo != "Engenheiro SRE") {
            limparSessao()
        } else if (quebraURL[4] == ("dash_sre" || "dash_adm") && nomeCargo == "GAMEOPS") {
            limparSessao()
        } else if (nomeCargo == undefined) {
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

    Swal.fire({
        title: "Saindo",
        text: "Encerrando a sessão.",
        icon: "info",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
            popup: 'swal-2'
        }
    });

    setTimeout(() => {
        sessionStorage.clear();
        window.location = "../../../login.html";
    }, 2100)

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