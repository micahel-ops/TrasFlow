// =========================================================
// MODULO: VENTAS
// Depende de js/utils.js, js/modal.js y js/layout.js,
// que se cargan antes en el HTML.
// =========================================================

// =========================================
// DATOS DE ETAPAS
// (deben coincidir con los data-stage del HTML)
// =========================================

const ETAPAS = {
    lead: {
        label: "Lead calificado",
        badgeClass: "",
        kpiId: "kpi-lead"
    },
    diagnostico: {
        label: "Diagnóstico agendado",
        badgeClass: "",
        kpiId: null
    },
    propuesta: {
        label: "Propuesta enviada",
        badgeClass: "",
        kpiId: "kpi-propuesta"
    },
    revision: {
        label: "En revisión del cliente",
        badgeClass: "is-negociacion",
        kpiId: null
    },
    pago: {
        label: "Orden y pago pendiente",
        badgeClass: "is-negociacion",
        kpiId: "kpi-pago"
    },
    ganada: {
        label: "Venta cerrada - ganada",
        badgeClass: "is-ganada",
        kpiId: "kpi-ganada"
    },
    perdida: {
        label: "Perdida / cancelada",
        badgeClass: "is-perdida",
        kpiId: null
    }
};


// =========================================
// ELEMENTOS
// =========================================

const modalOverlay = document.getElementById("modalOverlay");
const btnNuevaOportunidad = document.getElementById("btnNuevaOportunidad");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const btnCancelarModal = document.getElementById("btnCancelarModal");
const formOportunidad = document.getElementById("formOportunidad");
const oppsCount = document.getElementById("opps-count");
const oppsTbody = document.getElementById("opps-tbody");


// =========================================
// ABRIR / CERRAR MODAL
// =========================================

const modal = crearModal({
    overlay: "modalOverlay",
    formulario: "formOportunidad",
    primerCampo: "campoCliente",
    abrirCon: ["btnNuevaOportunidad"],
    cerrarCon: ["btnCerrarModal", "btnCancelarModal"]
});


// Alias para el resto del modulo
const abrirModal = modal.abrir;
const cerrarModal = modal.cerrar;


// =========================================
// AGREGAR TARJETA AL PIPELINE
// =========================================

function agregarTarjetaPipeline(etapaKey, datos) {

    const columna = document.querySelector(
        '.pipeline-stage[data-stage="' + etapaKey + '"]'
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
        '<div class="pipeline-owner"></div>' +
        "</div>";

    tarjeta.querySelector("strong").textContent = datos.cliente;
    tarjeta.querySelector("span").textContent = datos.detalle;
    tarjeta.querySelector(".pipeline-amount").textContent = formatearMonto(datos.monto);
    tarjeta.querySelector(".pipeline-owner").textContent = obtenerIniciales(datos.propietario);

    columna.appendChild(tarjeta);

    const contador = document.getElementById("count-" + etapaKey);

    if (contador) {
        contador.textContent = String(Number(contador.textContent) + 1);
    }

}


// =========================================
// AGREGAR FILA A LA TABLA
// =========================================

function agregarFilaTabla(etapaKey, datos) {

    const etapa = ETAPAS[etapaKey];

    const fila = document.createElement("tr");

    fila.innerHTML =
        '<td class="opps-cliente"><strong></strong><span></span></td>' +
        "<td><span class=\"stage-badge\"></span></td>" +
        "<td></td>" +
        '<td><div class="opps-owner"><div class="opps-owner-avatar"></div><span class="opps-owner-name"></span></div></td>';

    fila.querySelector(".opps-cliente strong").textContent = datos.cliente;
    fila.querySelector(".opps-cliente span").textContent = datos.detalle;

    const badge = fila.querySelector(".stage-badge");
    badge.textContent = etapa.label;

    if (etapa.badgeClass) {
        badge.classList.add(etapa.badgeClass);
    }

    fila.children[2].textContent = formatearMonto(datos.monto);

    fila.querySelector(".opps-owner-avatar").textContent = obtenerIniciales(datos.propietario);
    fila.querySelector(".opps-owner-name").textContent = datos.propietario;

    oppsTbody.appendChild(fila);

}


// =========================================
// ACTUALIZAR KPI DE RESUMEN
// =========================================

function actualizarKpi(etapaKey) {

    const kpiId = ETAPAS[etapaKey].kpiId;

    if (!kpiId) {
        return;
    }

    const kpi = document.getElementById(kpiId);

    if (kpi) {
        kpi.textContent = String(Number(kpi.textContent) + 1);
    }

}


// =========================================
// ENVÍO DEL FORMULARIO
// =========================================

formOportunidad.addEventListener("submit", function (event) {

    event.preventDefault();

    const datos = {
        cliente: document.getElementById("campoCliente").value.trim(),
        detalle: document.getElementById("campoDetalle").value.trim(),
        monto: document.getElementById("campoMonto").value,
        propietario: document.getElementById("campoPropietario").value.trim()
    };

    const etapaKey = document.getElementById("campoEtapa").value;

    if (!datos.cliente || !datos.detalle || !datos.propietario) {
        return;
    }

    agregarTarjetaPipeline(etapaKey, datos);
    agregarFilaTabla(etapaKey, datos);
    actualizarKpi(etapaKey);

    oppsCount.textContent = String(Number(oppsCount.textContent) + 1);

    cerrarModal();

});