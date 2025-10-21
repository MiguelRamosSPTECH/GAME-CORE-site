function cadastrarFunc() {

        aguardar();

        var nomeVar = ipt_nome.value;
        var emailVar = ipt_email.value;
        var cpfVar = ipt_cpf.value;
        var senhaVar = ipt_senha.value;

        var cargoVar = idCargo;
        var fk_empresaVar = sessionStorage.ID_EMPRESA;

        console.log("Cargo: ", cargoVar);

        // Verificando se há algum campo em branco
        if (
            // codigoVar == "" ||
            nomeVar == "" ||
            emailVar == "" ||
            cpfVar == "" || 
            senhaVar == "" //||
            //cargoVar == ""

        ) {
            cardErro.style.display = "block";
            mensagem_erro.innerHTML =
                "(Mensagem de erro para todos os campos em branco)";

            finalizarAguardar();
            return false;
        } else {
            setInterval(sumirMensagem, 5000);
        }


        fetch("/usuarios/cadastrarFunc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // crie um atributo que recebe o valor recuperado aqui
                // Agora vá para o arquivo routes/usuario.js

                // codigoServer: codigoVar,
                nomeServer: nomeVar,
                emailServer: emailVar,
                cpfServer: cpfVar,
                senhaServer: senhaVar,
                cargoServer: cargoVar,
                fkEmpresaServer: fk_empresaVar

            }),
        })
            .then(function (resposta) {
                console.log("resposta: ", resposta);

                if (resposta.ok) {
                    cardErro.style.display = "block";

                    
                    //Aqui muda os sessionStorages
                    sessionStorage.ID_USUARIO = json.id;
                    sessionStorage.NOME_USUARIO = json.nome;
                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.CPF_USUARIO = json.cpf;
                    sessionStorage.ID_CARGO = json.fk_cargo;
                    sessionStorage.ID_EMPRESA = json.fk_empresa;

                    mensagem_erro.innerHTML =
                        "Cadastro realizado com sucesso!";

                    setTimeout(() => {
                        // window.location = "login.html";
                    }, "2000");

                    // limparFormulario();
                    finalizarAguardar();
                } else {
                    throw "Houve um erro ao tentar realizar o cadastro!";
                }
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
                finalizarAguardar();
            });

        return false;
    }

    function sumirMensagem() {
        cardErro.style.display = "none";
    }