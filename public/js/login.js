function entrar() {
    var emailVar = ipt_email.value;
    var senhaVar = ipt_senha.value;

    if (emailVar == "" || senhaVar == "") {
        msg_erro.innerHTML = `Preencha todos os campos!`
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

                    console.log("FK CARGO RECEBIDO NO LOGIN:", json.fk_cargo_func);
                    console.log("PERMISSOES:", sessionStorage.getItem("PERMISSOES_USUARIO"));

                    sessionStorage.ID_EMPRESA = json.idEmpresa; 
                    sessionStorage.CPF_USUARIO = json.cpf;
                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.NOME_USUARIO = json.nome;
                    sessionStorage.ID_USUARIO = json.id;
                    var fk_cargo_func = json.fk_cargo_func; 

                    //Chama a função para buscar as permissões antes de redirecionar
                    buscarEsalvarPermissoes(fk_cargo_func);


                    setTimeout(function () {
                        window.location = "../../dashboard/servidores/desc_servidor.html";
                        console.log("ENTROUUUU");

                    }, 1000);

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

function buscarEsalvarPermissoes(fk_cargo) {

    if (!fk_cargo) {

        sessionStorage.setItem('PERMISSOES_USUARIO', '[]');
        console.log("Usuário logado sem FK_CARGO. Assumindo permissões vazias.");
        
        setTimeout(() => {
            window.location = "index.html";
        }, 500);
        return;
    }

    fetch("/cargos/buscarPermissoes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({

            fkCargoServer: fk_cargo

        })
    }).then(function (resposta) {

        if (resposta.ok) {
            resposta.json().then(json => {
                
                sessionStorage.setItem('PERMISSOES_USUARIO', JSON.stringify(json.permissoes));

                console.log("Permissões salvas com sucesso:", json.permissoes);
                console.log("Permissões salvas com sucesso:", sessionStorage.getItem("PERMISSOES_USUARIO"));

                setTimeout(function () {
                    window.location = "index.html";
                }, 1000); 
            });

        } else {

            console.error("Erro ao buscar permissões do cargo:", resposta.statusText);
            sessionStorage.setItem('PERMISSOES_USUARIO', '[]');
            
            setTimeout(() => {
                window.location = "index.html";
            }, 500);
        }
        
    }).catch(function (erro) {

        console.error("Erro no fetch de permissões:", erro);

        sessionStorage.setItem('PERMISSOES_USUARIO', '[]'); // Falhou? Bloqueia, deixando as permissões "zeradas"
        
        setTimeout(() => {
            window.location = "index.html";
        }, 500);
    });
}
