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
            <span class="time">(${mensagem.time})  </span>
            <span class="message"><strong class="str">${mensagem.from}   </strong> ${mensagem.text}</span> 
        </div>`
        } else if(mensagem.type == 'message'){
            chat.innerHTML+= ` <div class="mensagem-publica">
            <span class="time">(${mensagem.time})  </span>
            <span class="message"><strong class="str">${mensagem.from}   </strong>para <strong class="str">${mensagem.to}</strong>: ${mensagem.text}</span> 
        </div>`
        } else{
            if(mensagem.from == usuario || mensagem.to == usuario || mensagem.to == 'todos'){
            chat.innerHTML+=`<div class="mensagem-privada">
                <span class="time">(${mensagem.time})  </span>
                <span class="message"><strong class="str">${mensagem.from}   </strong> reservadamente para <strong class="str">${mensagem.to}</strong>: ${mensagem.text}</span> 
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
    const input=document.querySelector('.campo-texto');
    if(input.value){
    const texto = {
        from: usuario,
        to: 'Todos',
        text: input.value,
        type: 'message'
    }
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', texto);
    input.value="";
    }
}