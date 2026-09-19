// =========================================================
// MODULO: PRODUCCION
// Depende de js/utils.js, js/modal.js y js/layout.js,
// que se cargan antes en el HTML.
// =========================================================

// =========================================
// DATOS DE ETAPAS
// (deben coincidir con los data-stage del HTML)
// =========================================

const ETAPAS = {
    pendiente: {
        label: "Pendiente de inicio",
        badgeClass: "",
        kpiId: null
    },
    proceso: {
        label: "En proceso",
        badgeClass: "is-negociacion",
        kpiId: "kpi-proceso"
    },
    completada: {
        label: "Completada",
        badgeClass: "is-ganada",
        kpiId: "kpi-completada"
    },
    rechazada: {
        label: "Rechazada",
        badgeClass: "is-perdida",
        kpiId: "kpi-rechazada"
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
const ordenesCount = document.getElementById("ordenes-count");
const ordenesTbody = document.getElementById("ordenes-tbody");
const kpiTotal = document.getElementById("kpi-total");


// =========================================
// ABRIR / CERRAR MODAL
// =========================================

const modal = crearModal({
    overlay: "modalOverlay",
    formulario: "formOrden",
    primerCampo: "campoProducto",
    abrirCon: ["btnNuevaOrden"],
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
        '<div class="pipeline-owner">TF</div>' +
        "</div>";

    tarjeta.querySelector("strong").textContent = datos.numeroOrden;
    tarjeta.querySelector("span").textContent = datos.producto + " · " + datos.lote;
    tarjeta.querySelector(".pipeline-amount").textContent = datos.cantidad + " uds.";

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
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td><span class=\"stage-badge\"></span></td>";

    fila.children[0].textContent = datos.numeroOrden;
    fila.children[1].textContent = datos.producto;
    fila.children[2].textContent = datos.lote;
    fila.children[3].textContent = datos.cantidad;
    fila.children[4].textContent = datos.inicio;
    fila.children[5].textContent = datos.fin;

    const badge = fila.querySelector(".stage-badge");
    badge.textContent = etapa.label;

    if (etapa.badgeClass) {
        badge.classList.add(etapa.badgeClass);
    }

    ordenesTbody.prepend(fila);

}


// =========================================
// ACTUALIZAR KPI DE RESUMEN
// =========================================

function actualizarKpi(etapaKey) {

    const kpiId = ETAPAS[etapaKey].kpiId;

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

    const producto = document.getElementById("campoProducto").value.trim();
    const lote = document.getElementById("campoLote").value.trim();
    const cantidad = document.getElementById("campoCantidad").value;
    const inicio = document.getElementById("campoInicio").value;
    const fin = document.getElementById("campoFin").value;
    const etapaKey = document.getElementById("campoEtapa").value;

    if (!producto || !lote || !cantidad) {
        return;
    }

    const datos = {
        numeroOrden: generarNumeroOrden(),
        producto: producto,
        lote: lote,
        cantidad: cantidad,
        inicio: formatearFecha(inicio),
        fin: formatearFecha(fin)
    };

    agregarTarjetaPipeline(etapaKey, datos);
    agregarFilaTabla(etapaKey, datos);
    actualizarKpi(etapaKey);

    ordenesCount.textContent = String(Number(ordenesCount.textContent) + 1);

    cerrarModal();

});