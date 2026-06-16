// ═══════════════════════════════════════════════════════════
// SPRITES.JS — Todos los visuales del juego dibujados con código
// Diseñadora: Yenisei
// Regla: NO assets externos, todo con Phaser Graphics API
// ═══════════════════════════════════════════════════════════

export class Sprites {

  // ─── JUGADOR ────────────────────────────────────
  static drawPlayer(gfx, x, y, playerNumber, time) {
    gfx.clear();

    if (playerNumber === 1) {
      const col = 0x00FF88;
      // Glow exterior
      gfx.fillStyle(col, 0.08);
      gfx.fillCircle(x, y, 32);
      gfx.fillStyle(col, 0.12);
      gfx.fillCircle(x, y, 26);

      // Cuerpo principal
      gfx.fillStyle(col);
      gfx.fillCircle(x, y, 18);

      // Pantalla de laptop
      gfx.fillStyle(0x001122);
      gfx.fillRect(x - 10, y - 8, 20, 14);

      // Código en la pantalla
      const blink = Math.floor(time / 500) % 2;
      gfx.fillStyle(col);
      gfx.fillRect(x - 8, y - 6, 10 + blink * 3, 2);
      gfx.fillRect(x - 8, y - 2, 7, 2);
      gfx.fillRect(x - 8, y + 2, 12, 2);

      // Borde pulsante
      const pulse = 0.6 + Math.sin(time * 0.004) * 0.4;
      gfx.lineStyle(2, col, pulse);
      gfx.strokeCircle(x, y, 20);
    }

    if (playerNumber === 2) {
      const col = 0x00E5FF;
      // Glow exterior
      gfx.fillStyle(col, 0.08);
      gfx.fillCircle(x, y, 32);
      gfx.fillStyle(col, 0.12);
      gfx.fillCircle(x, y, 26);

      // Cuerpo principal
      gfx.fillStyle(col);
      gfx.fillCircle(x, y, 18);

      // Pantalla de laptop
      gfx.fillStyle(0x001122);
      gfx.fillRect(x - 10, y - 8, 20, 14);

      // Código en la pantalla
      const blink = Math.floor(time / 500) % 2;
      gfx.fillStyle(col);
      gfx.fillRect(x - 8, y - 6, 10, 2);
      gfx.fillRect(x - 8, y - 2, 14 - blink * 4, 2);
      gfx.fillRect(x - 8, y + 2, 7 + blink * 3, 2);

      // Borde pulsante
      const pulse = 0.6 + Math.sin(time * 0.004 + 1) * 0.4;
      gfx.lineStyle(2, col, pulse);
      gfx.strokeCircle(x, y, 20);
    }
  }

  // ─── ENEMIGOS ────────────────────────────────────

  static drawNullPointer(gfx, x, y, time, flash) {
    gfx.clear();
    const col = flash ? 0xFFFFFF : 0xFF4444;
    // Glow
    gfx.fillStyle(col, 0.08);
    gfx.fillCircle(x, y, 22);
    // Cuerpo
    gfx.fillStyle(col);
    gfx.fillCircle(x, y, 12);
    // X de error
    gfx.lineStyle(2.5, flash ? 0x000000 : 0xFFFFFF, 0.9);
    gfx.lineBetween(x - 6, y - 6, x + 6, y + 6);
    gfx.lineBetween(x + 6, y - 6, x - 6, y + 6);
  }

  static drawStackOverflow(gfx, x, y, time, flash) {
    gfx.clear();
    const col = flash ? 0xFFFFFF : 0xFF8C00;
    const r = 18;
    // Glow
    gfx.fillStyle(col, 0.08);
    gfx.fillCircle(x, y, r + 10);
    // Cuadrados apilados
    gfx.fillStyle(col);
    gfx.fillRect(x - r, y - r, r * 2, r * 2);
    gfx.fillStyle(col, 0.6);
    gfx.fillRect(x - r + 4, y - r - 6, r * 2 - 4, r * 2 - 4);
    gfx.lineStyle(2, 0xFFFFFF, 0.4);
    gfx.strokeRect(x - r, y - r, r * 2, r * 2);
  }

  static drawInfiniteLoop(gfx, x, y, time, flash) {
    gfx.clear();
    const col = flash ? 0xFFFFFF : 0x00FF88;
    const rot = time * 0.003;
    const s = 14;
    // Glow
    gfx.fillStyle(col, 0.08);
    gfx.fillCircle(x, y, s + 10);
    // Triángulo rotante
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    gfx.fillStyle(col);
    gfx.fillTriangle(
      x + cos * s, y + sin * s,
      x + cos * (-s * 0.7) - sin * s, y + sin * (-s * 0.7) + cos * s,
      x + cos * (-s * 0.7) + sin * s, y + sin * (-s * 0.7) - cos * s
    );
    // Anillo
    gfx.lineStyle(1.5, col, 0.5);
    gfx.strokeCircle(x, y, s + 3);
  }

  static drawSyntaxError(gfx, x, y, time, flash) {
    gfx.clear();
    const col = flash ? 0xFFFFFF : 0xFF0055;
    const r = 24;
    // Glow
    gfx.fillStyle(col, 0.08);
    gfx.fillCircle(x, y, r + 10);
    // Diamante
    gfx.fillStyle(col);
    gfx.fillTriangle(x, y - r, x + r * 0.8, y, x, y + r);
    gfx.fillTriangle(x, y - r, x - r * 0.8, y, x, y + r);
    // Signo !
    gfx.fillStyle(0xFFFFFF);
    gfx.fillRect(x - 2, y - 12, 4, 14);
    gfx.fillRect(x - 2, y + 5, 4, 4);
  }

  static draw404(gfx, x, y, time, flash) {
    gfx.clear();
    const alpha = 0.3 + Math.abs(Math.sin(time * 0.002)) * 0.7;
    const col = flash ? 0xFFFFFF : 0xAAAAAA;
    // Fantasma que aparece/desaparece
    gfx.fillStyle(col, alpha);
    gfx.fillCircle(x, y - 3, 12);
    gfx.fillRect(x - 12, y - 3, 24, 14);
    // Ondas en la parte inferior
    for (let i = 0; i < 3; i++) {
      gfx.fillStyle(col, alpha);
      gfx.fillCircle(x - 8 + i * 8, y + 11, 4);
    }
    // Signo ?
    gfx.fillStyle(0xFFFFFF, alpha);
    gfx.fillRect(x - 1.5, y - 8, 3, 8);
    gfx.fillRect(x - 1.5, y + 2, 3, 3);
  }

  // ─── DIBUJAR ENEMIGO POR TIPO ─────────────────────
  static drawEnemy(gfx, x, y, type, time, flash) {
    switch (type) {
      case 'nullpointer':   Sprites.drawNullPointer(gfx, x, y, time, flash); break;
      case 'stackoverflow': Sprites.drawStackOverflow(gfx, x, y, time, flash); break;
      case 'infiniteloop':  Sprites.drawInfiniteLoop(gfx, x, y, time, flash); break;
      case 'syntaxerror':   Sprites.drawSyntaxError(gfx, x, y, time, flash); break;
      case '404notfound':   Sprites.draw404(gfx, x, y, time, flash); break;
      default:              Sprites.drawNullPointer(gfx, x, y, time, flash); break;
    }
  }

  // ─── JEFE ────────────────────────────────────────
  static drawBoss(gfx, x, y, phase, time, flash) {
    gfx.clear();
    const t = time * 0.002;
    const colors = [0xFF0055, 0xFF6600, 0xFF0000];
    const col = flash ? 0xFFFFFF : colors[phase - 1];

    // Aura exterior pulsante
    const glowR = 58 + phase * 6;
    gfx.fillStyle(col, 0.06);
    gfx.fillCircle(x, y, glowR + 10);
    gfx.fillStyle(col, 0.10);
    gfx.fillCircle(x, y, glowR);

    // Estrella de 8 puntas rotando
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + t;
      const r = i % 2 === 0 ? 44 : 28;
      const nx = x + Math.cos(a) * r;
      const ny = y + Math.sin(a) * r;
      gfx.fillStyle(col, 0.3);
      gfx.fillCircle(nx, ny, 8);
    }

    // Hexágono principal
    gfx.fillStyle(col);
    for (let i = 0; i < 6; i++) {
      const a1 = t * 0.7 + (i * Math.PI / 3);
      const a2 = t * 0.7 + ((i + 1) * Math.PI / 3);
      gfx.fillTriangle(
        x, y,
        x + Math.cos(a1) * 48, y + Math.sin(a1) * 48,
        x + Math.cos(a2) * 48, y + Math.sin(a2) * 48
      );
    }

    // Núcleo oscuro
    gfx.fillStyle(0x110005);
    for (let i = 0; i < 6; i++) {
      const a1 = -t * 1.2 + (i * Math.PI / 3);
      const a2 = -t * 1.2 + ((i + 1) * Math.PI / 3);
      gfx.fillTriangle(
        x, y,
        x + Math.cos(a1) * 26, y + Math.sin(a1) * 26,
        x + Math.cos(a2) * 26, y + Math.sin(a2) * 26
      );
    }

    // Ojo central
    const eyeAngle = time * 0.04;
    const eyeSize = 14 + Math.sin(eyeAngle) * 4;
    gfx.fillStyle(flash ? 0xFF0000 : col);
    gfx.fillCircle(x, y, eyeSize);
    gfx.fillStyle(0xFFFFFF, 0.9);
    gfx.fillCircle(
      x + Math.cos(eyeAngle) * 4,
      y + Math.sin(eyeAngle) * 3,
      eyeSize * 0.4
    );

    // Picos orbitando en fase 2+
    if (phase >= 2) {
      for (let i = 0; i < 4; i++) {
        const a = t * 2 + (i * Math.PI / 2);
        const px = x + Math.cos(a) * 68;
        const py = y + Math.sin(a) * 68;
        gfx.fillStyle(flash ? 0xFFFFFF : 0xFF6600);
        gfx.fillTriangle(px, py - 10, px - 6, py + 6, px + 6, py + 6);
      }
    }

    // Orbes de fuego en fase 3
    if (phase >= 3) {
      for (let i = 0; i < 6; i++) {
        const a = -t * 1.5 + (i * Math.PI / 3);
        const px = x + Math.cos(a) * 56;
        const py = y + Math.sin(a) * 56;
        gfx.fillStyle(0xFF0000, 0.5);
        gfx.fillCircle(px, py, 5);
      }
    }

    // Anillos
    gfx.lineStyle(3, col, 0.6);
    gfx.strokeCircle(x, y, 52);
    gfx.lineStyle(2, 0xFFFFFF, 0.15);
    gfx.strokeCircle(x, y, 58);
  }

  // ─── BALAS DEL JUGADOR ───────────────────────────
  static drawBullet(gfx, x, y, weaponLevel, time) {
    gfx.clear();

    if (weaponLevel === 1) {
      // console.log — punto dorado
      gfx.fillStyle(0xFFD700, 0.25);
      gfx.fillCircle(x, y, 11);
      gfx.fillStyle(0xFFD700);
      gfx.fillCircle(x, y, 5);
      gfx.fillStyle(0xFFFFFF, 0.7);
      gfx.fillCircle(x - 1, y - 1, 2);
    }

    else if (weaponLevel === 2) {
      // debugger — rombo cyan
      gfx.fillStyle(0x00E5FF, 0.25);
      gfx.fillCircle(x, y, 13);
      gfx.fillStyle(0x00E5FF);
      gfx.fillTriangle(x, y - 8, x + 6, y, x, y + 8);
      gfx.fillTriangle(x, y - 8, x - 6, y, x, y + 8);
      gfx.fillStyle(0xFFFFFF, 0.5);
      gfx.fillCircle(x - 1, y - 2, 2);
    }

    else if (weaponLevel === 3) {
      // git push --force — estrella naranja
      gfx.fillStyle(0xFF4500, 0.25);
      gfx.fillCircle(x, y, 15);
      gfx.fillStyle(0xFF4500);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const b = ((i + 0.5) / 5) * Math.PI * 2 - Math.PI / 2;
        gfx.fillTriangle(
          x + Math.cos(a) * 10, y + Math.sin(a) * 10,
          x + Math.cos(b) * 5, y + Math.sin(b) * 5,
          x, y
        );
      }
      gfx.fillStyle(0xFFFFFF, 0.8);
      gfx.fillCircle(x, y, 3);
    }

    else if (weaponLevel >= 4) {
      // sudo rm -rf — láser rojo magenta
      const pulse = 0.8 + Math.sin(time * 0.01) * 0.2;
      gfx.fillStyle(0xFF0055, 0.2);
      gfx.fillCircle(x, y, 20);
      gfx.fillStyle(0xFF0055, pulse);
      gfx.fillCircle(x, y, 9);
      gfx.lineStyle(2, 0xFF00FF, 0.7);
      gfx.strokeCircle(x, y, 13);
      gfx.lineStyle(1, 0xFF00FF, 0.3);
      gfx.strokeCircle(x, y, 17);
      gfx.fillStyle(0xFFFFFF);
      gfx.fillCircle(x, y, 4);
    }
  }

  // ─── BALAS DEL BOSS ──────────────────────────────
  static drawBossBullet(gfx, x, y, phase, time) {
    gfx.clear();
    const colors = [0xFF0055, 0xFF6600, 0xFF2200];
    const col = colors[phase - 1] || 0xFF0055;
    const r = 8;
    gfx.fillStyle(col, 0.3);
    gfx.fillCircle(x, y, r + 5);
    gfx.fillStyle(col);
    gfx.fillCircle(x, y, r);
    gfx.fillStyle(0xFFFFFF, 0.6);
    gfx.fillCircle(x - 2, y - 2, r * 0.3);
  }

  // ─── GEMAS DE XP ─────────────────────────────────
  static drawGem(gfx, x, y, time) {
    gfx.clear();
    const bob = Math.sin(time * 0.004 + x) * 3;
    const pulse = 0.8 + Math.sin(time * 0.005) * 0.2;
    // Diamante cyan-morado
    gfx.fillStyle(0x7B2FFF, pulse);
    gfx.fillTriangle(x, y + bob - 8, x + 6, y + bob, x - 6, y + bob);
    gfx.fillStyle(0x00E5FF, pulse);
    gfx.fillTriangle(x, y + bob + 8, x + 6, y + bob, x - 6, y + bob);
    // Brillo
    gfx.fillStyle(0xFFFFFF, 0.6);
    gfx.fillCircle(x - 2, y + bob - 3, 2);
  }

  // ─── FONDO ───────────────────────────────────────
  static drawBackground(gfx, width, height, time) {
    gfx.clear();
    // Fondo base
    gfx.fillStyle(0x050010);
    gfx.fillRect(0, 0, width, height);
    // Grid sutil
    gfx.lineStyle(1, 0x0A0035, 0.5);
    for (let x = 0; x < width; x += 48) {
      gfx.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 48) {
      gfx.lineBetween(0, y, width, y);
    }
  }

  // ─── COLORES DE EXPLOSIÓN POR TIPO ───────────────
  static getExplosionColors(enemyType) {
    const map = {
      nullpointer:   [0xFF4444, 0xFF8888, 0xFFAAAA],
      stackoverflow: [0xFF8C00, 0xFFAA44, 0xFFD700],
      infiniteloop:  [0x00FF88, 0x00FFAA, 0xAAFFDD],
      syntaxerror:   [0xFF0055, 0xFF4488, 0xFF00FF],
      '404notfound': [0xAAAAAA, 0xCCCCCC, 0xFFFFFF],
      boss:          [0xFF0000, 0xFF00FF, 0xFFD700, 0xFFFFFF],
    };
    return map[enemyType] || [0xFFFFFF];
  }
}
