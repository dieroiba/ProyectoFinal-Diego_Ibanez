//Selección de elementos en el DOM

const articulosEl = document.querySelector(".galeria");
const itemCarroEl = document.querySelector(".contenedor-carro");
const subtotalEl = document.querySelector(".carro-total-titulo");


//////////////////////////////////////////////////
//Renderizado de artículos en la galería (fotos)//
//////////////////////////////////////////////////

const getProducts = async () => {
    const response = await fetch("data.json");
    const data = await response.json();
    function renderArticulos(){
  
        data.forEach((articulo) => {
            let nombreArchivo = articulo.imgSrc; //Asigna el título de la foto según el nombre del archivo
            let tituloFoto = nombreArchivo.split("/").pop(); //Extrae de la ruta sólo el nombre del archivo para el título de la foto
            articulosEl.innerHTML += `
                    <div>
                        <span class="item-titulo">${tituloFoto}</span>
                        <img class= "item-imagen sombra-grow-img" src="${articulo.imgSrc}">
                            <div class="pie-foto">
                                <span class="item-precio">$ ${articulo.precio}</span>
                                <button class="botnsprimario" onclick = "agregarAlCarrito(${articulo.id})">Agregar al carrito</button>
                                <button class="botnsprimario" onclick = "window.location.href='#carrito'">Ver carrito</button>
                            </div>
                    </div>
            `;
        })
            
};

renderArticulos();





////////////////////////////////////////////////////////////////////
//Nuevo array para guardar los artículos seleccionados del carrito//
////////////////////////////////////////////////////////////////////

let carro = JSON.parse(localStorage.getItem("CARRO")) || []; //Uso de JSON y Storage
actualizarCarrito();


///////////////////////////////////////
//Función agregar fotos al carrito//
///////////////////////////////////////

function agregarAlCarrito (id) {

    const verCarrito = document.createElement("button");
    /* verCarrito.innerHTML = ""; */
   /*  document.body.appendChild(verCarrito); */


    if(carro.some((item) => item.id === id)){
        
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Ya tienes cargado este item en el carrito!',
            footer: 'Desde tu carrito, que está más abajo, puedes aumentar la cantidad de copias de cada foto!'
            
          })

    }else {

        const item = articulo.find((articulo) => articulo.id === id)
        carro.push({
            ...item, //Spread de arrays
            numeroDeUnidades : 1,
        });    

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


        /* Swal.fire({
            icon: 'success',
            title: 'Muy bien!',
            text: 'Agregaste una foto a tu carrito!',
            footer: 'Para ver tu carrito dirígete al final de la página',
            
        }) */

}
    actualizarCarrito();
    
}

agregarAlCarrito (id);

//////////////////////////////////
//Actualizar items en el carrito//
//////////////////////////////////

function actualizarCarrito() {
    renderItemsCarro();
    renderSubtotal();
    //Guardar carrito en el localstorage
    localStorage.setItem("CARRO", JSON.stringify(carro)); //Uso de JSON
   
}


///////////////////////////////////
//Renderizado de items de carrito//
///////////////////////////////////

function renderItemsCarro(articulo) {
        itemCarroEl.innerHTML = "";
    carro.forEach((item) => {
        let nombreImagen = item.imgSrc; //Asigna el título de la foto según el nombre del archivo
        let tituloImagen = nombreImagen.split("/").pop(); //Extrae de la ruta sólo el nombre del archivo para el título de la foto
        itemCarroEl.innerHTML += `
        <div  class="carro-items"> 
            <div class = "fila-de-carro">
                <div class="carro-item carro-columna">
                    <img class="carro-item-imagen" src="${item.imgSrc}">
                    <span class="carro-item-titulo">${tituloImagen}</span>
                </div>
                <span class="carro-precio carro-columna">$ ${item.precio}</span>
                <div class="carro-cantidad carro-columna">
                    <div class = "btn btnsto" onclick = "cambiarNumeroDeUnidades('disminuir', ${item.id})">-</div>
                    <div class = "numero-copias">${item.numeroDeUnidades}</div>
                    <div class = "btn btnsto" onclick = "cambiarNumeroDeUnidades('aumentar', ${item.id})">+</div>

                    <button class="botns botns-quitar" type="button" onclick="quitarItemDelCarrito(${item.id})">QUITAR</button>
                </div>
            </div>
        </div>
        `
    });
}


///////////////////////////////////////
//Cambiar número de unidades / copias//
///////////////////////////////////////

function cambiarNumeroDeUnidades(action, id) {
    carro = carro.map ((item) => {
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



////////////////////////////
//Quitar fotos del carrito//
////////////////////////////

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
          carro = carro.filter((item) => item.id !== id);
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

    carro.forEach((item) => {
        precioTotal += item.precio * item.numeroDeUnidades;
        itemsTotales += item.numeroDeUnidades;
    });

    subtotalEl.innerHTML = `Subtotal (${itemsTotales} fotos): $${precioTotal.toFixed(2)}`;
}


/////////////////////////////////
//Ejecución del Botón de compra//
/////////////////////////////////

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
            
                localStorage.removeItem(`CARRO`); //Uso de Storage
                
                //Empleo de setTimeout para refrescar la página luego de vaciar el carrito.
                setTimeout(() => {
                    window.location.reload()
                }, 3500)

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



};

getProducts();


