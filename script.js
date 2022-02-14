let contadorMensagens = 0, nomeUsuario,objetoNome, participante="",ultimaMensagem="", visibilidade="message", destinatario = "Todos", textoMensagem="",objetoMensagem=[];
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
        definindoMensagemStatus();
        setTimeout(tirarTelaCarregamento,2000);
    }
}
//Tirando tela de carregamento
function tirarTelaCarregamento(){
    const telaCarregar = document.querySelector(".telaDeCarregamento");
    telaCarregar.classList.add("escondido");
}
//Definindo a mensagem de status
function definindoMensagemStatus(){
    let valorVisibilidade;
    if(visibilidade==="message"){
        valorVisibilidade ="publico";
    }
    else{
        valorVisibilidade ="privado";
    }
    const mensagemStatus= document.querySelector(".statusMensagem");
    mensagemStatus.innerHTML=`Enviando para ${destinatario} (${valorVisibilidade})`;
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
    //console.log(resultado);
}


//Construindo e enviando a mensagem para o servidor 
function enviandoMensagem(){
    textoMensagem = document.querySelector(".escrevaAqui").value;
    objetoMensagem ={
        from:nomeUsuario,
        to:destinatario,
        text:textoMensagem,
        type:visibilidade
    }
    if(textoMensagem!==""){
        const requisicao =axios.post(
            "https://mock-api.driven.com.br/api/v4/uol/messages",objetoMensagem
            );
        requisicao.then(requisicaoMensagem);
        requisicao.catch(erroRequisicao);
        limparCampo();
    }
    else {
        alert("mensagem invalida");
    }
}

function requisicaoMensagem(resultado){
    console.log(objetoMensagem);
    console.log(resultado);
}
function limparCampo(){
    let campoDaMensagem = document.querySelector(".escrevaAqui");
    campoDaMensagem.value="";
}

//Conferindo erros no envio das requisições
function erroRequisicao(erro){
    alert("erro na requisição, recarregue o site e tente novamente");
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
        let mensagem;
        //Privando e renderizando mensagens 
        
        if(mensagens[i].type==="status"){
            mensagem = `
        <article data-identifier="message" class="mensagem ${i} ${mensagens[i].type}">
        <p>
            <small>(${mensagens[i].time}) </small><strong> ${mensagens[i].from} </strong>: ${mensagens[i].text}
        </p>
        </article>
        `;
        }
        else if(mensagens[i].type==="private_message" && nomeUsuario!==mensagens[i].from && nomeUsuario!==mensagens[i].to) {
            mensagem =`
        <article data-identifier="message" class="mensagem escondido ${i} ${mensagens[i].type}">
        <p>
            <small>(${mensagens[i].time}) </small><strong> ${mensagens[i].from} </strong>para<strong> ${mensagens[i].to} </strong>: ${mensagens[i].text}
        </p>
        </article>
        `;
        }
        else{
            mensagem = `
        <article data-identifier="message" class="mensagem ${i} ${mensagens[i].type}">
        <p>
            <small>(${mensagens[i].time}) </small><strong> ${mensagens[i].from} </strong>para<strong> ${mensagens[i].to} </strong>: ${mensagens[i].text}
        </p>
        </article>
        `;
        }
        
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
        <article data-identifier="participant" class="contato" onclick="selecionarContato(this, '${nomeParticipantes[i].name}')">
               <div><ion-icon name="person-circle"></ion-icon></div>
               <p>${nomeParticipantes[i].name}</p>
               <ion-icon name="checkmark" class="iconeSelecionar"></ion-icon>
        </article>
        `;
        contatos.innerHTML=`
            <article data-identifier="participant" class="contato selecionado" onclick="selecionarContato(this, 'Todos')">
                    <ion-icon name="people"></ion-icon>
                    <p>Todos</p>
                    <ion-icon name="checkmark" class="iconeSelecionar"></ion-icon>
            </article>
        ` +participante;
    }
}
//Selecionar contato
function selecionarContato(contatoMarcar,destinatarioSelecionado){
    destinatario = destinatarioSelecionado;
    definindoMensagemStatus();
    let todosOsContatos = document.querySelector(".contatos");
    let contatoDesmarcar = todosOsContatos.querySelector(".selecionado");
    if(contatoDesmarcar!==null){
        contatoDesmarcar.classList.remove("selecionado");
    }
    contatoMarcar.classList.add("selecionado");
}
//selecionar visibilidade
function selecionarVisibilidade(marcarViibilidade, visibilidadeEscolhida){
    visibilidade = visibilidadeEscolhida;
    definindoMensagemStatus();
    let todasAsVisibilidades=document.querySelector(".visibilidades");
    let desmarcarVisibilidade= todasAsVisibilidades.querySelector(".selecionado");
    if(desmarcarVisibilidade!==null){
        desmarcarVisibilidade.classList.remove("selecionado");
    }
    marcarViibilidade.classList.add("selecionado");
}
