/* =========================================================
   CAFÉ RAMÉ · script.js
   Todo el JavaScript de la página, dividido por funciones.
   ========================================================= */


/* ---------------------------------------------------------
   1. MENÚ HAMBURGUESA (móvil)
   Al pulsar el botón, mostramos u ocultamos el menú.
   --------------------------------------------------------- */
const menuBoton = document.getElementById("menuBoton");
const menu = document.getElementById("menu");

menuBoton.addEventListener("click", () => {
  // toggle: si la clase está, la quita; si no está, la pone
  const abierto = menu.classList.toggle("abierto");
  menuBoton.classList.toggle("activo", abierto);
  menuBoton.setAttribute("aria-expanded", abierto); // accesibilidad
});

// Al pulsar un enlace del menú, lo cerramos (si no, se queda tapando la página)
menu.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    menu.classList.remove("abierto");
    menuBoton.classList.remove("activo");
    menuBoton.setAttribute("aria-expanded", false);
  });
});


/* ---------------------------------------------------------
   2. CABECERA CON FONDO AL HACER SCROLL
   Arriba del todo es transparente; al bajar se pone azul.
   --------------------------------------------------------- */
const cabecera = document.getElementById("cabecera");

function actualizarCabecera() {
  cabecera.classList.toggle("con-fondo", window.scrollY > 50);
}
window.addEventListener("scroll", actualizarCabecera);
actualizarCabecera(); // por si la página se recarga a mitad


/* ---------------------------------------------------------
   3. FILTRO DE LA CARTA
   Cada botón tiene data-filtro y cada plato data-categoria.
   Escondemos los platos que no coinciden.
   --------------------------------------------------------- */
const botonesFiltro = document.querySelectorAll(".filtro");
const platos = document.querySelectorAll(".plato");

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    const filtro = boton.dataset.filtro; // "todo", "bebidas", "dulce"...

    // Marcamos solo el botón pulsado como activo
    botonesFiltro.forEach((b) => b.classList.remove("activo"));
    boton.classList.add("activo");

    // Mostramos u ocultamos cada plato
    platos.forEach((plato) => {
      const coincide = filtro === "todo" || plato.dataset.categoria === filtro;
      plato.classList.toggle("oculto", !coincide);
    });
  });
});


/* ---------------------------------------------------------
   4. HORARIO: ¿ABIERTO AHORA?
   Guardamos el horario como datos y lo comparamos con la hora actual.
   Días: 0 = domingo, 1 = lunes ... 6 = sábado (así funciona getDay()).
   Horas en formato "HH:MM".
   --------------------------------------------------------- */
const HORARIO = {
  0: [["09:00", "14:00"]],                       // domingo
  1: [["08:00", "13:30"], ["16:30", "20:00"]],   // lunes
  2: [["08:00", "13:30"], ["16:30", "20:00"]],   // martes
  3: [["08:00", "13:30"], ["16:30", "20:00"]],   // miércoles
  4: [["08:00", "13:30"], ["16:30", "20:00"]],   // jueves
  5: [["08:00", "13:30"], ["16:30", "20:00"]],   // viernes
  6: [["08:00", "13:30"], ["16:30", "20:00"]],   // sábado
};

// Convierte "08:30" en minutos desde medianoche (510) para poder comparar
function aMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function calcularEstado() {
  const ahora = new Date();
  const dia = ahora.getDay();
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
  const turnos = HORARIO[dia];

  // ¿Estamos dentro de algún turno de hoy?
  for (const [inicio, fin] of turnos) {
    if (minutosAhora >= aMinutos(inicio) && minutosAhora < aMinutos(fin)) {
      return { abierto: true, texto: `Abierto ahora · hasta las ${fin}` };
    }
  }

  // Si está cerrado, buscamos el próximo turno de hoy
  for (const [inicio] of turnos) {
    if (minutosAhora < aMinutos(inicio)) {
      return { abierto: false, texto: `Cerrado · abrimos a las ${inicio}` };
    }
  }

  // Si ya no abre hoy, miramos mañana
  const manana = (dia + 1) % 7;
  return { abierto: false, texto: `Cerrado · mañana abrimos a las ${HORARIO[manana][0][0]}` };
}

function pintarEstado() {
  const estado = calcularEstado();
  // Lo mostramos en la portada y en la sección "Visítanos"
  ["estadoHero", "estadoVisita"].forEach((id) => {
    const elemento = document.getElementById(id);
    elemento.textContent = estado.texto;
    elemento.classList.toggle("abierto", estado.abierto);
    elemento.classList.toggle("cerrado", !estado.abierto);
  });
}

// Resaltamos la fila del horario que corresponde a hoy
function marcarDiaDeHoy() {
  const hoy = String(new Date().getDay());
  document.querySelectorAll(".horario li").forEach((fila) => {
    const dias = fila.dataset.dias.split(",");
    fila.classList.toggle("hoy", dias.includes(hoy));
  });
}

pintarEstado();
marcarDiaDeHoy();
setInterval(pintarEstado, 60 * 1000); // se actualiza cada minuto


/* ---------------------------------------------------------
   5. AÑO DEL PIE DE PÁGINA
   Así no hay que cambiarlo a mano cada enero.
   --------------------------------------------------------- */
document.getElementById("anio").textContent = new Date().getFullYear();
