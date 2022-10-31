let mensagens =[];
let nome="";
const elementoQueQueroQueApareca = document.querySelector('.mensagem');
//elementoQueQueroQueApareca.scrollIntoView();
let usuario = prompt("qual seu lindo nome?");
let manterOnline = true;
let podeObterMensagens = true;
setInterval(buscarMensagens, 3000);
login();

function login(){
    const user = {
        name: usuario
    }
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', user);

    requisicao.then(tratarSucesso).catch(tratarError);

}

function tratarSucesso(){
    setInterval(() => {
        if (manterOnline == true){
            manterOnline = false;
            const user = {
                name: usuario
            }
            const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',user);
            requisicao.then(()=> manterOnline = true).catch(usuarioDesconectado);
        }
    }, 5000);
}

function usuarioDesconectado(){
    window.location.reload();
}

function tratarError(){
    usuario = prompt("Este nome já está sendo utilizado, por favor insira um nome válido"); 
}


function buscarMensagens(){
    if(podeObterMensagens == true){
        podeObterMensagens = false;
        const requisicao = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
        requisicao.then(receberMensagens).catch(erroNoServidor);
    }
}

function receberMensagens(resposta){
    mensagens = resposta.data;
    let chat = document.querySelector('.chat');
    chat.innerHTML="";
    mensagens.forEach((mensagem)=>{
        if(mensagem.type == 'status'){
            chat.innerHTML+= `<div class="mensagem-status">
            <span>(${mensagem.time})</span>
            <span><strong>${mensagem.from}</strong> ${mensagem.text}</span> 
        </div>`
        } else if(mensagem.type == 'message'){
            chat.innerHTML+= ` <div class="mensagem-publica">
            <span>(${mensagem.time})</span>
            <span><strong>${mensagem.from}</strong>para <strong>${mensagem.to}</strong>: ${mensagem.text}</span> 
        </div>`
        } else{
            if(mensagem.from == usuario || mensagem.to == usuario || mensagem.to == 'todos'){
            chat.innerHTML+=`<div class="mensagem-privada">
                <span>(${mensagem.time})</span>
                <span><strong>${mensagem.from}</strong> reservadamente para <strong>${mensagem.to}</strong>: ${mensagem.text}</span> 
            </div>`
            }
        }
    });
    podeObterMensagens = true;
}

function erroNoServidor(){
    podeObterMensagens = true;
}

function enviarMensagem(){
    const mensagem = {
        from: "nome do usuário",
        to: "nome do destinatário (Todos se não for um específico)",
        text: "mensagem digitada",
        type: "message" // ou "private_message" para o bônus
    }
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
  //  promessa.then(tratarSucesso); 
  //  promessa.catch(tratarErro);

}