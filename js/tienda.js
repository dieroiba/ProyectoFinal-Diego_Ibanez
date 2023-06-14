
const articulosEl = document.querySelector(".galeria");
const itemCarroEl = document.querySelector(".contenedor-carro");
const subtotalEl = document.querySelector(".carro-total-titulo");


fetch("data.json")
.then(function(response) {
    return response.json();
})
.then(function (data) {
    localStorage.setItem("products", JSON.stringify(data));
    if(!localStorage.getItem("cart")) {
        localStorage.setItem("cart", "[]");
    }
});

//Variables globales para poder acceder desde dentro de las funciones

let products = JSON.parse(localStorage.getItem ("products")); //Variable con los items a vender
let cart = JSON.parse(localStorage.getItem ("cart")); // Variable con los items dentro del carrito


//////////////////////////////////////////////////
//Renderizado de artículos en la galería (fotos)//
//////////////////////////////////////////////////

function renderArticulos() {
    products.forEach((product) => {
        let nombreArchivo = product.imgSrc; //Asigna el título de la foto según el nombre del archivo
        let tituloFoto = nombreArchivo.split("/").pop(); //Extrae de la ruta sólo el nombre del archivo para el título de la foto
        articulosEl.innerHTML += `
            <div>
                <span class="item-titulo">${tituloFoto}</span>
                <img class= "item-imagen sombra-grow-img" src="${product.imgSrc}">
                    <div class="pie-foto">
                        <span class="item-precio">$ ${product.precio}</span>
                        <button class="botnsprimario" onclick = "agregarAlCarrito(${product.id})">Agregar al carrito</button>
                        <button class="botnsprimario" onclick = "window.location.href='#carrito'">Ver carrito</button>
                   </div>
            </div>
            `;
        
        
    });
};

renderArticulos();

//Función agregar al carrito

function agregarAlCarrito(id) {
    if(cart.some ((item) => item.id === id)) {
        alert("El artículo ya existe");
    } else {
        const item = products.find((product) => product.id === id);

        cart.push({
            ...item, //Spread de arrays
            numeroDeUnidades : 1,
        });    
        localStorage.setItem("cart", JSON.stringify(cart)); //Uso de JSON
        console.log(cart);
    }

};

agregarAlCarrito(id);





//Agregar el producto al carrito

/* function addItemToCart(productId) {
    let product = products.find(function(product) {
        return product.id == productId;
    });

    if(cart.length == 0) {
        cart.push(product);
    }else {
        let res = cart.find(element => element.id == productId);
        if(res === undefined) {
            cart.push(product);
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

addItemToCart();


//Quitar artículo del carrito

function removeItemFromCart(productId) {
    let temp = cart.filter(item => item.id != productId);
    localStorage.setItem("cart", JSON.stringify(temp));
}

removeItemFromCart(4);

// Actualizar las cantidades del carrito

function updateQuantity(productId, stock) {
    for(let product of cart) {
        if(product.id == productId) {
            product.stock = stock;
            product.precio = product.precio * stock;
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

updateQuantity(0, 0);

//Total del carrito

function getTotal() {
    let temp = cart.map(function(item) {
        return parseFloat(item.precio);
    });

    let sum = temp.reduce(function(prev, next) {
        return prev + next;
    }, 0);

    console.log(sum);
}
getTotal(); */