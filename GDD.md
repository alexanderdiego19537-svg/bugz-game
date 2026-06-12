# GDD — Game Design Document
## BUGZ: El Programador vs Los Bugs
### Versión 0.1 — Borrador Inicial

---

## 1. CONCEPTO GENERAL

**Título:** BUGZ — El Programador vs Los Bugs  
**Género:** Twin-stick shooter / Bullet hell (top-down)  
**Plataforma:** Web (navegador)  
**Motor:** Phaser 3 + Vite  
**Jugadores:** 1-2 jugadores (cooperativo local)  
**Duración de partida:** 10-20 minutos  

### Frase de concepto
> *Dos programadores atrapados dentro de su propio código. Los bugs han tomado el control del sistema. Solo el debug puede salvarlos.*

---

## 2. HISTORIA

El año es 2087. Los programadores ya no escriben código — sus mentes se conectan directamente al sistema. Pero un día, un commit roto liberó miles de bugs mutantes dentro de la red.

**Pixel** (P1) y **Debug** (P2) son los únicos programadores todavía conectados al sistema. Su misión: sobrevivir las oleadas de bugs y encontrar el código fuente del error original — el legendario `SegmentationFault`, el boss final.

---

## 3. MECÁNICAS PRINCIPALES

### 3.1 Movimiento
| Jugador | Teclas |
|---|---|
| P1 | Flechas del teclado |
| P2 | WASD |

- Movimiento en 8 direcciones
- Velocidad base: 220 px/seg
- Los jugadores no colisionan entre sí

### 3.2 Disparo
- **Automático**: apunta al enemigo más cercano
- **Cadencia**: cada 350ms
- **Niveles de arma** (se mejoran por puntuación):
  - Nivel 1 — `console.log`: 1 bala, daño 15
  - Nivel 2 — `debugger`: 2 balas, daño 20
  - Nivel 3 — `git push --force`: 3 balas, daño 25
  - Nivel 4 — `sudo rm -rf`: 3 balas, daño 30

### 3.3 Vida y daño
- Cada jugador empieza con **100 HP**
- Cuando un enemigo toca al jugador: **-12 HP**
- Inmunidad temporal tras recibir daño: **700ms** (parpadeo)
- Game Over cuando **ambos** jugadores llegan a 0 HP
- (Opcional futuro): power-ups de curación

### 3.4 Sistema de oleadas
- **Oleada 1**: 7 enemigos, spawn cada 2 seg
- Cada oleada: +3 enemigos, spawn 120ms más rápido
- Entre oleadas: 1.5 segundos de respiro
- Al terminar todos los enemigos de la oleada → siguiente oleada

---

## 4. ENEMIGOS

### 4.1 NullPointer ⭕
- **HP**: 20 + (oleada × 8)
- **Velocidad**: 80 + (oleada × 8) px/seg
- **Puntos**: 50
- **Aparece**: desde oleada 1
- **IA**: va directo al jugador más cercano

### 4.2 StackOverflow 🟧
- **HP**: 40 + (oleada × 10)
- **Velocidad**: 55 + (oleada × 5) px/seg
- **Puntos**: 100
- **Aparece**: desde oleada 2 (30% probabilidad)
- **IA**: igual que NullPointer pero más resistente

### 4.3 SyntaxError 🔴
- **HP**: 90 + (oleada × 15)
- **Velocidad**: 35 + (oleada × 3) px/seg
- **Puntos**: 200
- **Aparece**: desde oleada 3 (15% probabilidad)
- **IA**: lento pero requiere muchos disparos

---

## 5. BOSS — SegmentationFault

### 5.1 Stats
- **HP**: 1000
- **3 fases** (cambia a 60% y 30% de vida)

### 5.2 Fases
| Fase | Color | Velocidad | Ataque |
|---|---|---|---|
| 1 | Rojo-rosa `#FF0055` | Normal | Abanico de 5 balas |
| 2 | Naranja `#FF6600` | +30px/seg | Abanico + apuntado |
| 3 | Rojo puro `#FF0000` | +60px/seg | Abanico + apuntado + anillo de 8 |

### 5.3 Movimiento
- Se mueve horizontalmente rebotando en las paredes
- Movimiento sinusoidal vertical
- Entra desde arriba dramáticamente al inicio

### 5.4 Aparición
- El boss aparece cada **5 oleadas** (oleada 5, 10, 15...)
- (Futuro): boss diferente para la oleada 10+

---

## 6. PROGRESIÓN

```
Oleada 1-2: Solo NullPointers
Oleada 3-4: Aparecen StackOverflows
Oleada 5:   BOSS — SegmentationFault (fase 1 solo)
Oleada 6-7: Los tres tipos
Oleada 8-9: Más denso
Oleada 10:  BOSS más fuerte (todas las fases activas)
```

---

## 7. INTERFAZ (HUD)

```
┌──────────────────────────────────────────────────────┐
│  SCORE: 1,250          [OLEADA 3]          ─────────  │
│                                                       │
│                   (ÁREA DE JUEGO)                    │
│                                                       │
│  [████████░░] P1                   P2 [██████░░░░]   │
└──────────────────────────────────────────────────────┘
```

- **Score**: arriba izquierda
- **Oleada actual**: arriba centro
- **HP P1**: abajo izquierda (verde)
- **HP P2**: abajo derecha (azul)
- **Barra HP del Boss**: arriba, ancho 60% de la pantalla (solo cuando hay boss)

---

## 8. SONIDO (Futuro — Marcos define)

| Evento | Sonido sugerido |
|---|---|
| Disparo | Beep electrónico corto |
| Enemigo muerto | "Error" 8-bit |
| Jugador herido | Glitch corto |
| Subida de nivel arma | Fanfare corto |
| Boss aparece | Stinger de horror/tensión |
| Boss muerto | Victoria épica |
| Game Over | Música triste/dramática |

---

## 9. PANTALLAS

1. **Menú Principal** → Enter para jugar
2. **Juego** → Jugabilidad principal
3. **Game Over** → Score + Mejor score + Enter para reiniciar
4. **(Futuro)** Pantalla de créditos
5. **(Futuro)** Pantalla de configuración (volumen, controles)

---

## 10. ROADMAP

### HOY ✅ (Jun 11)
- [x] Proyecto base configurado
- [x] Menú principal
- [x] Movimiento de 2 jugadores
- [x] Sistema de disparo automático
- [x] 3 tipos de enemigos
- [x] Sistema de oleadas
- [x] Partículas y efectos visuales
- [x] Game Over + best score
- [x] Mejoras de arma por puntuación
- [x] Código del Boss listo (Boss.js)

### MAÑANA Jun 12
- [ ] Integrar Boss.js al GameScene (Emiliano)
- [ ] Activar boss en oleada 5
- [ ] Colisión balas del jugador → boss
- [ ] DISENO.md completado con assets (Yenisei)
- [ ] Power-up de curación básico

### Jun 13-14
- [ ] Sonidos básicos (Marcos busca assets free)
- [ ] Pantalla de créditos
- [ ] Balance de dificultad
- [ ] Power-ups adicionales

### Jun 15 (Demo interna)
- [ ] Juego completo jugable
- [ ] Subido a GitHub Pages para compartir link

---

## 11. CRÉDITOS (draft)

- **Game Design & Dev**: [Tu nombre]
- **Programación Enemigos**: Emiliano
- **Arte & Diseño Visual**: Yenisei  
- **Narrativa & GDD**: Marcos
- **Motor**: Phaser 3
- **Build tool**: Vite

---

## 12. NOTAS TÉCNICAS PARA EMILIANO

El Boss ya está implementado en `src/entities/Boss.js`.

Para integrarlo en `GameScene`, necesitas:

1. Importar el Boss al inicio de `main.js`:
```javascript
import { Boss } from './entities/Boss.js';
```

2. En `GameScene.create()`, agregar:
```javascript
this.boss = null;         // null = no hay boss activo
this.bossActive = false;
```

3. En `startWave()`, agregar la condición del boss:
```javascript
if (this.wave % 5 === 0) {
  // Oleada de boss — no spawnear enemigos normales
  this.enemiesThisWave = 0;
  this.time.delayedCall(1000, () => {
    this.boss = new Boss(this);
    this.bossActive = true;
    // Texto HP del boss
    this.bossNameText = this.add.text(W/2, 32, 'SEGMENTATION FAULT', {
      fontFamily: 'monospace', fontSize: '12px',
      color: '#FF0055', letterSpacing: 4
    }).setOrigin(0.5, 0);
  });
}
```

4. En `update()`, agregar dentro del bucle:
```javascript
// ── Boss ──────────────────────────────
if (this.boss && this.boss.alive) {
  this.boss.update(delta, time, [this.p1, this.p2]);
  
  // Balas del jugador vs boss
  this.bullets.forEach(b => {
    if (this.boss.checkBulletHit(b)) {
      b.alive = false;
      b.gfx.destroy();
    }
  });
}
```

5. En `GameScene`, agregar el método callback:
```javascript
onBossDead() {
  this.bossActive = false;
  if (this.bossNameText) this.bossNameText.destroy();
  this.score += 1000; // Bonus por matar al boss
  this.scoreText.setText('SCORE: ' + this.score.toLocaleString());
  this.time.delayedCall(2000, () => {
    this.wave++;
    this.waveText.setText('OLEADA ' + this.wave);
    this.startWave();
  });
}
```

¡Con eso el boss queda 100% integrado!
