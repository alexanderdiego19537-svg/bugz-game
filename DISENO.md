# DISENO.md — Guía de Diseño Visual de BUGZ
## Para: Yenisei
## Proyecto: BUGZ — El Programador vs Los Bugs

---

## 🎨 PALETA DE COLORES OFICIAL

Estos son los colores exactos del juego. Úsalos en TODOS los assets:

| Rol | Nombre | HEX | Uso |
|---|---|---|---|
| Primario | Cyberverde | `#00FF88` | Jugador 1, UI principal |
| Secundario | Ciberazul | `#00E5FF` | Jugador 2, detalles |
| Acento | Dorado | `#FFD700` | Score, puntos, logros |
| Peligro | Rojo Error | `#FF0055` | Boss, daño crítico |
| Aviso | Naranja Bug | `#FF8C00` | Enemigos medianos |
| Fondo | Void | `#050010` | Fondo del juego |
| Fondo2 | Dark Grid | `#0A0035` | Líneas del grid |
| Texto | Blanco puro | `#FFFFFF` | Texto de UI |

---

## 🖼️ ASSETS QUE NECESITO — PRIORIDAD ALTA

### 1. Logo BUGZ (PNG, fondo transparente)
- Fuente: estilo "monospace" / terminal
- Color: `#00FF88` con glow
- Tamaño: 512x256 px
- Versión 2: solo el texto "BUGZ" en grande

### 2. Pantallas de UI (Figma o PNG)

#### 2a. Pantalla de Menú Principal
Elementos necesarios:
- Fondo: oscuro `#050010` con grid de líneas `#0A0035`
- Título "BUGZ" en verde brillante, centrado
- Subtítulo "EL PROGRAMADOR VS LOS BUGS" en dorado
- Texto parpadeante "PRESIONA ENTER"
- Controles en la parte inferior

#### 2b. HUD durante el juego
- Barra HP Jugador 1 (abajo izquierda) — verde
- Barra HP Jugador 2 (abajo derecha) — azul
- Score (arriba izquierda) — dorado
- Oleada actual (arriba centro) — naranja

#### 2c. Pantalla Game Over
- Fondo oscuro
- "GAME OVER" en rojo, grande
- Score final en dorado
- Mejor puntuación en gris

---

## 👾 DISEÑO DE PERSONAJES

### Jugador 1 — "Pixel" (P1)
- Concepto: programador con laptop
- Color base: `#00FF88`
- Forma actual en juego: círculo con pantalla de laptop adentro
- Para el sprite final: personaje pixel art top-down con laptop
- Tamaño sprite: 32x32 px (escala 2x = 64x64)

### Jugador 2 — "Debug" (P2)
- Concepto: programador con auriculares
- Color base: `#00E5FF`
- Igual que P1 pero con accesorios distintos

---

## 👹 DISEÑO DE ENEMIGOS

### Tipo 1 — NullPointer
- Símbolo: círculo rojo con ❌ adentro
- Color: `#FF4444`
- Tamaño: pequeño (radio 12 en juego)
- Concepto: error básico, abundante

### Tipo 2 — StackOverflow
- Símbolo: cuadrados apilados
- Color: `#FF8C00`
- Tamaño: mediano (radio 18)
- Concepto: error de memoria, más resistente

### Tipo 3 — SyntaxError
- Símbolo: diamante con !
- Color: `#FF0055`
- Tamaño: grande (radio 24)
- Concepto: error grave, lento pero dañino

### Boss — SegmentationFault
- Símbolo: hexágono con ojo en el centro
- Color principal: `#FF0055`
- Cambia a `#FF6600` en fase 2
- Cambia a `#FF0000` en fase 3
- Tamaño: muy grande (radio 48)
- Tiene 3 fases visuales

---

## 🎬 EFECTOS VISUALES

### Explosiones
- Partículas que salen del enemigo muerto
- Color = color del enemigo
- 14 partículas por explosión
- Duración: 500-800ms

### Balas
- Nivel 1: dorado `#FFD700` — circulo pequeño
- Nivel 2: cian `#00E5FF` — un poco más grande
- Nivel 3: naranja `#FF4500` — más grande aún
- Nivel 4: rojo-magenta `#FF0055` — el más grande

### Texto flotante de daño
- `-12` en rojo cuando el jugador recibe daño
- `+50` en dorado cuando mata un enemigo
- El texto sube y desaparece en ~1 segundo

---

## 🔤 TIPOGRAFÍA

| Uso | Fuente | Tamaño |
|---|---|---|
| Título BUGZ | monospace (bold) | 80px |
| HUD Score | monospace | 20px |
| Subtítulos | monospace | 16px |
| Instrucciones | monospace | 13px |
| Mensajes oleada | monospace (bold) | 42px |
| Game Over | monospace (bold) | 58px |
| Score final | monospace (bold) | 52px |

> **Nota**: Toda la tipografía usa `monospace` para mantener el feel de terminal/programación.

---

## 📐 RESOLUCIÓN DEL JUEGO

- Canvas: **800 x 600 px**
- El juego se centra en pantalla
- Fondo de body: `#050010`

---

## ✅ ENTREGABLES PARA MAÑANA JUN 12

1. `[ ]` Logo BUGZ (PNG, fondo transparente)
2. `[ ]` Paleta completa en formato Figma o Adobe
3. `[ ]` Boceto del menú principal
4. `[ ]` Boceto del HUD de juego
5. `[ ]` Diseño de los 3 tipos de enemigos
6. `[ ]` Diseño del Boss (SegmentationFault)

---

## 🔗 Recursos útiles

- Colores en CSS: ya están en el `index.html` del repo
- Colores en Phaser: formato `0xRRGGBB` (ej: `0x00FF88`)
- El juego ya está corriendo, clonar el repo y hacer `npm install` + `npm run dev`
