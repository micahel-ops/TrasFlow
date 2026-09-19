// =========================================================
// MODULO: LOGISTICA
// Depende de js/utils.js, js/modal.js y js/layout.js,
// que se cargan antes en el HTML.
// =========================================================

// =========================================
// DATOS DE ETAPAS
// (deben coincidir con los data-stage del HTML)
// =========================================

const ETAPAS = {
    almacen: {
        label: "Listo en almacén",
        badgeClass: "",
        kpiId: null
    },
    asignado: {
        label: "Unidad asignada / ruta optimizada",
        badgeClass: "",
        kpiId: null
    },
    transito: {
        label: "En tránsito",
        badgeClass: "is-negociacion",
        kpiId: "kpi-transito"
    },
    espera: {
        label: "En espera",
        badgeClass: "",
        kpiId: "kpi-espera"
    },
    incidencia: {
        label: "Con incidencia",
        badgeClass: "is-perdida",
        kpiId: "kpi-incidencia"
    },
    entregado: {
        label: "Entregado",
        badgeClass: "is-ganada",
        kpiId: "kpi-entregado"
    }
};


// =========================================
// ELEMENTOS
// =========================================

const modalOverlay = document.getElementById("modalOverlay");
const btnNuevoEnvio = document.getElementById("btnNuevoEnvio");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const btnCancelarModal = document.getElementById("btnCancelarModal");
const formEnvio = document.getElementById("formEnvio");
const enviosCount = document.getElementById("envios-count");
const enviosTbody = document.getElementById("envios-tbody");
const kpiTotal = document.getElementById("kpi-total");


// =========================================
// ABRIR / CERRAR MODAL
// =========================================

const modal = crearModal({
    overlay: "modalOverlay",
    formulario: "formEnvio",
    primerCampo: "campoCliente",
    abrirCon: ["btnNuevoEnvio"],
    cerrarCon: ["btnCerrarModal", "btnCancelarModal"]
});


// Alias para el resto del modulo
const abrirModal = modal.abrir;
const cerrarModal = modal.cerrar;


// =========================================
// UTILIDADES


function generarNumeroEnvio() {

    const aleatorio = Math.floor(1000 + Math.random() * 9000);

    return "AF-00" + aleatorio;

}


function generarTrackingId(transportista) {

    const iniciales = obtenerIniciales(transportista || "TF");

    const aleatorio = Math.floor(100000000 + Math.random() * 899999999);

    return iniciales + aleatorio;

}


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

    tarjeta.querySelector("strong").textContent = datos.numeroEnvio;
    tarjeta.querySelector("span").textContent = datos.cliente + " · " + datos.destino;
    tarjeta.querySelector(".pipeline-amount").textContent = datos.tipo;
    tarjeta.querySelector(".pipeline-owner").textContent = obtenerIniciales(datos.transportista);

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
        "<td></td>" +
        "<td></td>" +
        "<td><span class=\"stage-badge\"></span></td>" +
        "<td></td>";

    fila.querySelector(".opps-cliente strong").textContent = datos.cliente;
    fila.querySelector(".opps-cliente span").textContent = datos.destino;

    fila.children[1].textContent = datos.tipo;
    fila.children[2].textContent = datos.transportista;

    const badge = fila.querySelector(".stage-badge");
    badge.textContent = etapa.label;

    if (etapa.badgeClass) {
        badge.classList.add(etapa.badgeClass);
    }

    fila.children[4].textContent = datos.trackingId;

    enviosTbody.appendChild(fila);

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

formEnvio.addEventListener("submit", function (event) {

    event.preventDefault();

    const cliente = document.getElementById("campoCliente").value.trim();
    const destino = document.getElementById("campoDestino").value.trim();
    const transportista = document.getElementById("campoTransportista").value.trim();
    const tipo = document.getElementById("campoTipo").value;
    const etapaKey = document.getElementById("campoEtapa").value;

    if (!cliente || !destino || !transportista) {
        return;
    }

    const datos = {
        cliente: cliente,
        destino: destino,
        transportista: transportista,
        tipo: tipo,
        numeroEnvio: generarNumeroEnvio(),
        trackingId: generarTrackingId(transportista)
    };

    agregarTarjetaPipeline(etapaKey, datos);
    agregarFilaTabla(etapaKey, datos);
    actualizarKpi(etapaKey);

    enviosCount.textContent = String(Number(enviosCount.textContent) + 1);

    cerrarModal();

});