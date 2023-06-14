
const articulosEl = document.querySelector(".galeria");
const itemCarroEl = document.querySelector(".contenedor-carro");
const subtotalEl = document.querySelector(".carro-total-titulo");
let products = JSON.parse(localStorage.getItem ("products")); //Variable con los items a vender
let cart = JSON.parse(localStorage.getItem ("cart")); // Variable con los items dentro del carrito

fetch("data.json")
.then(function(response) {
    return response.json();
})
.then(function (data) {
    localStorage.setItem("products", JSON.stringify(data));
    if(!localStorage.getItem("cart")) {
        localStorage.setItem("cart", "[]");
        location.reload(); //Recarga la página para que puedan verse los artículos en venta.
    }
});

//Variables globales para poder acceder desde dentro de las funciones




//////////////////////////////////////////////////
//Renderizado de artículos en la galería (fotos)//
//////////////////////////////////////////////////

function renderArticulos() {
        articulosEl.innerHTML = ``;
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
      
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Ya tienes cargado este item en el carrito!',
            footer: 'Desde tu carrito, que está más abajo, puedes aumentar la cantidad de copias de cada foto!'
            
          })

    } else {
        const item = products.find((product) => product.id === id);

        cart.push({
            ...item, //Spread de arrays
            numeroDeUnidades : 1,
        });    
        localStorage.setItem("cart", JSON.stringify(cart)); //Uso de JSON
        actualizarCarrito();

        //Mensaje "Agregado al carrito"
        let timerInterval
        Swal.fire({
        title: 'Agregaste una foto a tu carrito!',
        icon: 'success',
        //html: 'Me cerraré en <b></b> milisegundos.',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
        //b.textContent = Swal.getTimerLeft()
        }, 100)
    },
        willClose: () => {
        clearInterval(timerInterval)
        }
})      .then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer')
        }
})

    }
    
    
};

//Función actualizar carrito

function actualizarCarrito() {
    renderItemsCarrito();
    /* actualizarSubtotal(); */
}


//Render de los items del carrito

function renderItemsCarrito() {
    itemCarroEl.innerHTML = "";
    cart.forEach ((product) => {
        let nombreImagen = product.imgSrc; //Asigna el título de la foto según el nombre del archivo
        let tituloImagen = nombreImagen.split("/").pop(); //Extrae de la ruta sólo el nombre del archivo para el título de la foto
        itemCarroEl.innerHTML += `
        <div  class="carro-items"> 
            <div class = "fila-de-carro">
                <div class="carro-item carro-columna">
                    <img class="carro-item-imagen" src="${product.imgSrc}">
                    <span class="carro-item-titulo">${tituloImagen}</span>
                </div>
                    <span class="carro-precio carro-columna">$ ${product.precio}</span>
                <div class="carro-cantidad carro-columna">
                    <div class = "btn btnsto" onclick = "cambiarNumeroDeUnidades('disminuir', ${product.id})">-</div>
                    <div class = "numero-copias">${product.numeroDeUnidades}</div>
                    <div class = "btn btnsto" onclick = "cambiarNumeroDeUnidades('aumentar', ${product.id})">+</div>

                    <button class="botns botns-quitar" type="button" onclick="quitarItemDelCarrito(${product.id})">QUITAR</button>
                </div>
            </div>
        </div>
        `;
        /* actualizarCarrito(); */
    });
}

renderItemsCarrito();

