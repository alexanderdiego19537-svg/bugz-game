// ═══════════════════════════════════════════════════════════
// UISYSTEM.JS — Toda la interfaz de usuario del juego
// Diseñadora: Yenisei
// HUD, pantallas de menú, game over, textos flotantes
// ═══════════════════════════════════════════════════════════

export class UISystem {
  constructor(scene) {
    this.scene = scene;
    this.elements = {};
  }

  // ─── PANTALLA DE INICIO ───────────────────────────
  createStartScreen() {
    const W = this.scene.scale.width;
    const H = this.scene.scale.height;

    // Fondo oscuro
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x050010);
    bg.fillRect(0, 0, W, H);

    // Título principal — BUGZ
    const title = this.scene.add.text(W / 2, H * 0.3, 'BUGZ', {
      fontFamily: 'monospace',
      fontSize: '96px',
      fontStyle: 'bold',
      color: '#00FF88',
      stroke: '#004422',
      strokeThickness: 6,
      shadow: {
        offsetX: 0, offsetY: 0,
        color: '#00FF88',
        blur: 30,
        fill: true
      }
    }).setOrigin(0.5);

    // Subtítulo
    const subtitle = this.scene.add.text(W / 2, H * 0.42,
      'EL PROGRAMADOR VS LOS BUGS', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#FFD700',
      alpha: 0.7,
      letterSpacing: 4
    }).setOrigin(0.5);

    // Botón de inicio — parpadeante
    const startText = this.scene.add.text(
      W / 2, H * 0.65,
      '[ PRESIONA ENTER PARA EMPEZAR ]', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#00E5FF'
    }).setOrigin(0.5);

    // Animación de parpadeo
    this.scene.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut'
    });

    // Controles
    const controls = this.scene.add.text(W / 2, H * 0.80,
      'P1: FLECHAS    P2: WASD', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#FFFFFF',
      alpha: 0.4
    }).setOrigin(0.5);

    // Animación de entrada del título
    title.setAlpha(0);
    title.setScale(0.5);
    this.scene.tweens.add({
      targets: title,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: 'Back.Out'
    });

    return { bg, title, subtitle, startText, controls };
  }

  // ─── HUD EN JUEGO ─────────────────────────────────
  createGameHUD() {
    const W = this.scene.scale.width;
    const H = this.scene.scale.height;

    // Score label
    this.elements.scoreLabel = this.scene.add.text(16, 8, 'SCORE', {
      fontFamily: 'monospace', fontSize: '9px',
      color: '#FFD700', alpha: 0.5, letterSpacing: 4
    });

    // Score value
    this.elements.scoreValue = this.scene.add.text(16, 20, '0', {
      fontFamily: 'monospace', fontSize: '24px',
      fontStyle: 'bold', color: '#FFD700'
    });

    // Oleada
    this.elements.waveText = this.scene.add.text(W / 2, 14, 'OLEADA 1', {
      fontFamily: 'monospace', fontSize: '16px',
      color: '#FF4500', letterSpacing: 4
    }).setOrigin(0.5, 0);

    // Nivel de arma
    this.elements.weaponText = this.scene.add.text(W - 16, 14, 'console.log', {
      fontFamily: 'monospace', fontSize: '11px',
      color: '#FFD700', alpha: 0.6
    }).setOrigin(1, 0);

    // HP Bars background graphics
    this.elements.hpGfx = this.scene.add.graphics();

    return this.elements;
  }

  // ─── ACTUALIZA SCORE ──────────────────────────────
  updateScore(score) {
    if (this.elements.scoreValue) {
      this.elements.scoreValue.setText(score.toLocaleString());
    }
  }

  // ─── ACTUALIZA OLEADA ─────────────────────────────
  updateWave(wave) {
    if (this.elements.waveText) {
      this.elements.waveText.setText('OLEADA ' + wave);
    }
  }

  // ─── ACTUALIZA ARMA ──────────────────────────────
  updateWeapon(level) {
    const names = ['', 'console.log', 'debugger', 'git push --force', 'sudo rm -rf'];
    if (this.elements.weaponText) {
      this.elements.weaponText.setText(names[level] || names[1]);
    }
  }

  // ─── DIBUJA BARRAS HP ─────────────────────────────
  drawHPBars(p1, p2) {
    const W = this.scene.scale.width;
    const H = this.scene.scale.height;
    const gfx = this.elements.hpGfx;
    if (!gfx) return;
    gfx.clear();

    const drawBar = (x, y, current, max, col, label) => {
      const bw = 180;

      // Label
      gfx.fillStyle(col, 0.6);
      gfx.fillRect(x, y - 14, 2, 10);

      // Fondo
      gfx.fillStyle(0x222222);
      gfx.fillRect(x, y, bw, 12);

      // Relleno
      const pct = Math.max(0, current / max);
      const barCol = pct > 0.5 ? col : pct > 0.25 ? 0xFFAA00 : 0xFF0000;
      gfx.fillStyle(barCol);
      gfx.fillRect(x, y, bw * pct, 12);

      // Brillo superior
      gfx.fillStyle(0xFFFFFF, 0.1);
      gfx.fillRect(x, y, bw * pct, 4);

      // Borde
      gfx.lineStyle(1, col, 0.4);
      gfx.strokeRect(x, y, bw, 12);
    };

    drawBar(16, H - 42, p1.hp, p1.maxHp, 0x00FF88, 'P1');
    drawBar(W - 196, H - 42, p2.hp, p2.maxHp, 0x00E5FF, 'P2');
  }

  // ─── TEXTO FLOTANTE ───────────────────────────────
  showFloat(x, y, text, color) {
    const t = this.scene.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: color || '#FFD700'
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: t,
      y: y - 50,
      alpha: 0,
      duration: 800,
      ease: 'Cubic.Out',
      onComplete: () => t.destroy()
    });

    return t;
  }

  // ─── TEXTO DE OLEADA ──────────────────────────────
  showWaveText(text) {
    const W = this.scene.scale.width;
    const H = this.scene.scale.height;
    const t = this.scene.add.text(W / 2, H / 2, text, {
      fontFamily: 'monospace',
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: t,
      alpha: 0,
      y: H / 2 - 60,
      duration: 1500,
      ease: 'Cubic.Out',
      onComplete: () => t.destroy()
    });
  }

  // ─── TEXTO DE UPGRADE DE ARMA ─────────────────────
  showWeaponUpgrade(level, name) {
    const W = this.scene.scale.width;
    const H = this.scene.scale.height;

    const t = this.scene.add.text(W / 2, H / 2, '⚡ ' + name, {
      fontFamily: 'monospace',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: t,
      alpha: 0,
      y: H / 2 - 70,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 1800,
      ease: 'Cubic.Out',
      onComplete: () => t.destroy()
    });
  }

  // ─── BARRA HP DEL BOSS ────────────────────────────
  drawBossHP(hp, maxHp) {
    const W = this.scene.scale.width;
    const gfx = this.elements.hpGfx;
    if (!gfx) return;

    const bw = W * 0.6;
    const bx = (W - bw) / 2;
    const by = 10;
    const pct = Math.max(0, hp / maxHp);

    // Fondo
    gfx.fillStyle(0x111111);
    gfx.fillRect(bx - 2, by - 2, bw + 4, 18);
    // Relleno
    const col = pct > 0.6 ? 0xFF0055 : pct > 0.3 ? 0xFF6600 : 0xFF0000;
    gfx.fillStyle(col);
    gfx.fillRect(bx, by, bw * pct, 14);
    // Brillo
    gfx.fillStyle(0xFFFFFF, 0.15);
    gfx.fillRect(bx, by, bw * pct, 4);
    // Borde
    gfx.lineStyle(2, 0xFF0055, 0.7);
    gfx.strokeRect(bx, by, bw, 14);
  }

  // ─── PANTALLA GAME OVER ───────────────────────────
  showGameOver(score, bestScore, scene) {
    const s = scene || this.scene;
    const W = s.scale.width;
    const H = s.scale.height;

    // Fondo oscuro que aparece gradualmente
    const overlay = s.add.graphics();
    overlay.fillStyle(0x000000, 0);
    overlay.fillRect(0, 0, W, H);
    s.tweens.add({ targets: overlay, alpha: 0.85, duration: 800 });

    // Título GAME OVER
    const goText = s.add.text(W / 2, H * 0.3, 'GAME OVER', {
      fontFamily: 'monospace',
      fontSize: '64px',
      fontStyle: 'bold',
      color: '#FF0000',
      shadow: { blur: 30, color: '#FF0000', fill: true }
    }).setOrigin(0.5).setAlpha(0);

    s.tweens.add({
      targets: goText, alpha: 1,
      scaleX: 1, scaleY: 1,
      duration: 500, ease: 'Back.Out', delay: 300
    });

    // Score final
    s.add.text(W / 2, H * 0.48,
      'SCORE FINAL', {
      fontFamily: 'monospace', fontSize: '12px',
      color: '#FFD700', alpha: 0.5, letterSpacing: 6
    }).setOrigin(0.5);

    s.add.text(W / 2, H * 0.55, score.toLocaleString(), {
      fontFamily: 'monospace', fontSize: '48px',
      fontStyle: 'bold', color: '#FFD700',
      shadow: { blur: 15, color: '#FFD700', fill: true }
    }).setOrigin(0.5);

    // Mejor score
    s.add.text(W / 2, H * 0.67,
      'MEJOR: ' + bestScore.toLocaleString(), {
      fontFamily: 'monospace', fontSize: '16px',
      color: '#AAAAAA'
    }).setOrigin(0.5);

    // Botón reiniciar
    const restart = s.add.text(W / 2, H * 0.80,
      '[ ENTER PARA REINTENTAR ]', {
      fontFamily: 'monospace', fontSize: '16px',
      color: '#00E5FF'
    }).setOrigin(0.5);

    s.tweens.add({
      targets: restart, alpha: 0,
      duration: 700, yoyo: true, repeat: -1
    });
  }
}

