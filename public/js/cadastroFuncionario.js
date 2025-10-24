function showInfoInput(input) {
    var divRastrear = document.getElementById('rastrear')
    var valorAtualRastrear = document.getElementById('value_atual')
    var tituloInput = document.getElementById('title-campo')
    var descInput = document.getElementById('descricao-campo')
    var input_prefixo = (input.id).split("_")
    var valorInput = input.value
    var descricaoCampos = {
        "nome": "Complete este campo com o nome do seu funcionário! Lembre-se de colocar o nome completo para melhor identificação!",
        "email":"Complete este campo com o email do seu funcionário! Nesta parte você pode colocar um email de sua preferência, pois será por este email que ele se logará na dashboard! Sem necessidade de ser o email real.",
        "senha":"Complete este campo com a senha de acesso do seu funcionário para acessar a dashboard! Escolha uma senha forte, com pelo menos uma letra maíscula e um símbolo, tendo no mínimo 8 caracteres!",
        "cpf":"Complete este campo com o CPF do seu funcionário, preste MUITA ATENÇÃO, pois deve ser de fato o cpf real do seu funcionário.",
        "cargo":"Aqui, você pode escolher um cargo para seu funcionário! Para editar as permissões do cargo você deve ir na aba de cargos no canto lateral da dash, onde temos a barra lateral!"
    }
    // divRastrear.style.display = "flex"
    tituloInput.innerText = `${input_prefixo[1].toUpperCase()} DO FUNCIONARIO`
    descInput.innerHTML = descricaoCampos[`${input_prefixo[1]}`]
    valorAtualRastrear.innerText = valorInput
}

function cadastrarFunc() {

        //aguardar();

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
            //cardErro.style.display = "block";
            mensagem_erro.innerHTML =
                "(Mensagem de erro para todos os campos em branco)";

            finalizarAguardar();
            return false;
        }// else {
         //   setInterval(sumirMensagem, 5000);
        //}


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
                    //cardErro.style.display = "block";

                    
                    //Aqui muda os sessionStorages
                    sessionStorage.ID_USUARIO = json.id;
                    sessionStorage.NOME_USUARIO = json.nome;
                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.CPF_USUARIO = json.cpf;
                    sessionStorage.ID_CARGO = json.fk_cargo;
                    sessionStorage.ID_EMPRESA = json.fk_empresa;
                    
                    if (json.permissoes) {
                        sessionStorage.setItem('PERMISSOES_USUARIO', JSON.stringify(json.permissoes));
                    }

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
            });

        return false;
}

var permissoesNecessarias = [3];

function iniciarPagina() {

      validarSessao();

      setTimeout(function() {
          checarPermissoes(permissoesNecessarias);
      }, 200);

}
