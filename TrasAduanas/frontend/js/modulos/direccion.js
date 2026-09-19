// =========================================================
// MODULO: DIRECCION
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
        kpiId: "count-pendiente"
    },
    proceso: {
        label: "En ejecución",
        badgeClass: "is-negociacion",
        fillClass: "",
        kpiId: "count-proceso"
    },
    revision: {
        label: "En revisión",
        badgeClass: "is-programada",
        fillClass: "",
        kpiId: "count-revision"
    },
    completada: {
        label: "Completada",
        badgeClass: "is-ganada",
        fillClass: "is-ganada",
        kpiId: "count-completada"
    }
};


// =========================================
// ELEMENTOS
// =========================================

const modalOverlay = document.getElementById("modalOverlay");
const btnNuevaIniciativa = document.getElementById("btnNuevaIniciativa");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const btnCancelarModal = document.getElementById("btnCancelarModal");
const formIniciativa = document.getElementById("formIniciativa");
const iniciativasCount = document.getElementById("iniciativas-count");
const iniciativasTbody = document.getElementById("iniciativas-tbody");
const kpiProyectos = document.getElementById("kpi-proyectos");


// =========================================
// ABRIR / CERRAR MODAL
// =========================================

const modal = crearModal({
    overlay: "modalOverlay",
    formulario: "formIniciativa",
    primerCampo: "campoProyecto",
    abrirCon: ["btnNuevaIniciativa"],
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

    tarjeta.querySelector("strong").textContent = datos.proyecto;
    tarjeta.querySelector("span").textContent = datos.responsable;
    tarjeta.querySelector(".pipeline-amount").textContent = datos.avance + "%";

    columna.appendChild(tarjeta);

    const contadorId = ESTADOS[estadoKey].kpiId;
    const contador = document.getElementById(contadorId);

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
        "<td><span class=\"stage-badge\"></span></td>" +
        '<td><div class="progress-wrap">' +
        '<div class="progress-track"><div class="progress-fill"></div></div>' +
        '<span class="progress-label"></span>' +
        "</div></td>" +
        "<td></td>";

    fila.children[0].textContent = datos.proyecto;
    fila.children[1].textContent = datos.responsable;

    const badge = fila.querySelector(".stage-badge");
    badge.textContent = estado.label;

    if (estado.badgeClass) {
        badge.classList.add(estado.badgeClass);
    }

    const relleno = fila.querySelector(".progress-fill");
    relleno.style.width = datos.avance + "%";

    if (estado.fillClass) {
        relleno.classList.add(estado.fillClass);
    }

    fila.querySelector(".progress-label").textContent = datos.avance + "%";

    fila.children[4].textContent = datos.fecha;

    iniciativasTbody.prepend(fila);

}


// =========================================
// ENVÍO DEL FORMULARIO
// =========================================

formIniciativa.addEventListener("submit", function (event) {

    event.preventDefault();

    const proyecto = document.getElementById("campoProyecto").value.trim();
    const responsable = document.getElementById("campoResponsable").value.trim();
    const avance = document.getElementById("campoAvance").value || "0";
    const fecha = document.getElementById("campoFecha").value;
    const estadoKey = document.getElementById("campoEstado").value;

    if (!proyecto || !responsable || !fecha) {
        return;
    }

    const datos = {
        proyecto: proyecto,
        responsable: responsable,
        avance: avance,
        fecha: formatearFecha(fecha)
    };

    agregarTarjetaPipeline(estadoKey, datos);
    agregarFilaTabla(estadoKey, datos);

    iniciativasCount.textContent = String(Number(iniciativasCount.textContent) + 1);

    if (kpiProyectos) {
        kpiProyectos.textContent = String(Number(kpiProyectos.textContent) + 1);
    }

    cerrarModal();

});