
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultadoDiv = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}


//crear un promise
//funcion que recibe por parametro 'criptomonedas' y hace un promise que solo tiene resolve
const obtenerCriptomoneda = criptomonedas => new Promise(resolve =>{

    resolve(criptomonedas); //retorna criptomonedas

});



document.addEventListener('DOMContentLoaded', () => {

    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);

})

async function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(resultado => obtenerCriptomoneda(resultado.Data) )  //promise que solo actua cuando cargo la api
    //     .then( criptomonedas => selectCriptomonedas(criptomonedas)); 
        
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomoneda(resultado.Data);
        selectCriptomonedas(criptomonedas);

    } catch (error) {
        console.log(error);
    }

}

function selectCriptomonedas(criptomonedas){

    criptomonedas.forEach( moneda => {
        const {FullName, Name} = moneda.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option);

    });

}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
    // console.log(objBusqueda);
}


function submitFormulario(e){
    
    e.preventDefault();

    //primero validar

    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('debes llenar los campos!!');
        return;
    }

    //luego consultar la api

    consultarAPI();


}

function mostrarAlerta(mensaje){

    const viejaAlerta = document.querySelector('.error');

    if(viejaAlerta){
        viejaAlerta.remove();
    }

    const divMensaje = document.createElement('DIV');
    divMensaje.textContent = mensaje;
    divMensaje.classList.add('error');

    formulario.appendChild(divMensaje);

    setTimeout(() => {
        divMensaje.remove();
    }, 2000);

}


async function consultarAPI(){

    const {moneda, criptomoneda} = objBusqueda;
    
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(cotizacion => {
    //         mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    //     });

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log('error');
    }

}

function mostrarCotizacionHTML(coti){

    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = coti;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `El precio mas alto del dia es: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `El precio mas bajo del dia es: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('P');
    ultimasHoras.innerHTML = `La variación en las ultimas horas es de : <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('P');
    ultimaActualizacion.innerHTML = `La ultima actualizacion fue: <span>${LASTUPDATE}</span>`;



    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);


}

function limpiarHTML(){

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

}

function mostrarSpinner(){

    limpiarHTML();

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');

    resultado.appendChild(spinner);



}