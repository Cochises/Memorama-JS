// Variables para el juego
let tarjetasDestapadas = 0; // Contador de tarjetas destapadas
let tarjeta1 = null; // Referencia a la primera tarjeta destapada
let tarjeta2 = null; // Referencia a la segunda tarjeta destapada
let primerResultado = null; // Valor de la primera tarjeta destapada
let segundoResultado = null; // Valor de la segunda tarjeta destapada
let aciertos = 0; // Contador de aciertos
let movimientos = 0; // Contador de movimientos
let temporizador = false; // Estado del temporizador (iniciado/no iniciado)
let timer = 30; // Tiempo inicial del temporizador en segundos
let tiempoInicial = 30; // Tiempo total del temporizador en segundos
let tiempoRegresivoId = null; // Identificador del intervalo de tiempo

// AUDIO
let winAudio = new Audio("/sound/win.wav"); // Sonido de victoria
let loseAudio = new Audio("/sound/lose.wav"); // Sonido de derrota
let clickAudio = new Audio("/sound/click.wav"); // Sonido de clic
let rightAudio = new Audio("/sound/right.wav"); // Sonido de acierto
let wrongAudio = new Audio("/sound/wrong.wav"); // Sonido de error

// Elementos del DOM
let mostrarAciertos = document.getElementById("aciertos"); // Elemento para mostrar el contador de aciertos
let mostrarTiempo = document.getElementById("t-restante"); // Elemento para mostrar el tiempo restante
let mostrarMovimientos = document.getElementById("movimientos"); // Elemento para mostrar el contador de movimientos

mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`; // Mostrar el número inicial de movimientos en el DOM

// Generar un arreglo de números y mezclarlo aleatoriamente
let numeros = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
numeros = numeros.sort(() => {
  return Math.random() - 0.5;
});

// Función para actualizar el temporizador cada segundo
function contarTiempo() {
  tiempoRegresivoId = setInterval(() => {
    timer--;
    mostrarTiempo.innerHTML = `Tiempo: ${Math.max(timer, 0)} segundos`;

    // Verificar si el tiempo se agotó
    if (timer <= 0) {
      clearInterval(tiempoRegresivoId);
      bloquearTarjetas();
      // Audios y mensaje en caso de pérdida
      loseAudio.play();
      if (aciertos < 6) {
        mostrarTiempo.innerHTML = `¡PERDISTE! Inténtalo de nuevo`;
      }
    }
  }, 1000);
}

// Función para reiniciar el juego
function reiniciarJuego() {
  clearInterval(tiempoRegresivoId);
  temporizador = false;
  timer = tiempoInicial;
  tarjetasDestapadas = 0;
  aciertos = 0;
  movimientos = 0;
  mostrarAciertos.innerHTML = `Aciertos: ${aciertos}`;
  mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;
  mostrarTiempo.innerHTML = `Tiempo: ${timer} segundos`;

  // Reiniciar las tarjetas en el tablero
  for (let i = 0; i <= 11; i++) {
    let tarjeta = document.getElementById(i);
    tarjeta.innerHTML = "";
    tarjeta.disabled = false;
  }

  // Mezclar aleatoriamente los números nuevamente
  numeros = numeros.sort(() => {
    return Math.random() - 0.5;
  });

  // Iniciar el temporizador
  contarTiempo();
}

// Función para reiniciar el juego desde un botón
function reiniciarJuegoDesdeBoton() {
  reiniciarJuego();
}

// Función para bloquear todas las tarjetas al finalizar el juego
function bloquearTarjetas() {
  for (let i = 0; i <= 11; i++) {
    let tarjetaBloqueada = document.getElementById(i);
    tarjetaBloqueada.innerHTML = `<img src="/img/${numeros[i]}.png">`;
    tarjetaBloqueada.disabled = true;
  }
}

// Función para destapar una tarjeta
function destapar(id) {
  // Iniciar el temporizador si aún no ha sido iniciado
  if (temporizador == false) {
    contarTiempo();
    temporizador = true;
  }

  tarjetasDestapadas++;

  // Acciones cuando se destapa la primera tarjeta
  if (tarjetasDestapadas == 1) {
    tarjeta1 = document.getElementById(id);
    primerResultado = numeros[id];
    tarjeta1.innerHTML = `<img src="/img/${primerResultado}.png">`;
    clickAudio.play();
    tarjeta1.disabled = true;
  }
  // Acciones cuando se destapa la segunda tarjeta
  else if (tarjetasDestapadas == 2) {
    tarjeta2 = document.getElementById(id);
    segundoResultado = numeros[id];
    tarjeta2.innerHTML = `<img src="/img/${segundoResultado}.png">`;
    tarjeta2.disabled = true;
    movimientos++;
    mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;

    // Verificar si las tarjetas son iguales (acierto)
    if (primerResultado == segundoResultado) {
      tarjetasDestapadas = 0;
      aciertos++;
      mostrarAciertos.innerHTML = `Aciertos: ${aciertos}`;

      // Verificar si se completaron todas las parejas
      if (aciertos == 6) {
        clearInterval(tiempoRegresivoId);
        mostrarTiempo.innerHTML = `¡Fantástico! ${
          tiempoInicial - timer
        } segundos`;
        winAudio.play();
      }
    }
    // Si las tarjetas no son iguales (error), ocultarlas después de un breve intervalo
    else {
      setTimeout(() => {
        tarjeta1.innerHTML = "";
        tarjeta2.innerHTML = "";
        tarjeta1.disabled = false;
        tarjeta2.disabled = false;
        tarjetasDestapadas = 0;
        wrongAudio.play();
      }, 500);
    }
  }
}
