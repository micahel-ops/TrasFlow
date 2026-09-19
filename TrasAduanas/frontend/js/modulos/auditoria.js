// =========================================================
// MODULO: AUDITORIA
// Depende de js/utils.js, js/modal.js y js/layout.js,
// que se cargan antes en el HTML.
// =========================================================

// =========================================
// DATOS DE ESTADOS
// (deben coincidir con los data-stage del HTML)
// =========================================

const ESTADOS = {
    conforme: {
        label: "Conforme",
        badgeClass: "is-ganada",
        kpiId: "kpi-conforme"
    },
    observacion: {
        label: "Con observaciones",
        badgeClass: "is-negociacion",
        kpiId: "kpi-observacion"
    },
    noconforme: {
        label: "No conforme",
        badgeClass: "is-perdida",
        kpiId: "kpi-noconforme"
    }
};


// =========================================
// ELEMENTOS
// =========================================

const modalOverlay = document.getElementById("modalOverlay");
const btnNuevoExpediente = document.getElementById("btnNuevoExpediente");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const btnCancelarModal = document.getElementById("btnCancelarModal");
const formExpediente = document.getElementById("formExpediente");
const expedientesCount = document.getElementById("expedientes-count");
const expedientesTbody = document.getElementById("expedientes-tbody");
const kpiTotal = document.getElementById("kpi-total");


// =========================================
// ABRIR / CERRAR MODAL
// =========================================

const modal = crearModal({
    overlay: "modalOverlay",
    formulario: "formExpediente",
    primerCampo: "campoTipo",
    abrirCon: ["btnNuevoExpediente"],
    cerrarCon: ["btnCerrarModal", "btnCancelarModal"]
});


// Alias para el resto del modulo
const abrirModal = modal.abrir;
const cerrarModal = modal.cerrar;


// =========================================
// UTILIDADES


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

    tarjeta.querySelector("strong").textContent = datos.numeroExpediente;
    tarjeta.querySelector("span").textContent = datos.tipo + " · " + datos.cliente;
    tarjeta.querySelector(".pipeline-amount").textContent = datos.responsable;

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
        "<td><span class=\"stage-badge\"></span></td>" +
        "<td></td>" +
        "<td></td>";

    fila.children[0].textContent = datos.numeroExpediente;
    fila.children[1].textContent = datos.tipo;
    fila.children[2].textContent = datos.cliente;

    const badge = fila.querySelector(".stage-badge");
    badge.textContent = estado.label;
    badge.classList.add(estado.badgeClass);

    fila.children[4].textContent = datos.fecha;
    fila.children[5].textContent = datos.responsable;

    expedientesTbody.prepend(fila);

}


// =========================================
// ACTUALIZAR KPI DE RESUMEN
// =========================================

function actualizarKpi(estadoKey) {

    const kpiId = ESTADOS[estadoKey].kpiId;

    const kpi = document.getElementById(kpiId);

    if (kpi) {
        kpi.textContent = String(Number(kpi.textContent) + 1);
    }

    if (kpiTotal) {
        kpiTotal.textContent = String(Number(kpiTotal.textContent) + 1);
    }

}


// =========================================
// ENVÍO DEL FORMULARIO
// =========================================

formExpediente.addEventListener("submit", function (event) {

    event.preventDefault();

    const tipo = document.getElementById("campoTipo").value;
    const fecha = document.getElementById("campoFecha").value;
    const cliente = document.getElementById("campoCliente").value.trim();
    const responsable = document.getElementById("campoResponsable").value.trim();
    const estadoKey = document.getElementById("campoEstado").value;

    if (!cliente || !responsable || !fecha) {
        return;
    }

    const datos = {
        numeroExpediente: generarNumeroExpediente(),
        tipo: tipo,
        cliente: cliente,
        responsable: responsable,
        fecha: formatearFecha(fecha)
    };

    agregarTarjetaPipeline(estadoKey, datos);
    agregarFilaTabla(estadoKey, datos);
    actualizarKpi(estadoKey);

    expedientesCount.textContent = String(Number(expedientesCount.textContent) + 1);

    cerrarModal();

});