let usuario = { name: prompt("Qual seu nome?") };

const feed = document.querySelector('.feed');

let mensagens = [];


function entradaUsuario() {

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);

    promessa.then(statusPrincipal);
    promessa.catch(deuRuim);

}


function deuRuim(error) {
    const statusCode = error.response.status;

    if (statusCode === 400) {

        nomeErros();
        window.location.reload()

    }
}

function presencaStatus() {
    const promisePost = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    promisePost.catch(() => window.location.reload())

}

function statusPrincipal() {
    presencaStatus;
    setInterval(presencaStatus, 5000);
    mensagensChegou(); //cria mensagens
    setInterval(mensagensChegou, 3000);
}

function nomeErros() {
    usuario = [
        { name: prompt('Nome indisponível! Digite outro, por favor.') }

    ];
}

function mensagensChegou() {
    const promessaget = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages'); // colocar aqui o código da tela principal, cria mensagens

    promessaget.then(certoMensagens);
    promessaget.catch(() => window.location.reload());

}
mensagensChegou();

function certoMensagens(conversa) { // todas as mensagens
    const msg = conversa.data;
    console.log(conversa)
    feed.innerHTML = "";

    for (let i = 0; i < msg.length; i++) {

        if (msg[i].type === "status") {

            feed.innerHTML +=

                `<div data-test= "message" class="sala">
            <span class="time">(${mensagens[i].time})</span>
            <span class="name">${mensagens[i].from}</span>
            <span class="text">${mensagens[i].text}</span>
        </div>
        `;
        } else if (msg[i].type === "message") {

            feed.innerHTML +=

                `<div data-test= "message" class="conversa-todos">

                <span class="time">(${mensagens[i].time})</span>
                <span class="name">${mensagens[i].from}</span>
                <p> class="text">para</p>
                <span class="name">${mensagens[i].to}</span>
                <span class="text">${mensagens[i].text}</span>
           
           
        </div>
        `;
        } else if (msg[i].type === "private-message" && (usuario.name === msg[i].from || usuario.name === msg[i].to)){

            `<div data-test= "message" class="reservado">

            <span class="time">(${mensagens[i].time})</span>
            <span class="name">${mensagens[i].from}</span>
            <p> class="text">reservadamente para</p>
            <span class="name">${mensagens[i].to}</span>
            <span class="text">${mensagens[i].text}</span>
       
       
    </div>
    `
            

        }

    }


}



function MandarMensagens() {
    const enviar = document.querySelector('.digitar').value;
    document.querySelector('.digitar').value = '';

    if (enviar === ''){
        return enviar;
    };

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