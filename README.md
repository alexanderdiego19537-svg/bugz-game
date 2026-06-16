# 👾 BUGZ — El Programador vs Los Bugs

[![Platanus Hack 26](https://img.shields.io/badge/Platanus_Hack-26_CDMX-yellow.svg)](https://hack.platan.us/)
[![Arcade Challenge](https://img.shields.io/badge/Challenge-Arcade_CDMX-brightgreen.svg)](https://hack.platan.us/)
[![Size Limit](https://img.shields.io/badge/Size-%3C_50KB-blue.svg)](file:///c:/Users/mackm/OneDrive/Escritorio/bugz-game/game.js)
[![Engine](https://img.shields.io/badge/Engine-Phaser_3-orange.svg)](https://phaser.io/)

**BUGZ** es un juego arcade de disparos cooperativo en perspectiva cenital (top-down) creado específicamente para la competencia de gabinetes de **Platanus Hack 26 (CDMX)**. 

En este juego, uno o dos programadores deben combatir contra oleadas infinitas de errores de programación (NullPointer, StackOverflow, SyntaxError, etc.) disparando código y esquivando obstáculos en diferentes entornos de desarrollo.

---

## 🚀 Características Principales

*   **⚡ Gráficos Procedimentales en Tiempo Real:** Todos los personajes, enemigos (como el temible ojo flotante de SyntaxError), proyectiles de código y los tres jefes finales detallados a 16x16 píxeles se dibujan dinámicamente mediante código en tiempo real utilizando la API de gráficos de Phaser 3. *¡Cero archivos de imagen externos (`.png`/`.jpg`)!*
*   **🔊 Audio Sintetizado por Código:** La música chiptune retro y todos los efectos de sonido (SFX de disparos, explosiones, dashes, alertas de jefe) se generan procedimentalmente a través de osciladores matemáticos utilizando la **Web Audio API** del navegador. *¡Cero archivos de audio externos (`.mp3`/`.wav`)!*
*   **⚖️ Restricción Extrema de Peso:** Todo el juego está contenido en el archivo único [game.js](file:///c:/Users/mackm/OneDrive/Escritorio/bugz-game/game.js) con un tamaño optimizado de **47.6 KB**, por debajo del límite estricto de 50 KB de la competencia.
*   **👥 Modos de Juego y Compañero CPU:**
    *   **1 JUGADOR:** Juega solo.
    *   **2 JUGADORES:** Cooperativo local clásico de gabinete.
    *   **COMPAÑERO CPU:** Juega con la ayuda de una IA autónoma que rastrea enemigos, esquiva ataques y dispara de forma inteligente.
    *   *¡Llamar al compañero:* Puedes presionar la tecla `2` en solitario para invocar dinámicamente a tu compañero CPU en momentos de peligro!
*   **💖 Tokens de Vida y Cementerio:** Los jugadores comparten una reserva de 3 vidas (corazones pixel art en el HUD). Si un programador cae, se crea una lápida (`RIP.js`) y revive automáticamente en el mismo lugar después de unos segundos si quedan tokens de vida.
*   **Dificultad Dinámica Escalable:** La dificultad avanza progresivamente con las oleadas. En modo de 2 jugadores, el juego escala automáticamente el volumen de enemigos, la velocidad de spawn, sus estadísticas base y los HP de los jefes para un reto cooperativo ideal.

---

## 🕹️ Controles de Gabinete

| Acción | Jugador 1 | Jugador 2 / CPU |
| :--- | :--- | :--- |
| **Movimiento (Joystick)** | `W`, `A`, `S`, `D` | `↑`, `←`, `↓`, `→` (Automático si es CPU) |
| **Disparar (Botón 1)** | `U` | `R` (Automático si es CPU) |
| **Dash / Esquivar (Botón 4)** | `J` | `F` (Automático si es CPU) |
| **Iniciar / Pausar (Start 1)** | `Enter` | — |
| **Unir P2 / Llamar CPU (Start 2)** | — | `2` |

*   *El juego cuenta con un normalizador de teclas para evitar fallos por uso accidental de Bloq Mayús (Caps Lock).*

---

## 💻 Entornos y Jefes Finales

El fondo de cuadrícula con efecto parallax cambia de estilo y color según el nivel:
1.  **IDE Theme:** Entorno de editor clásico azul oscuro.
2.  **Terminal Theme:** Fondo negro con lluvia de código al estilo Matrix.
3.  **Server Room:** Sala de servidores con LEDs parpadeantes.
4.  **Cloud Theme:** Tonos morados con nubes y servidores flotantes.
5.  **Dark Web:** Un ambiente rojo/púrpura amenazante con calaveras de fondo.

**Jefes Finales (Cada 5 oleadas):**
*   **SEGFAULT:** Núcleo de glitch spiky con ataques de orbes.
*   **BLUE SCREEN:** Un monitor CRT gigante con cara triste `:(`, rodeado de ondas eléctricas destructivas.
*   **KERNEL PANIC:** Un cráneo de fuego gigante con cuernos en forma de memoria RAM que escupe fuego.

---

## 🏆 Recompensas y Memes
*   **Premio de 10K:** Cada 10,000 puntos obtienes un premio aleatorio (Heal, Escudo Mega, Velocidad) y **+1 Vida extra**.
*   **Meme Surprises:** Cada 3 oleadas aparecerán flotando iconos de memes como **Doge** (brinda escudo), la taza de **Coffee** (aumento de velocidad) y **Trollface** (mejora de armas).

---

## 🛠️ Cómo Probar Localmente

1. Clona el repositorio:
   ```bash
   git clone https://github.com/alexanderdiego19537-svg/bugz-game.git
   ```
2. Inicia un servidor local en la carpeta raíz:
   ```bash
   npx serve .
   ```
3. Abre en tu navegador la dirección indicada (usualmente `http://localhost:3000/test.html`).

---

**BUGZ** — *Platanus Hack 26 · CDMX · Arcade Challenge* 🇲🇽
