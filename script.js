let contadorMensagens = 0, ultimaMensagem,nomeUsuario,objetoNome, participante="";
const mainFocada = document.querySelector("main");


//entrando no site
function entrarNoSite(botao){
    const nomeDigitado =document.querySelector(".inputEntrar").value;
    if(nomeDigitado!==""){
        nomeUsuario= nomeDigitado;
        objetoNome ={
        name: nomeUsuario
        }
        const site = document.querySelector(".estrutura");
        site.classList.remove("escondido");
        botao.parentNode.classList.add("escondido");
        enviarRequisicao();
        verificandoMensagens();
        setInterval(verificandoMensagens, 3000);
        buscarParticipantes();
        setInterval(buscarParticipantes(), 10000);
    }
}

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
    window.location.reload();
}

//Verificando mensagens a serem exibidas
function verificandoMensagens(){
    let resposta=axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    resposta.then(prepararMensagens);
}
//Preparando mensagens a serem exibidas
function prepararMensagens(resultado){
    let mensagens = resultado.data;
    renderizarMensagens(mensagens);
}
//Renderizando mensagens
function renderizarMensagens(mensagens){
    let quadroBranco = document.querySelector(".quadroBranco");
    for(let i=contadorMensagens; i<mensagens.length; i++){
        const mensagem = `
        <section class="mensagem ${i} ${mensagens[i].type}">
        <p>
            <small>(${mensagens[i].time}) </small><strong> ${mensagens[i].from} </strong>para<strong> ${mensagens[i].to} </strong>: ${mensagens[i].text}
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


//acionando marra lateral
function mostrarBarraLateral(){
    let aside = document.querySelector("aside");
    aside.classList.remove("escondido");
    let barraLateral = aside.querySelector(".barraLateral");
    barraLateral.classList.add("animacaoDeslocar");
    barraLateral.classList.remove("animacaoDeslocarInverso");
    setTimeout(function(){barraLateral.classList.remove("animacaoDeslocar")},300);
}
//Minimizando barra lateral
function minimizarBarraLateral(){
    let aside = document.querySelector("aside");
    let barraLateral = aside.querySelector(".barraLateral");
    barraLateral.classList.add("animacaoDeslocarInverso");
    setTimeout(function(){aside.classList.add("escondido")},250);
    setTimeout(function(){barraLateral.classList.remove("animacaoDeslocarInverso")},300);
}
//Buscando participantes
function buscarParticipantes(){
    const participantes = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    participantes.then(renderizarParticipantes);
}
//Renderizando participantes
function renderizarParticipantes(resultado){
    
    let contatos = document.querySelector(".contatos");
    const nomeParticipantes=resultado.data;
    
    for(let i=0; i<nomeParticipantes.length; i++){
        participante += `
        <div class="contato" onclick="selecionarContato(this)">
               <div><ion-icon name="person-circle"></ion-icon></div>
               <p>${nomeParticipantes[i].name}</p>
               <ion-icon name="checkmark" class="iconeSelecionar"></ion-icon>
        </div>
        `;
        contatos.innerHTML=`
            <div class="contato selecionado" onclick="selecionarContato(this)">
                    <ion-icon name="people"></ion-icon>
                    <p>Todos</p>
                    <ion-icon name="checkmark" class="iconeSelecionar"></ion-icon>
            </div>
        ` +participante;
    }
}
//Selecionar contato
function selecionarContato(contatoMarcar){
    let todosOsContatos = document.querySelector(".contatos");
    let contatoDesmarcar = todosOsContatos.querySelector(".selecionado");
    if(contatoDesmarcar!==null){
        contatoDesmarcar.classList.remove("selecionado");
    }
    contatoMarcar.classList.add("selecionado");
}
//selecionar visibilidade
function selecionarVisibilidade(marcarViibilidade){
    let todasAsVisibilidades=document.querySelector(".visibilidades");
    let desmarcarVisibilidade= todasAsVisibilidades.querySelector(".selecionado");
    if(desmarcarVisibilidade!==null){
        desmarcarVisibilidade.classList.remove("selecionado");
    }
    marcarViibilidade.classList.add("selecionado");
}
