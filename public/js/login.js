function entrar() {
    var emailVar = ipt_email.value;
    var senhaVar = ipt_senha.value;

    if (emailVar == "" || senhaVar == "") {
        msg_erro.innerHTML = `Preencha todos os campos!`
    } if (emailVar == "gamecore.adm@gmail.com" && senhaVar == "gamecoreacess1234") {
        sessionStorage.NOME_GAMECORE = `Perfil Administrativo`
        sessionStorage.EMAIL_GAMECORE = emailVar
        sessionStorage.SENHA_GAMECORE = senhaVar
        setTimeout(function () {
                        window.location = "aceitarEmpresas.html";
                        console.log("tamo dentro!");

                    }, 1000); 

    } else {

        console.log("FORM LOGIN: ", emailVar);
        console.log("FORM SENHA: ", senhaVar);

        fetch("/usuarios/autenticar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailServer: emailVar,
                senhaServer: senhaVar
            })
        }).then(function (resposta) {
            if (resposta.ok) {
                console.log(resposta);

                resposta.json().then(json => {
                    console.log(json);
                    console.log(JSON.stringify(json));

                    sessionStorage.ID_EMPRESA = json.idEmpresa; 
                    sessionStorage.CPF_USUARIO = json.cpf;
                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.NOME_USUARIO = json.nome;
                    sessionStorage.ID_USUARIO = json.id;
                    sessionStorage.NOME_CARGO = json.nomeCargo;



                    setTimeout(function () {
                        if(sessionStorage.NOME_CARGO == "Administrador Master") {
                             window.location = "../dashboard/dash_adm/funcionarios/index.html";
                        } else if(sessionStorage.NOME_CARGO == "GAMEOPS") {
                            window.location = "../dashboard/index.html"
                        } else if(sessionStorage.NOME_CARGO == "Engenheiro SRE") {
                            window.location = "../dashboard/dash_sre"
                        }
                        

                    }, 500); // apenas para exibir o loading

                });

            } else {
                resposta.text().then(texto => {
                    msg_erro.innerHTML = texto
                });
            }

        }).catch(function (erro) {
            console.log(erro);
        })
    }
}
