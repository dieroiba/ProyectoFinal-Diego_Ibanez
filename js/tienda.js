
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
        
            renderSubtotal();
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
    renderSubtotal();
    localStorage.setItem("cart", JSON.stringify(cart)); //Tambíen se actualiza el carrito en el Local Storage
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
        
    });
}

renderItemsCarrito();

//Aumentar o disminuir el número de unidades en el carrito

function cambiarNumeroDeUnidades(action, id) {
    cart = cart.map ((item) => {
        let numeroDeUnidades = item.numeroDeUnidades;

        if(item.id === id){
            if (action === "disminuir" && numeroDeUnidades > 1) {
                numeroDeUnidades--;
            } else if (action === "aumentar" && numeroDeUnidades < item.stock) {
                numeroDeUnidades++;
            }
        }
       
       return {
        ...item, //Spread de arrays
        numeroDeUnidades,
       }
    });
    
    actualizarCarrito();
}


function quitarItemDelCarrito(id) {
    
    Swal.fire({
        
        title: 'Quieres eliminar esta foto de tu carrito?',
        showDenyButton: true,
        icon: 'question',
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire('Foto eliminada con éxito!', '', 'success')
          cart = cart.filter((item) => item.id !== id);
          actualizarCarrito();
        } else if (result.isDenied) {
          Swal.fire('No se eliminó esta foto!', '', 'info')
        }
      })

   
}




////////////////////////////////////////////
//Actualización de los totales del carrito//
////////////////////////////////////////////

function renderSubtotal() {
    
    let precioTotal = 0;
    let itemsTotales = 0;

    cart.forEach((item) => {
        precioTotal += item.precio * item.numeroDeUnidades;
        itemsTotales += item.numeroDeUnidades;
    });

    
    subtotalEl.innerHTML = `Subtotal (${itemsTotales} fotos): $${precioTotal.toFixed(2)}`;


    
}





function clickCompra(){ //Se recorren todas las filas y se borran los items para que el carrito quede vacío.
    
    //Si el carrito está vacío y el usuario hace clic en Comprar aparece error.
    if(itemCarroEl.innerHTML === ``) {

        Swal.fire({
            icon: 'warning',
            title: 'Tu carrito esta vacío!',
            text: 'Comenzá a agregar las fotos!',
            //footer: '',
            
        })
        
    } else {
        
            while (itemCarroEl.hasChildNodes()){
                    itemCarroEl.innerHTML = ``;
                    subtotalEl.innerHTML = "Subtotal (o copias): $0";
                
                }
            
                localStorage.removeItem(`cart`); //Uso de Storage
                
                //Empleo de setTimeout para refrescar la página luego de vaciar el carrito.
                setTimeout(() => {
                    window.location.reload()
                }, 3000)

                //Mensaje luego de la compra.
                let timerInterval
                Swal.fire({
                title: 'Muchas gracias por tu compra!',
                icon: 'success',
                //html: 'Me cerraré en <b></b> milisegundos.',
                timer: 3000,
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
                }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                //console.log('I was closed by the timer')
                }
                
                })

            }
}
