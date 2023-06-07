/////////////////////////////////////
//Inicio módulo de inicio de sesión//
/////////////////////////////////////


let usuario; //Variable con el nombre del usuario

//Almacenamos la clave en el local storage que va a contener el nombre de usuario
let usuarioStorage = localStorage.getItem(`usuario`);

//Si ya inició sesión previamente, desaparece el módulo de inicio de sesión
//y se crea un nuevo nodo dentro del formulario que da la bienvenida con el dato recuperado del local storage.
if(usuarioStorage){
    usuario = usuarioStorage; 
    let elementoUno = document.getElementById(`nombre`);
    elementoUno.remove();
    let elementoDos = document.getElementById(`ingresar`);
    elementoDos.remove();
    //Creamos un nuevo elemento div
    let bienvenida = document.createElement(`div`);
    //Asignamos un nuevo elemento dentro del nuevo nodo
    bienvenida.innerHTML = `<h1>Bienvenid@ ${usuario}</h1>`;
    //Ubicamos el nuevo nodo con su elemento dentro del Formulario
    const form = document.getElementById(`ingreso`);
    form.insertBefore(bienvenida, form.children[0]);

//Si es la primera vez que ingresa, aparece el módulo de inicio de sesión, y cuando
//el usuario hace clic en el botón Enviar, se almacena su valor en la variable "usuario".
}else {
    let ingreso = document.getElementById(`formulario`);
    ingreso.addEventListener(`submit`, (e) => {
        usuario = document.getElementById(`nombre`).value;
        localStorage.setItem(`usuario`, usuario);//Asignamos en la key "usuario" del local storage el valor de la variable usuario.
        });
}
            


/////////////////////////////////
//Inicio del módulo Testimonios//
/////////////////////////////////

//Creación de constantes a partir de la selección de varios nodos.
const contenedorTestimonios = document.querySelector(".contenedor-testimonios");
const testimonio = document.querySelector(".testimonio");
const imagenUsuario = document.querySelector(".usuario-imagen");
const nombreUsuario = document.querySelector(".nombreusuario");
const usuarioProfesion = document.querySelector(".profesion");

///////////////////////////////////////////////////////////////
//Array con objetos para el almacenamiento de los testimonios//
///////////////////////////////////////////////////////////////

const testimonios = [ 
    {
        nombre: "Laura López",
        profesion: "Estilista",
        foto: src ="./img/cliente_01.png",
        texto: "Me encantó el trabajo de Diego. Amé las fotos que nos sacó para nuestra boda. Tiene una habilidad increíble para capturar esos momentos mágicos!  Lo super recomiendo!!",
    },

    {
        nombre: "Alejandro Ramirez",
        profesion: "Medico",
        foto: src="./img/cliente_02.png",
        texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },

    { 
        nombre: "Esther Gandur",
        profesion: "Arquitecta",
        foto: src ="./img/cliente_03.png",
        texto: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },

    {
        nombre: "Patricia Zeballos",
        profesion: "Odontóloga",
        foto: src ="./img/cliente_03.png",
        texto: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    },          
]


//Definición de la variable que será el índice del array
let i = 1;


///////////////////////////////////////////////////////////
//Función destinada a actualizar el módulo de testimonios//
///////////////////////////////////////////////////////////

function actualizarTestimonio() {
    //Aplicación de Desestructuración
    const {nombre, profesion, foto, texto} = testimonios[i]

    testimonio.innerHTML = texto;
    imagenUsuario.src = foto;
    nombreUsuario.innerHTML = nombre;
    usuarioProfesion.innerHTML = profesion;

    i++; //Al finalizar la presentación de un testimonio, incrementamos en 1 el índice para continuar con el siguiente.

    if(i > testimonios.length -1){
        i = 0;
    }

}

setInterval(actualizarTestimonio, 10000) //10 segundos para mostrar cada testimonio.



/////////////////////////////////
//Inicio del módulo Búsqueda//
/////////////////////////////////

//Este módulo sólo aparece cuando el usuario hace click en la lupa

//Creación de constantes a partir de la selección de varios nodos del módulo Búsqueda
const busqueda = document.querySelector(`.busqueda`)
const btn = document.querySelector(`.btn`)
const entrada = document.querySelector(`.entrada`)

//Al hacer click en el botón, se ejecuta el evento
btn.addEventListener(`click`, () => {
    busqueda.classList.toggle(`active`)
    entrada.focus()
})

const paneles = document.querySelectorAll(`.panel`);

paneles.forEach((panel)=> {
    panel.addEventListener(`click`, ()=> {
        removeActiveClasses()
        panel.classList.add(`activo`)
    })
})

function removeActiveClasses() {
    paneles.forEach(panel => {
        panel.classList.remove(`activo`)
    })
}



  