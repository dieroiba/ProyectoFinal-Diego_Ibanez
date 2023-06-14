//Selección de elementos en el DOM

const articulosEl = document.querySelector(".galeria");
const itemCarroEl = document.querySelector(".contenedor-carro");
const subtotalEl = document.querySelector(".carro-total-titulo");


const getProducts = async () => {
    const response = await fetch("data.json");
    const data = await response.json();
    console.log(data);
};

getProducts();