let usuario = { name: prompt("Qual seu nome?") };

const feed = document.querySelector('.feed');

let mensagens = [];

entradaUsuario();

function entradaUsuario() {

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);

    promessa.then(statusPrincipal);
    promessa.catch(deuRuim);

}


function deuRuim(error) {
    const statusCode = error.response.status;

    if (statusCode === 400) {
        alert('Nome indisponível! Digite outro, por favor.');

        
        window.location.reload();

    }
}

function presencaStatus() {
    const promisePost = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    promisePost.catch(() => window.location.reload())

}

function statusPrincipal() {
    presencaStatus();
    setInterval(presencaStatus, 5000);
    mensagensChegou(); //cria mensagens
    setInterval(mensagensChegou, 3000);
}



function mensagensChegou() {
    const promessaget = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages'); // colocar aqui o código da tela principal, cria mensagens

    promessaget.then(certoMensagens);
    promessaget.catch(() => window.location.reload());

}
mensagensChegou();

function certoMensagens(conversa) { // todas as mensagens
    const mensagens = conversa.data;
    console.log(conversa)
    feed.innerHTML = "";

    for (let i = 0; i < mensagens.length; i++) {

        if (mensagens[i].type === "status") {

            feed.innerHTML +=

                `<div data-test= "message" class="sala">
            <span class="time">(${mensagens[i].time})</span>
            <strong class="name">${mensagens[i].from} </strong>
            <span class="text">${mensagens[i].text}</span>
        </div>
        `;
        } else if (mensagens[i].type === "message") {

            feed.innerHTML +=

                `<div data-test= "message" class="conversa-todos">

                <span class="time">(${mensagens[i].time})</span>
               <strong class="name">${mensagens[i].from}</strong>
                <p class="text">para</p>
                <span class="name">${mensagens[i].to}</span>
                <span class="text">${mensagens[i].text}</span>
           
           
        </div>
        `;
        } else if (mensagens[i].type === "private-message" && (usuario.name === mensagens[i].from || usuario.name === mensagens[i].to)){
            feed.innerHTML +=

            `<div data-test= "message" class="reservado">

            <span class="time">(${mensagens[i].time})</span>
            <strong class="name">${mensagens[i].from}</strong>
            <p class="text">reservadamente para</p>
            <span class="name">${mensagens[i].to}</span>
            <span class="text">${mensagens[i].text}</span>
       
       
    </div>
    `
            

        }
        feed.lastChild.scrollIntoView();

    }


}



function MandarMensagens() {
    const enviar = document.querySelector('.digitar').value;
    document.querySelector('.digitar').value = '';


    const Novamensagem = {
        from: usuario.name,
        to: 'Todos',
        text: enviar,
        type: 'message',
    };

    const promessaMens = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', Novamensagem);

    promessaMens.then(postagemCerto);
    promessaMens.catch(postagemErro);


}


function postagemCerto(conversa){
    console.log(conversa);
    mensagensChegou();
    document.querySelector('.digitar').value = "";
}

function postagemErro(error){
    window.location.reload();
}