// sessão
function validarSessao() {
    
    var nome = sessionStorage.NOME_USUARIO;
    var email = sessionStorage.EMAIL_USUARIO;
    var cpf = sessionStorage.CPF_USUARIO;

    var nome_usuario = document.getElementById("nome_usuario");
    var email_usuario = document.getElementById("email_usuario");
    var cpf_usuario = document.getElementById("cpf_usuario");

    if (nome != null && email != null) {

        if(nome_usuario) nome_usuario.innerHTML = nome;
        if(email_usuario) email_usuario.innerHTML = email;
        if(cpf_usuario) cpf_usuario.innerHTML = cpf;

    } else {
        window.location = "../login.html";
        alert("Realize um login para prosseguir!") //apenas para testar
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
    window.location = "../login.html";
}

// carregamento (loading)
function aguardar() {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "flex";
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