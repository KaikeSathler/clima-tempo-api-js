// Cria a função chamarAPI que define parâmetros, cujo "cidade" é um parâmetro obrigatório por não ter uma predefinição. Os outros parâmetros são opcionais e serão usados depois.
function chamarAPI(cidade, carregadoInicio = false, lat = 0, long = 0) {
    // Verifica a URL correta para fazer a requisição. Caso carregadoInicio seja false, chama a API de puxar o clima pelo nome da cidade. Caso contrário, puxa o clima pela latitude e longitude.
    let url = "";
    if(!carregadoInicio) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cidade)}&appid=cfcbf17c77e386b244fad41ab0dc6eec&units=metric&lang=pt_br`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=cfcbf17c77e386b244fad41ab0dc6eec&units=metric&lang=pt_br`
    }
    
    fetch(url).then((response) => {
        if(response.ok) {
            return response.json();
        }
    })

    .then((dados) => {
        console.log(dados)
        const temperatura = parseInt(dados.main.temp);
        const temperatura_max = parseInt(dados.main.temp_max);
        const temperatura_min = parseInt(dados.main.temp_min);
        const velocidade_vento = parseInt(dados.wind.speed);
        const umidade = parseInt(dados.main.humidity);
        const info_clima = dados.weather[0].description.replace(/(^|\s)\S/g, (L) => L.toUpperCase());
        const iconCode = dados.weather[0].icon;
        const isSunny = iconCode.includes('01d') || iconCode.includes('02d');
        const color = isSunny ? 'rgb(255, 210, 97)' : 'rgb(152, 156, 156)';
        document.getElementById("temperatura").innerHTML = temperatura + "<sup>ºC</sup>";
        document.getElementById("temperatura_max").innerHTML = temperatura_max + "<sup>ºC</sup>";
        document.getElementById("temperatura_min").innerHTML = temperatura_min + "<sup>ºC</sup>";
        document.getElementById("vento").innerHTML = velocidade_vento + " km/h";
        document.getElementById("umidade").innerHTML = umidade + " %";
        document.getElementById("cidade").innerHTML = dados.name + ", " + dados.sys.country;
        document.getElementById("color_temp").style.backgroundColor = color;
        document.getElementById("imagem").src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}@4x.png`
        document.getElementById("imagem").style.width = "8rem";
        document.getElementById("info_clima").innerHTML = info_clima
    }).catch((e) => {
        throw new Error(e)
    })
}

function verificarEnter(e) {
    if(e.key === "Enter") {
        let cidade = document.querySelector("input[type=search]").value;
        chamarAPI(cidade)
    }
}

function carregarPos(position) {
    const { latitude, longitude } = position.coords;
    chamarAPI("", true, latitude, longitude);
}

window.addEventListener("load", () => {
    navigator.geolocation.getCurrentPosition(carregarPos);
})
