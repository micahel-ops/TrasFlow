// =========================================================
// MODULO: ALMACEN
// Depende de js/utils.js, js/modal.js y js/layout.js,
// que se cargan antes en el HTML.
// =========================================================

const TIPOS = {
    entrada: {
        label: "Entrada",
        badgeClass: "is-entrada"
    },
    salida: {
        label: "Salida",
        badgeClass: "is-salida"
    },
    picking: {
        label: "Picking",
        badgeClass: ""
    },
    empaque: {
        label: "Empaque",
        badgeClass: ""
    },
    ajuste: {
        label: "Ajuste",
        badgeClass: ""
    }
};

const modalOverlay = document.getElementById("modalOverlay");
const btnRegistrarMovimiento = document.getElementById("btnRegistrarMovimiento");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const btnCancelarModal = document.getElementById("btnCancelarModal");
const formMovimiento = document.getElementById("formMovimiento");
const movimientosTbody = document.getElementById("movimientos-tbody");

const modal = crearModal({
    overlay: "modalOverlay",
    formulario: "formMovimiento",
    primerCampo: "campoTipo",
    abrirCon: ["btnRegistrarMovimiento"],
    cerrarCon: ["btnCerrarModal", "btnCancelarModal"]
});


// Alias para el resto del modulo
const abrirModal = modal.abrir;
const cerrarModal = modal.cerrar;


function obtenerFechaHoraActual() {

    const ahora = new Date();

    const dos = function (numero) {
        return String(numero).padStart(2, "0");
    };

    const fecha = dos(ahora.getDate()) + "/" + dos(ahora.getMonth() + 1) + "/" + ahora.getFullYear();
    const hora = dos(ahora.getHours()) + ":" + dos(ahora.getMinutes());

    return fecha + " " + hora;

}
function agregarFilaMovimiento(tipoKey, datos) {

    const tipo = TIPOS[tipoKey];

    const fila = document.createElement("tr");

    fila.innerHTML =
        "<td></td>" +
        "<td><span class=\"stage-badge\"></span></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td><span class=\"stage-badge is-ganada\">Completado</span></td>";

    fila.children[0].textContent = obtenerFechaHoraActual();

    const badgeTipo = fila.querySelector(".stage-badge");
    badgeTipo.textContent = tipo.label;

    if (tipo.badgeClass) {
        badgeTipo.classList.add(tipo.badgeClass);
    }

    fila.children[2].textContent = datos.producto;
    fila.children[3].textContent = datos.codigo;
    fila.children[4].textContent = datos.ubicacion;
    fila.children[5].textContent = datos.cantidad;
    fila.children[6].textContent = datos.usuario;

    movimientosTbody.prepend(fila);

}

formMovimiento.addEventListener("submit", function (event) {

    event.preventDefault();

    const tipoKey = document.getElementById("campoTipo").value;

    const datos = {
        cantidad: document.getElementById("campoCantidad").value,
        producto: document.getElementById("campoProducto").value.trim(),
        codigo: document.getElementById("campoCodigo").value.trim(),
        ubicacion: document.getElementById("campoUbicacion").value.trim(),
        usuario: document.getElementById("campoUsuario").value.trim()
    };

    if (!datos.producto || !datos.codigo || !datos.ubicacion || !datos.usuario) {
        return;
    }

    agregarFilaMovimiento(tipoKey, datos);

    cerrarModal();

});