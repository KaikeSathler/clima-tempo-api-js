// Cria a função chamarAPI que define parâmetros, cujo "cidade" é um parâmetro obrigatório por não ter uma predefinição. Os outros parâmetros são opcionais e serão usados depois.
function chamarAPI(cidade, carregadoInicio = false, lat = 0, long = 0) {
    // Verifica a URL correta para fazer a requisição. Caso carregadoInicio seja false, chama a API de puxar o clima pelo nome da cidade. Caso contrário, puxa o clima pela latitude e longitude.
    let url = "";
    if(!carregadoInicio) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=cfcbf17c77e386b244fad41ab0dc6eec`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=cfcbf17c77e386b244fad41ab0dc6eec`
    }
    // A função fetch é responsável por executar as requisições. Ela faz a requisição primeiro e retorna um "corpo" (também denominado resposta do servidor) para o cliente. Com este corpo, é possível verificar os dados e verificar também se a requisição foi bem sucedida. Caso a resposta seja bem-sucedida, retorna como um JSON esta resposta, no qual será utilizada depois.
    fetch(url).then((response) => {
        if(response.ok) {
            return response.json();
        }
    })
    //Com a resposta em JSON, agora chama novamente a resposta do "fetch", na qual foi transformada em JSON anteriormente.
    .then((dados) => {
        // Pega todos os dados, faz os cálculos aritméticos para a temperatura e substitui os elementos.
        console.log(dados)
        const temperatura = parseInt(((parseInt(dados.main.temp) - 273)));
        const temperatura_max = parseInt(((parseInt(dados.main.temp_max) - 273)));
        const temperatura_min = parseInt(((parseInt(dados.main.temp_min) - 273)));
        const velocidade_vento = parseInt(dados.wind.speed)
        const umidade = parseInt(dados.main.humidity)
        document.getElementById("temperatura").innerText = temperatura + " ºC";
        document.getElementById("temperatura_max").innerText = temperatura_max + " ºC";
        document.getElementById("temperatura_min").innerText = temperatura_min + " ºC";
        document.getElementById("vento").innerText = velocidade_vento + " km/h";
        document.getElementById("umidade").innerText = velocidade_vento + " %";
        document.getElementById("cidade").innerText = dados.name + ", " + dados.sys.country;
        if (temperatura < 20) {
            document.getElementById("color_temp").style.backgroundColor = "rgb(121, 163, 201)";
          } else {
            document.getElementById("color_temp").style.backgroundColor = "rgb(255, 227, 46)";
          }
        // A imagem será atualizada conforme o clima atual, é utilizada uma imagem vinda da API. No caso, o parâmetro que é passado é o código da imagem, que vem junto com a váriavel "dados" (resposta do servidor em formato JSON)
        document.getElementById("imagem").src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}@4x.png`
    }).catch((e) => {
        throw new Error(e)
    })
}

// Função para verificar se, no evento que foi acionado, a propriedade "key" é igual a Enter, no caso, após o usuário soltar a tecla enter (se estiver presssionando).

function verificarEnter(e) {
    // Se for igual a ENTER, pega o valor do input e chama a função chamarAPI passando a váriavel cidade como parâmetro.
    if(e.key === "Enter") {
        let cidade = document.querySelector("input[type=search]").value;
        chamarAPI(cidade)
    }
}

function carregarPos(position) {
    /* Extrai a propriedade "latitude" e "longitude" do objeto "position". Lembrando que, ele extrai essas propriedades do objeto "coords" que está dentro do objeto "coords". Quando você faz essa extração, a váriavel fica com o nome da propriedade. 
    
    Por exemplo:
        const objeto = 
        {
            nome: "Chris",
            fera: "Kaike"
        }

        se eu escrever o seguinte código:

        const { nome, fera } = objeto;

        é a mesma coisa que eu fazer:

        let nome = objeto.nome;
        let fera = objeto.fera;

    */
    const { latitude, longitude } = position.coords;
    // Chama a função chamarAPI com os parâmetros... Expliquei lá em cima o porquê dos parâmetros.
    chamarAPI("", true, latitude, longitude);
}

// Quando o navegador carregar, tenta pegar a geolocalização do usuário, caso o usuário aceite a função "carregarPos" será chamada com as posições. Caso o usuário negue a permissão, não acontecerá nada.

window.addEventListener("load", () => {
    navigator.geolocation.getCurrentPosition(carregarPos);
})