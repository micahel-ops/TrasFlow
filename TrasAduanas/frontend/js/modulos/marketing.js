// =========================================================
// MODULO: MARKETING
// Depende de js/utils.js, js/modal.js y js/layout.js,
// que se cargan antes en el HTML.
// =========================================================

// =========================================
// DATOS: estado en memoria + localStorage
// =========================================

const STORAGE_KEY = "transflow_marketing_campanas";
const ACTIVITY_KEY = "transflow_marketing_actividades";
const PAGE_SIZE = 6;

// Línea base "mes anterior" para poder calcular tendencias reales
// a medida que se agregan o modifican campañas.
const BASE_ANTERIOR = {
    activas: 3,
    leads: 975,
    calificados: 231,
    conversion: 19
};

const CANAL_LOGOS = {
    "Google Ads": "G",
    "LinkedIn": "in",
    "Email": "✉",
    "Facebook Ads": "f",
    "Landing Page": "🔗",
    "Instagram": "📷"
};

const CAMPANAS_SEMILLA = [
    { id: "c1", nombre: "Importación Express LATAM", canal: "Google Ads", fechaInicio: "2025-04-01", fechaFin: "2025-04-30", leads: 342, calificados: 96, estado: "activa", propietario: "María Pérez" },
    { id: "c2", nombre: "Conecta con Transflow", canal: "LinkedIn", fechaInicio: "2025-04-05", fechaFin: "2025-04-25", leads: 218, calificados: 64, estado: "activa", propietario: "Carlos Gómez" },
    { id: "c3", nombre: "Newsletter Exportación", canal: "Email", fechaInicio: "2025-04-10", fechaFin: "2025-04-30", leads: 156, calificados: 42, estado: "activa", propietario: "Laura Peña" },
    { id: "c4", nombre: "Servicios Aduaneros", canal: "Facebook Ads", fechaInicio: "2025-04-12", fechaFin: "2025-04-28", leads: 104, calificados: 28, estado: "pausada", propietario: "José Martínez" },
    { id: "c5", nombre: "Descarga Guía de Comercio", canal: "Landing Page", fechaInicio: "2025-04-15", fechaFin: "2025-04-30", leads: 98, calificados: 26, estado: "activa", propietario: "Rocío Vargas" },
    { id: "c6", nombre: "Casos de Éxito", canal: "Instagram", fechaInicio: "2025-04-18", fechaFin: "2025-04-30", leads: 76, calificados: 18, estado: "finalizada", propietario: "María Pérez" }
];

const ACTIVIDADES_SEMILLA = [
    { icono: "＋", titulo: "Nueva campaña creada", detalle: "Conecta con Transflow", tiempo: "hace 2 horas" },
    { icono: "✓", titulo: "Lead calificado", detalle: "Empresa Global SAC", tiempo: "hace 4 horas" },
    { icono: "‖", titulo: "Campaña pausada", detalle: "Servicios Aduaneros", tiempo: "hace 6 horas" },
    { icono: "👤", titulo: "Nuevo lead registrado", detalle: "Carlos López · Importaciones Perú", tiempo: "hace 8 horas" }
];

let campanas = cargar(STORAGE_KEY, CAMPANAS_SEMILLA);
let actividades = cargar(ACTIVITY_KEY, ACTIVIDADES_SEMILLA);
let paginaActual = 1;
let filtroEstadoActual = "todas";


function cargar(clave, semilla) {
    try {
        const guardado = localStorage.getItem(clave);
        if (guardado) return JSON.parse(guardado);
    } catch (e) {
        console.warn("No se pudo leer localStorage:", e);
    }
    return semilla;
}

function guardar() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(campanas));
        localStorage.setItem(ACTIVITY_KEY, JSON.stringify(actividades));
    } catch (e) {
        console.warn("No se pudo escribir en localStorage:", e);
    }
}


// =========================================
// UTILIDADES
// =========================================

function formatearFecha(iso) {
    if (!iso) return "—";
    const [anio, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${anio}`;
}

function iniciales(nombre) {
    return nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(p => p[0].toUpperCase())
        .join("");
}

function logoCanal(canal) {
    return CANAL_LOGOS[canal] || canal.charAt(0).toUpperCase();
}

function etiquetaEstado(estado) {
    return { activa: "Activa", pausada: "Pausada", finalizada: "Finalizada" }[estado] || estado;
}


// =========================================
// RENDER: TABLA + PAGINACIÓN
// =========================================

function campanasFiltradas() {
    if (filtroEstadoActual === "todas") return campanas;
    return campanas.filter(c => c.estado === filtroEstadoActual);
}

function renderTabla() {
    const datos = campanasFiltradas();
    const totalPaginas = Math.max(1, Math.ceil(datos.length / PAGE_SIZE));

    if (paginaActual > totalPaginas) paginaActual = totalPaginas;

    const inicio = (paginaActual - 1) * PAGE_SIZE;
    const pagina = datos.slice(inicio, inicio + PAGE_SIZE);

    const tbody = document.getElementById("tablaCampanasBody");

    if (pagina.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="empty-state">No hay campañas que coincidan con este filtro.</td></tr>`;
    } else {
        tbody.innerHTML = pagina.map(c => `
            <tr>
                <td>
                    <div class="campaign-name">
                        <span class="campaign-logo">${logoCanal(c.canal)}</span>
                        ${c.nombre}
                    </div>
                </td>
                <td><span class="channel-tag">${c.canal}</span></td>
                <td>${formatearFecha(c.fechaInicio)}</td>
                <td>${formatearFecha(c.fechaFin)}</td>
                <td>${c.leads}</td>
                <td>${c.calificados}</td>
                <td><span class="status-pill ${c.estado}">${etiquetaEstado(c.estado)}</span></td>
                <td>
                    <div class="owner-cell">
                        <span class="owner-avatar">${iniciales(c.propietario)}</span>
                        <div>${c.propietario}<span>Marketing</span></div>
                    </div>
                </td>
                <td class="row-actions-wrap">
                    <button class="row-actions" onclick="toggleMenuFila('${c.id}', event)">⋯</button>
                    <div class="row-menu" id="menu-${c.id}">
                        <button onclick="eliminarCampana('${c.id}')" class="danger">Eliminar</button>
                    </div>
                </td>
            </tr>
        `).join("");
    }

    // pie de tabla
    const desde = datos.length === 0 ? 0 : inicio + 1;
    const hasta = Math.min(inicio + PAGE_SIZE, datos.length);
    document.getElementById("paginacionInfo").textContent =
        `Mostrando ${desde} - ${hasta} de ${datos.length} campañas`;

    const botones = document.getElementById("paginacionBotones");
    let html = `<button class="page-btn" ${paginaActual === 1 ? "disabled" : ""} onclick="cambiarPagina(${paginaActual - 1})">‹</button>`;
    for (let p = 1; p <= totalPaginas; p++) {
        html += `<button class="page-btn ${p === paginaActual ? "active" : ""}" onclick="cambiarPagina(${p})">${p}</button>`;
    }
    html += `<button class="page-btn" ${paginaActual === totalPaginas ? "disabled" : ""} onclick="cambiarPagina(${paginaActual + 1})">›</button>`;
    botones.innerHTML = html;
}

function cambiarPagina(p) {
    paginaActual = p;
    renderTabla();
}

function toggleMenuFila(id, evento) {
    evento.stopPropagation();
    document.querySelectorAll(".row-menu.show").forEach(m => {
        if (m.id !== `menu-${id}`) m.classList.remove("show");
    });
    document.getElementById(`menu-${id}`).classList.toggle("show");
}

document.addEventListener("click", () => {
    document.querySelectorAll(".row-menu.show").forEach(m => m.classList.remove("show"));
});

function eliminarCampana(id) {
    campanas = campanas.filter(c => c.id !== id);
    guardar();
    renderTodo();
}


// =========================================
// RENDER: TARJETAS DE ESTADÍSTICAS
// =========================================

function formatearTendencia(actual, anterior, esPorcentaje) {
    const diff = actual - anterior;
    const signo = diff >= 0 ? "↑" : "↓";
    const valor = esPorcentaje ? `${Math.abs(diff)}%` : Math.abs(diff);
    return `${signo} ${valor} vs. mes anterior`;
}

function renderEstadisticas() {
    const activas = campanas.filter(c => c.estado === "activa").length;
    const totalLeads = campanas.reduce((sum, c) => sum + Number(c.leads || 0), 0);
    const totalCalificados = campanas.reduce((sum, c) => sum + Number(c.calificados || 0), 0);
    const conversion = totalLeads > 0 ? Math.round((totalCalificados / totalLeads) * 100) : 0;

    document.getElementById("statActivas").textContent = activas;
    document.getElementById("statLeads").textContent = totalLeads.toLocaleString("es-PE");
    document.getElementById("statCalificados").textContent = totalCalificados.toLocaleString("es-PE");
    document.getElementById("statConversion").textContent = `${conversion}%`;

    document.getElementById("statActivasTrend").textContent = formatearTendencia(activas, BASE_ANTERIOR.activas, false);
    document.getElementById("statLeadsTrend").textContent = formatearTendencia(totalLeads, BASE_ANTERIOR.leads, false);
    document.getElementById("statCalificadosTrend").textContent = formatearTendencia(totalCalificados, BASE_ANTERIOR.calificados, false);
    document.getElementById("statConversionTrend").textContent = formatearTendencia(conversion, BASE_ANTERIOR.conversion, true);

    return { activas, totalLeads, totalCalificados, conversion };
}


// =========================================
// RENDER: DONA DE ESTADO
// =========================================

function renderDona() {
    const total = campanas.length;
    const activas = campanas.filter(c => c.estado === "activa").length;
    const pausadas = campanas.filter(c => c.estado === "pausada").length;
    const finalizadas = campanas.filter(c => c.estado === "finalizada").length;

    const pctActivas = total > 0 ? (activas / total) * 100 : 0;
    const pctPausadas = total > 0 ? (pausadas / total) * 100 : 0;
    const pctFinalizadas = total > 0 ? (finalizadas / total) * 100 : 0;

    const donutActivas = document.getElementById("donutActivas");
    const donutPausadas = document.getElementById("donutPausadas");

    donutActivas.setAttribute("stroke-dasharray", `${pctActivas} 100`);
    donutActivas.setAttribute("stroke-dashoffset", "25");

    donutPausadas.setAttribute("stroke-dasharray", `${pctPausadas} 100`);
    donutPausadas.setAttribute("stroke-dashoffset", `${25 - pctActivas}`);

    document.getElementById("donutTotal").textContent = total;
    document.getElementById("donutActivasValor").textContent = `${activas} (${Math.round(pctActivas)}%)`;
    document.getElementById("donutPausadasValor").textContent = `${pausadas} (${Math.round(pctPausadas)}%)`;
    document.getElementById("donutFinalizadasValor").textContent = `${finalizadas} (${Math.round(pctFinalizadas)}%)`;
}


// =========================================
// RENDER: GRÁFICO DE LÍNEAS
// =========================================

function renderLineChart() {
    const ordenadas = [...campanas].sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));

    const leadsLinea = document.getElementById("lineaLeads");
    const calificadosLinea = document.getElementById("lineaCalificados");
    const ejeX = document.getElementById("etiquetasEjeX");

    if (ordenadas.length === 0) {
        leadsLinea.setAttribute("points", "");
        calificadosLinea.setAttribute("points", "");
        ejeX.innerHTML = "";
        return;
    }

    // acumulado de leads y calificados en el orden de inicio de campaña
    let acumLeads = 0;
    let acumCalificados = 0;
    const puntos = ordenadas.map(c => {
        acumLeads += Number(c.leads || 0);
        acumCalificados += Number(c.calificados || 0);
        return { leads: acumLeads, calificados: acumCalificados, nombre: c.nombre };
    });

    const maxValor = Math.max(...puntos.map(p => p.leads), 1);

    const left = 10, right = 310, top = 20, bottom = 130;
    const n = puntos.length;

    const x = i => n === 1 ? (left + right) / 2 : left + (i * (right - left)) / (n - 1);
    const y = valor => bottom - (valor / maxValor) * (bottom - top);

    const leadsPuntos = puntos.map((p, i) => `${x(i)},${y(p.leads)}`).join(" ");
    const calificadosPuntos = puntos.map((p, i) => `${x(i)},${y(p.calificados)}`).join(" ");

    leadsLinea.setAttribute("points", leadsPuntos);
    calificadosLinea.setAttribute("points", calificadosPuntos);

    // etiquetas de eje x: primera, del medio y última campaña
    const indicesEtiqueta = n === 1 ? [0] : [0, Math.floor((n - 1) / 2), n - 1];
    const vistos = new Set();
    let svgLabels = "";
    indicesEtiqueta.forEach(i => {
        if (vistos.has(i)) return;
        vistos.add(i);
        const fecha = ordenadas[i].fechaInicio.slice(5).split("-").reverse().join("/");
        svgLabels += `<text x="${x(i)}" y="145" class="axis-label" text-anchor="middle">${fecha}</text>`;
    });
    ejeX.innerHTML = svgLabels;
}


// =========================================
// RENDER: ACTIVIDAD RECIENTE
// =========================================

function renderActividades() {
    const lista = document.getElementById("listaActividades");
    lista.innerHTML = actividades.slice(0, 6).map(a => `
        <li class="activity-item">
            <div class="activity-icon">${a.icono}</div>
            <div class="activity-body">
                <div>
                    <strong>${a.titulo}</strong>
                    <p>${a.detalle}</p>
                </div>
                <span class="activity-time">${a.tiempo}</span>
            </div>
        </li>
    `).join("");
}

function agregarActividad(icono, titulo, detalle) {
    actividades.unshift({ icono, titulo, detalle, tiempo: "justo ahora" });
    actividades = actividades.slice(0, 12);
}


// =========================================
// RENDER GENERAL
// =========================================

function renderTodo() {
    renderTabla();
    renderEstadisticas();
    renderDona();
    renderLineChart();
    renderActividades();
}


// =========================================
// FILTRO POR ESTADO
// =========================================

document.getElementById("filtroEstado").addEventListener("change", function () {
    filtroEstadoActual = this.value;
    paginaActual = 1;
    renderTabla();
});


// =========================================
// BÚSQUEDA
// =========================================

document.getElementById("buscadorCampanas").addEventListener("input", function () {
    const termino = this.value.trim().toLowerCase();

    if (!termino) {
        renderTabla();
        return;
    }

    const coincidencias = campanasFiltradas().filter(c =>
        c.nombre.toLowerCase().includes(termino) ||
        c.canal.toLowerCase().includes(termino) ||
        c.propietario.toLowerCase().includes(termino)
    );

    const tbody = document.getElementById("tablaCampanasBody");
    if (coincidencias.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="empty-state">No se encontraron campañas para "${this.value}".</td></tr>`;
    } else {
        tbody.innerHTML = coincidencias.map(c => `
            <tr>
                <td>
                    <div class="campaign-name">
                        <span class="campaign-logo">${logoCanal(c.canal)}</span>
                        ${c.nombre}
                    </div>
                </td>
                <td><span class="channel-tag">${c.canal}</span></td>
                <td>${formatearFecha(c.fechaInicio)}</td>
                <td>${formatearFecha(c.fechaFin)}</td>
                <td>${c.leads}</td>
                <td>${c.calificados}</td>
                <td><span class="status-pill ${c.estado}">${etiquetaEstado(c.estado)}</span></td>
                <td>
                    <div class="owner-cell">
                        <span class="owner-avatar">${iniciales(c.propietario)}</span>
                        <div>${c.propietario}<span>Marketing</span></div>
                    </div>
                </td>
                <td></td>
            </tr>
        `).join("");
    }
    document.getElementById("paginacionInfo").textContent = `Mostrando ${coincidencias.length} de ${campanas.length} campañas`;
    document.getElementById("paginacionBotones").innerHTML = "";
});


// =========================================
// MODAL: NUEVA CAMPAÑA
// =========================================

const modalOverlay = document.getElementById("modalOverlay");
const formCampana = document.getElementById("formCampana");

const modal = crearModal({
    overlay: "modalOverlay",
    formulario: "formCampana",
    primerCampo: "campoNombre",
    abrirCon: ["btnNuevaCampana"],
    cerrarCon: ["modalClose", "modalCancelar"]
});


// Alias para el resto del modulo
const abrirModal = modal.abrir;
const cerrarModal = modal.cerrar;


document.getElementById("campoCalificados").addEventListener("input", function () {
    const leads = Number(document.getElementById("campoLeads").value || 0);
    const calificados = Number(this.value || 0);
    document.getElementById("hintCalificados").textContent =
        calificados > leads ? "No puede ser mayor que los leads totales." : "";
});

formCampana.addEventListener("submit", function (e) {
    e.preventDefault();

    const leads = Number(document.getElementById("campoLeads").value || 0);
    const calificados = Number(document.getElementById("campoCalificados").value || 0);

    if (calificados > leads) {
        document.getElementById("hintCalificados").textContent = "No puede ser mayor que los leads totales.";
        return;
    }

    const nueva = {
        id: "c" + Date.now(),
        nombre: document.getElementById("campoNombre").value.trim(),
        canal: document.getElementById("campoCanal").value,
        fechaInicio: document.getElementById("campoFechaInicio").value,
        fechaFin: document.getElementById("campoFechaFin").value,
        leads: leads,
        calificados: calificados,
        estado: document.getElementById("campoEstado").value,
        propietario: document.getElementById("campoPropietario").value.trim()
    };

    campanas.push(nueva);
    agregarActividad("＋", "Nueva campaña creada", nueva.nombre);

    guardar();
    paginaActual = Math.max(1, Math.ceil(campanasFiltradas().length / PAGE_SIZE));
    renderTodo();
    cerrarModal();
});


// =========================================
// INICIO
// =========================================

renderTodo();