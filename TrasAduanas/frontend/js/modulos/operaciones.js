// =========================================================
// MODULO: OPERACIONES
// Depende de js/utils.js, js/modal.js y js/layout.js,
// que se cargan antes en el HTML.
// =========================================================

// =========================================
// DATOS DE ESTADOS
// (deben coincidir con los data-stage del HTML)
// =========================================

const ESTADOS = {
    pendiente: {
        label: "Pendiente",
        badgeClass: "",
        fillClass: "",
        kpiId: null
    },
    programada: {
        label: "Programada",
        badgeClass: "is-programada",
        fillClass: "",
        kpiId: null
    },
    ejecucion: {
        label: "En ejecución",
        badgeClass: "is-negociacion",
        fillClass: "",
        kpiId: "kpi-ejecucion"
    },
    incidencia: {
        label: "Con incidencia",
        badgeClass: "is-perdida",
        fillClass: "is-perdida",
        kpiId: "kpi-incidencia"
    },
    finalizada: {
        label: "Finalizada",
        badgeClass: "is-ganada",
        fillClass: "is-ganada",
        kpiId: "kpi-finalizada"
    }
};


// =========================================
// ELEMENTOS
// =========================================

const modalOverlay = document.getElementById("modalOverlay");
const btnNuevaOrden = document.getElementById("btnNuevaOrden");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const btnCancelarModal = document.getElementById("btnCancelarModal");
const formOrden = document.getElementById("formOrden");
const otCount = document.getElementById("ot-count");
const ordenesTbody = document.getElementById("ordenes-tbody");
const kpiTotal = document.getElementById("kpi-total");


// =========================================
// ABRIR / CERRAR MODAL
// =========================================

const modal = crearModal({
    overlay: "modalOverlay",
    formulario: "formOrden",
    primerCampo: "campoCliente",
    abrirCon: ["btnNuevaOrden"],
    cerrarCon: ["btnCerrarModal", "btnCancelarModal"]
});


// Alias para el resto del modulo
const abrirModal = modal.abrir;
const cerrarModal = modal.cerrar;


// =========================================
// UTILIDADES
// =========================================

function generarNumeroOT() {

    const aleatorio = Math.floor(1000 + Math.random() * 9000);

    return "OT-00" + aleatorio;

}


function formatearFechaHora(valorInput) {

    if (!valorInput) {
        return "-";
    }

    const [fecha, hora] = valorInput.split("T");
    const [anio, mes, dia] = fecha.split("-");

    return dia + "/" + mes + "/" + anio + (hora ? " " + hora : "");

}


// =========================================
// AGREGAR TARJETA AL PIPELINE
// =========================================

function agregarTarjetaPipeline(estadoKey, datos) {

    const columna = document.querySelector(
        '.pipeline-stage[data-stage="' + estadoKey + '"]'
    );

    if (!columna) {
        return;
    }

    const tarjeta = document.createElement("div");
    tarjeta.className = "pipeline-card";

    tarjeta.innerHTML =
        "<strong></strong>" +
        "<span></span>" +
        '<div class="pipeline-card-foot">' +
        '<span class="pipeline-amount"></span>' +
        '<div class="pipeline-owner">TF</div>' +
        "</div>";

    tarjeta.querySelector("strong").textContent = datos.numeroOT;
    tarjeta.querySelector("span").textContent = datos.cliente + " · " + datos.servicio;
    tarjeta.querySelector(".pipeline-amount").textContent = datos.progreso + "%";

    columna.appendChild(tarjeta);

    const contador = document.getElementById("count-" + estadoKey);

    if (contador) {
        contador.textContent = String(Number(contador.textContent) + 1);
    }

}


// =========================================
// AGREGAR FILA A LA TABLA
// =========================================

function agregarFilaTabla(estadoKey, datos) {

    const estado = ESTADOS[estadoKey];

    const fila = document.createElement("tr");

    fila.innerHTML =
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td><span class=\"stage-badge\"></span></td>" +
        '<td><div class="progress-wrap">' +
        '<div class="progress-track"><div class="progress-fill"></div></div>' +
        '<span class="progress-label"></span>' +
        "</div></td>";

    fila.children[0].textContent = datos.numeroOT;
    fila.children[1].textContent = datos.cliente;
    fila.children[2].textContent = datos.servicio;
    fila.children[3].textContent = datos.fecha;

    const badge = fila.querySelector(".stage-badge");
    badge.textContent = estado.label;

    if (estado.badgeClass) {
        badge.classList.add(estado.badgeClass);
    }

    const relleno = fila.querySelector(".progress-fill");
    relleno.style.width = datos.progreso + "%";

    if (estado.fillClass) {
        relleno.classList.add(estado.fillClass);
    }

    fila.querySelector(".progress-label").textContent = datos.progreso + "%";

    ordenesTbody.prepend(fila);

}


// =========================================
// ACTUALIZAR KPI DE RESUMEN
// =========================================

function actualizarKpi(estadoKey) {

    const kpiId = ESTADOS[estadoKey].kpiId;

    if (kpiId) {

        const kpi = document.getElementById(kpiId);

        if (kpi) {
            kpi.textContent = String(Number(kpi.textContent) + 1);
        }

    }

    if (kpiTotal) {
        kpiTotal.textContent = String(Number(kpiTotal.textContent) + 1);
    }

}


// =========================================
// ENVÍO DEL FORMULARIO
// =========================================

formOrden.addEventListener("submit", function (event) {

    event.preventDefault();

    const cliente = document.getElementById("campoCliente").value.trim();
    const servicio = document.getElementById("campoServicio").value.trim();
    const fecha = document.getElementById("campoFecha").value;
    const progreso = document.getElementById("campoProgreso").value || "0";
    const estadoKey = document.getElementById("campoEstado").value;

    if (!cliente || !servicio || !fecha) {
        return;
    }

    const datos = {
        numeroOT: generarNumeroOT(),
        cliente: cliente,
        servicio: servicio,
        fecha: formatearFechaHora(fecha),
        progreso: progreso
    };

    agregarTarjetaPipeline(estadoKey, datos);
    agregarFilaTabla(estadoKey, datos);
    actualizarKpi(estadoKey);

    otCount.textContent = String(Number(otCount.textContent) + 1);

    cerrarModal();

});