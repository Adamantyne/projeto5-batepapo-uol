let contadorMensagens = 0, ultimaMensagem;
const mainFocada = document.querySelector("main");

//perguntando nome do usuário
let nomeUsuario = prompt("qual é o seu nome ?");
let objetoNome ={
    name: nomeUsuario
}
console.log(objetoNome);

//Enviando requisição de usuário
function enviarRequisicao(){
    const requisicao = axios.post(
        "https://mock-api.driven.com.br/api/v4/uol/participants ",objetoNome
        )
    requisicao.then(requisicaoEnvio);
    requisicao.catch(erroRequisicao);
} 
function requisicaoEnvio(resultado){
    console.log(resultado);
    setInterval(reenviarRequisicao,5000);
}

//Reenviando requisição de usuário
function reenviarRequisicao(){
    const requisicao = axios.post(
        "https://mock-api.driven.com.br/api/v4/uol/status",objetoNome
        )
    requisicao.then(requisicaoReenvio);
    requisicao.catch(erroRequisicao);
}
function requisicaoReenvio(resultado){
    console.log(resultado);
}

//Construindo e enviando a mensagem para o servidor 
function enviandoMensagem(){
    const textoMensagem = document.querySelector(".escrevaAqui").value;
    const destinatario = "todos";
    const objetoMensagem ={
        from: nomeUsuario,
        to:destinatario,
        text:textoMensagem,
        type: "message"
    }
    if(textoMensagem!==""){
        const requisicao =axios.post(
            "https://mock-api.driven.com.br/api/v4/uol/messages",objetoMensagem
            );
        requisicao.then(requisicaoMensagem);
        requisicao.catch(erroRequisicao);
        limparCampo();
    }
}
function requisicaoMensagem(resultado){
    console.log(resultado);
}
function limparCampo(){
    let campoDaMensagem = document.querySelector(".escrevaAqui");
    campoDaMensagem.value="";
}

//Conferindo erros no envio das requisições
function erroRequisicao(erro){
    console.log(erro.response);
    numeroDoErro = parseInt(erro.response.value);
    alert("erro");
    while(numeroDoErro===400){
        nomeUsuario = prompt("este nome já está em uso... tente outro nome!");
    }
}

//Verificando mensagens a serem exibidas
function verificandoMensagens(){
    let resposta=axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    resposta.then(prepararMensagens);
}
//Preparando mensagens a serem exibidas
function prepararMensagens(resultado){
    let mensagens = resultado.data;
    console.log(mensagens)
    renderizarMensagens(mensagens);
}
//Renderizando mensagens
function renderizarMensagens(mensagens){
    let quadroBranco = document.querySelector(".quadroBranco");
    for(let i=contadorMensagens; i<mensagens.length; i++){
        const de = mensagens[i].from;
        const para = mensagens[i].to;
        const hora = mensagens[i].time;
        const texto = mensagens[i].text;
        const tipo = mensagens[i].type;
        const mensagem = `
        <section class="mensagem ${i} ${tipo}">
        <p>
            <small>(${hora}) </small><strong> ${de} </strong>para<strong> ${para} </strong>: ${texto}
        </p>
        </section>
        `;
        if(ultimaMensagem !==mensagem){
            ultimaMensagem=mensagem;
            quadroBranco.innerHTML+=mensagem;
            mainFocada.scrollIntoView(false);
        }
        contadorMensagens = i;   
    }

}


//acionando menu lateral
function mostrarBarraLateral(){
    let barraLateral = document.querySelector("aside");
    barraLateral.classList.remove("escondido");
}




enviarRequisicao();
verificandoMensagens();
setInterval(verificandoMensagens, 3000);