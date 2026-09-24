// sound.js - Control de música de fondo y efectos de sonido (SFX)

// 1. Instancias de Audio
// Asegúrate de guardar tus archivos .mp3 en la carpeta assets/sounds/
const bgMusic = new Audio('assets/sounds/background_music.mp3');
const captureSFX = new Audio('assets/sounds/car_captured.mp3');

// Configuración de la música de fondo
bgMusic.loop = true; // Se repite infinitamente
bgMusic.volume = 0.3; // Volumen moderado (0.0 a 1.0)

// Configuración del sonido de captura
captureSFX.volume = 0.8;

// 2. Funciones para reproducir / pausar audio

/**
 * Inicia la música de fondo.
 * NOTA: Los navegadores modernos bloquean el audio automático.
 * Llama a esta función tras la primera interacción del usuario (ej. hacer clic en "Jugar" o tocar el mapa).
 */
function playBackgroundMusic() {
  bgMusic.play().catch((error) => {
    console.log("El reproductor automático fue bloqueado por el navegador:", error);
  });
}

/**
 * Pausa o reanuda la música de fondo.
 */
function toggleBackgroundMusic() {
  if (bgMusic.paused) {
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
}

/**
 * Reproduce el efecto de sonido al capturar un auto exitosamente.
 */
function playCaptureSound() {
  // Reinicia el audio por si se capturan varios autos seguidos
  captureSFX.currentTime = 0; 
  captureSFX.play().catch((error) => {
    console.error("Error al reproducir el sonido de captura:", error);
  });
}

// Exportar funciones si usas módulos ES6 (opcional)
// export { playBackgroundMusic, toggleBackgroundMusic, playCaptureSound };

