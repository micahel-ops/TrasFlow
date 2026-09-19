// =========================================================
// LAYOUT COMPARTIDO
// Construye el sidebar y el topbar en todas las pantallas.
//
// Antes este bloque estaba copiado en los 9 HTML. Ahora vive
// solo aqui: agregar o renombrar un modulo es editar el array
// MENU y nada mas.
//
// Se carga ANTES del JS de cada modulo.
// =========================================================


// ---------------------------------------------------------
// MENU: unica fuente de verdad
// ---------------------------------------------------------

const MENU = [
    { archivo: "index.html", icono: "⌂", texto: "Inicio", titulo: "Panel principal" },
    { archivo: "marketing.html", icono: "01", texto: "Marketing" },
    { archivo: "ventas.html", icono: "02", texto: "Ventas" },
    { archivo: "logistica.html", icono: "03", texto: "Logística" },
    { archivo: "almacen.html", icono: "04", texto: "Almacén" },
    { archivo: "produccion.html", icono: "05", texto: "Producción" },
    { archivo: "operaciones.html", icono: "06", texto: "Operaciones" },
    { archivo: "direccion.html", icono: "07", texto: "Dirección General" },
    { archivo: "auditoria.html", icono: "08", texto: "Auditoría y control legal" }
];


// ---------------------------------------------------------
// PAGINA ACTUAL
// ---------------------------------------------------------

function paginaActual() {

    const ruta = window.location.pathname.split("/").pop();

    return ruta === "" ? "index.html" : ruta;

}


function itemActual() {

    const actual = paginaActual();

    return MENU.find(function (item) {
        return item.archivo === actual;
    });

}


// ---------------------------------------------------------
// USUARIO EN SESION
//
// Hoy sale de localStorage y cae a un valor por defecto.
// Cuando exista el backend, este es el unico punto que hay
// que cambiar: leer el token o llamar a /api/auth/me.
// ---------------------------------------------------------

const USUARIO_POR_DEFECTO = {
    nombre: "Michael Kevin",
    rol: "Administrador"
};


function usuarioActual() {

    try {

        const guardado = localStorage.getItem("usuario");

        if (guardado) {
            return JSON.parse(guardado);
        }

    } catch (error) {
        console.warn("No se pudo leer el usuario en sesión:", error);
    }

    return USUARIO_POR_DEFECTO;

}


// ---------------------------------------------------------
// HTML DEL SIDEBAR
// ---------------------------------------------------------

function construirSidebar() {

    const actual = paginaActual();

    const items = MENU.map(function (item) {

        const activo = item.archivo === actual ? " active" : "";

        return ''
            + '<a href="' + item.archivo + '" class="menu-item' + activo + '">'
            + '<span class="menu-icon">' + item.icono + '</span>'
            + '<span>' + item.texto + '</span>'
            + '</a>';

    }).join("");

    return ''
        + '<aside class="sidebar">'

        + '<div class="logo-container">'
        + '<div class="logo-icon">TF</div>'
        + '<div class="logo-text">'
        + '<h1>Transflow</h1>'
        + '<span>Gestión Aduanera</span>'
        + '</div>'
        + '</div>'

        + '<nav class="menu">'
        + '<p class="menu-title">PROCESOS</p>'
        + items
        + '</nav>'

        + '<div class="sidebar-bottom">'
        + '<a href="#" class="menu-item">'
        + '<span class="menu-icon">⚙</span>'
        + '<span>Configuración</span>'
        + '</a>'
        + '<button class="logout-button" id="cerrarSesion">'
        + '<span>↪</span>'
        + 'Cerrar sesión'
        + '</button>'
        + '</div>'

        + '</aside>';

}


// ---------------------------------------------------------
// HTML DEL TOPBAR
//
// Acepta variantes por atributos data- en el contenedor:
//   data-clase     -> clases extra para el <header>
//   data-buscador  -> muestra un buscador en vez del titulo
//   data-buscador-id
// ---------------------------------------------------------

function bloqueCuenta() {

    const usuario = usuarioActual();

    return ''
        + '<div class="topbar-right">'

        + '<button class="notification-button">'
        + '<span>🔔</span>'
        + '<span class="notification-dot"></span>'
        + '</button>'

        + '<div class="account" id="account">'

        + '<div class="account-avatar">MK</div>'

        + '<div class="account-info">'
        + '<strong>' + usuario.nombre + '</strong>'
        + '<span>' + usuario.rol + '</span>'
        + '</div>'

        + '<span class="account-arrow">⌄</span>'

        + '<div class="account-menu" id="accountMenu">'

        + '<div class="account-menu-header">'
        + '<div class="account-avatar large">MK</div>'
        + '<div>'
        + '<strong>' + usuario.nombre + '</strong>'
        + '<span>' + usuario.rol + '</span>'
        + '</div>'
        + '</div>'

        + '<hr>'

        + '<a href="#">Mi perfil</a>'
        + '<a href="#">Configuración</a>'

        + '<hr>'

        + '<button id="cerrarSesionMenu">Cerrar sesión</button>'

        + '</div>'

        + '</div>'

        + '</div>';

}


function construirTopbar(contenedor) {

    const item = itemActual();

    const titulo = item
        ? (item.titulo || item.texto)
        : "Panel principal";

    const claseExtra = contenedor.dataset.clase
        ? " " + contenedor.dataset.clase
        : "";

    let izquierda;

    if (contenedor.dataset.buscador) {

        izquierda = ''
            + '<div class="topbar-search">'
            + '<span class="search-icon">🔍</span>'
            + '<input type="text" id="'
            + (contenedor.dataset.buscadorId || "buscador")
            + '" placeholder="' + contenedor.dataset.buscador + '">'
            + '</div>';

    } else {

        izquierda = ''
            + '<div class="page-title">'
            + '<span class="breadcrumb">Transflow / ' + titulo + '</span>'
            + '<h2>' + titulo + '</h2>'
            + '</div>';

    }

    return ''
        + '<header class="topbar' + claseExtra + '">'
        + izquierda
        + bloqueCuenta()
        + '</header>';

}


// ---------------------------------------------------------
// COMPORTAMIENTO
// (antes vivia en index.js, repetido en cada pantalla)
// ---------------------------------------------------------

function activarMenuCuenta() {

    const account = document.getElementById("account");
    const accountMenu = document.getElementById("accountMenu");

    if (!account || !accountMenu) {
        return;
    }

    account.addEventListener("click", function () {
        accountMenu.classList.toggle("show");
    });

    document.addEventListener("click", function (evento) {

        if (!account.contains(evento.target)) {
            accountMenu.classList.remove("show");
        }

    });

}


function activarCerrarSesion() {

    function salir() {

        try {
            localStorage.removeItem("usuario");
            localStorage.removeItem("token");
        } catch (error) {
            console.warn("No se pudo limpiar la sesión:", error);
        }

        window.location.href = "login.html";

    }

    ["cerrarSesion", "cerrarSesionMenu"].forEach(function (id) {

        const boton = document.getElementById(id);

        if (boton) {
            boton.addEventListener("click", salir);
        }

    });

}


// ---------------------------------------------------------
// INICIALIZACION
//
// Se ejecuta en cuanto se carga el script (va al final del
// body, despues de los contenedores) para que el JS de cada
// modulo ya encuentre el topbar montado.
// ---------------------------------------------------------

function iniciarLayout() {

    const contenedorSidebar = document.getElementById("layout-sidebar");
    const contenedorTopbar = document.getElementById("layout-topbar");

    if (contenedorSidebar) {
        contenedorSidebar.outerHTML = construirSidebar();
    }

    if (contenedorTopbar) {
        contenedorTopbar.outerHTML = construirTopbar(contenedorTopbar);
    }

    const item = itemActual();

    if (item) {
        document.title = "Transflow | " + (item.titulo || item.texto);
    }

    activarMenuCuenta();
    activarCerrarSesion();

}


if (document.getElementById("layout-sidebar")) {
    iniciarLayout();
} else {
    document.addEventListener("DOMContentLoaded", iniciarLayout);
}
