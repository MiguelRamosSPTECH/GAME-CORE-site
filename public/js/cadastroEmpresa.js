function cadastrar() {
    var nomeEmpresarialVar = ipt_nome_empresarial.value;
    var cnpjVar = ipt_cnpj.value;
    var nomeRepresentanteVar = ipt_nome_representante.value;
    var emailVar = ipt_email.value;

    if (
        nomeEmpresarialVar == "" ||
        cnpjVar == "" ||
        nomeRepresentanteVar == "" ||
        emailVar == ""
    ) {
        // ERRO
        msg_erro.innerHTML = "Preencha todos os campos!"
    } else if (nomeEmpresarialVar.length < 10) {
        msg_erro.innerHTML = `Insira um nome empresarial válido! Nome muito pequeno.`
    } else if (cnpjVar.length != 14){
        msg_erro.innerHTML = `Insira um CNPJ válido!`
    } else if (nomeRepresentanteVar.length < 3) {
        msg_erro.innerHTML = `Insira um nome de representante válido! Nome muito pequeno.`
    } else if (emailVar.length < 5) {
        msg_erro.innerHTML = `Preencha um email válido! Email muito pequeno.`
    } else if (!emailVar.includes("@") || !emailVar.includes(".")) {
        msg_erro.innerHTML = `Insira um e-mail válido! Precisa tera "@" e "."`
    }
    else {
        console.log("CADASTRO OK")
        fetch("/cadastroEmpresa/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeEmpresarialServer: nomeEmpresarialVar,
                nomeRepresentanteServer: nomeRepresentanteVar,
                emailServer: emailVar,
                cnpjServer: cnpjVar

            })
        })
            .then(function (resposta) {
                console.log("resposta: ", resposta);

                if (resposta.ok) {
                    resposta.json().then(json => {

            
                        const idEmpresaGerado = json.id || json.insertId;

                        if (idEmpresaGerado) {
                            sessionStorage.ID_EMPRESA = idEmpresaGerado;
                            console.log("Cadastro de empresa realizado com sucesso. ID:", idEmpresaGerado);
                            window.location.href = "telaDeEspera.html";

                        } else {
                            throw "ID da empresa não retornado pelo servidor. Cadastro falhou.";
                        }
                    });
                } else {
                    throw "Houve um erro ao tentar realizar o cadastro!";
                }
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });

        return false;

    }

            //Autenticando
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
            console.log("ESTOU NO THEN DO entrar()!")

            resposta.json().then(json => {
                console.log("Resposta recebida do login:", json);

                if (json && json.id) {
                    const usuario = json[0];

                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.NOME_USUARIO = json.nome;
                    sessionStorage.RELIGIAO_USUARIO = json.religiao;
                    sessionStorage.ID_USUARIO = json.id;

                    setTimeout(() => {
                        window.location = "./index.html";
                    }, 1000);
                } else {
                    finalizarAguardar("Usuário ou senha inválidos.");
                    console.warn("Login falhou: estrutura inesperada da resposta.", json);
                }
            });

        }).catch(function (erro) {
            console.log(erro);
        })

        return false;
            
}