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
        alert("Realize um login para prosseguir!")
    }
}



function limparSessao() {

    sessionStorage.clear();
    window.location = "../login.html";

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