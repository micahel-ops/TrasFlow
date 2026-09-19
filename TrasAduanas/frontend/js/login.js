// ============================================
// MOSTRAR U OCULTAR CONTRASEÑA
// ============================================

const botonVerContrasena =
  document.getElementById('boton-ver-contrasena');

const campoContrasena =
  document.getElementById('contrasena');


botonVerContrasena.addEventListener('click', () => {

  const esVisible =
    campoContrasena.type === 'text';


  campoContrasena.type =
    esVisible ? 'password' : 'text';


  botonVerContrasena.classList.toggle(
    'activo',
    !esVisible
  );


  botonVerContrasena.setAttribute(
    'aria-pressed',
    String(!esVisible)
  );


  botonVerContrasena.setAttribute(
    'aria-label',
    esVisible
      ? 'Mostrar contraseña'
      : 'Ocultar contraseña'
  );

});


// ============================================
// ELEMENTOS DEL FORMULARIO
// ============================================

const formulario =
  document.getElementById('formulario-login');

const correo =
  document.getElementById('correo');

const dni =
  document.getElementById('dni');

const contrasena =
  document.getElementById('contrasena');

const mensajeEstado =
  document.getElementById('mensaje-estado');


// ============================================
// SOLO PERMITIR NÚMEROS EN EL DNI
// ============================================

dni.addEventListener('input', () => {

  dni.value = dni.value
    .replace(/\D/g, '')
    .slice(0, 8);

});


// ============================================
// MARCAR CAMPO
// ============================================

function marcarCampo(campo, esValido) {

  const contenedor =
    campo.closest('.campo');


  contenedor.classList.toggle(
    'campo-invalido',
    !esValido
  );

}


// ============================================
// VALIDAR FORMULARIO
// ============================================

formulario.addEventListener('submit', (evento) => {

  evento.preventDefault();


  // Validar correo

  const correoValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(correo.value.trim());


  // Validar DNI

  const dniValido =
    /^\d{8}$/
      .test(dni.value.trim());


  // Validar contraseña

  const contrasenaValida =
    contrasena.value.length >= 8;


  // Marcar campos

  marcarCampo(
    correo,
    correoValido
  );


  marcarCampo(
    dni,
    dniValido
  );


  marcarCampo(
    contrasena,
    contrasenaValida
  );


  // ==========================================
  // DATOS VÁLIDOS
  // ==========================================

  if (
    correoValido &&
    dniValido &&
    contrasenaValida
  ) {

    mensajeEstado.textContent =
      'Verificando tus credenciales…';


    mensajeEstado.classList.remove(
      'mensaje-error'
    );


    mensajeEstado.classList.add(
      'mensaje-exito'
    );


    // Redirigir al panel

    setTimeout(() => {

      window.location.href =
        'index.html';

    }, 700);


  } else {

    // ========================================
    // DATOS INVÁLIDOS
    // ========================================

    mensajeEstado.textContent =
      'Revisa los campos marcados antes de continuar.';


    mensajeEstado.classList.remove(
      'mensaje-exito'
    );


    mensajeEstado.classList.add(
      'mensaje-error'
    );

  }

});
