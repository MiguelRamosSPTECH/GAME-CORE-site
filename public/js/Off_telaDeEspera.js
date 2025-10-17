const ID_EMPRESA = sessionStorage.ID_EMPRESA;
let intervaloChecagem; 

function iniciarVerificacao() {
    if (!ID_EMPRESA) {
        
        alert("Sua sessão expirou ou não houve cadastro.");
        window.location.href = "cadastroEmpresa.html";
        return;
    }

    
    verificarStatus();
    intervaloChecagem = setInterval(verificarStatus, 5000);
}



function verificarStatus() {
    fetch("/aceitarEmpresas/verificarStatus/" + ID_EMPRESA, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(json => {
                const status = json.statusAcesso;
                lidarComStatus(status);
            });
        } else {
            console.error("Erro ao verificar status da empresa.");
        }
    }).catch(function (erro) {
        console.log("Erro no fetch: " + erro);
    });
}

function lidarComStatus(status) {
    const msg = document.getElementById('mensagemStatus');
    const loading = document.getElementById('loading');


    if (status == '1') {
        msg.innerHTML = "Sua requisição está sob análise. Por favor, aguarde...";
    } else {
        clearInterval(intervaloChecagem);
        loading.style.display = 'none';

        if (status == '3') {
            msg.innerHTML = "Requisição aprovada!Redirecionando para o cadastro de funcionário...";
            setTimeout(() => {
                window.location.href = "cadastroFuncionario.html";
            }, 2000);

        } else if (status == '2') {
            msg.innerHTML = "Requisição negada! Entre em contato com o suporte.";

        }
    }
}