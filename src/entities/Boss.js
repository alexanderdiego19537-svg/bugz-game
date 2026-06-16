// ═══════════════════════════════════════════════════════════
// BOSS.JS — El Jefe Final de BUGZ
// Emiliano: este es tu archivo principal mañana
// ═══════════════════════════════════════════════════════════

import { Sprites } from '../visuals/Sprites.js';

export class Boss {
  constructor(scene) {
    this.scene = scene;
    const W = scene.scale.width;

    // ── Stats base ──────────────────────────
    this.x = W / 2;
    this.y = -80;
    this.hp = 1000;
    this.maxHp = 1000;
    this.phase = 1;         // 1, 2 o 3
    this.alive = true;
    this.gfx = scene.add.graphics();
    this.hpGfx = scene.add.graphics();
    this.flashTimer = 0;
    this.angle = 0;
    this.eyeAngle = 0;

    // ── Movimiento ──────────────────────────
    this.vx = 60;
    this.vy = 0;
    this.targetY = 110;
    this.entryDone = false;

    // ── Ataques ─────────────────────────────
    this.attackTimer = 0;
    this.attackRate = 2200;   // ms entre ataques
    this.bullets = [];        // balas del boss
    this.bulletGfxPool = [];

    // ── Entrada dramática ────────────────────
    this.scene.cameras.main.shake(400, 0.02);
    this._showAnnouncement();
    if (scene.sfx && scene.sfx.bossAppear) {
      scene.sfx.bossAppear();
    }
  }

  // ─── Anuncio de entrada ──────────────────
  _showAnnouncement() {
    const W = this.scene.scale.width;
    const H = this.scene.scale.height;

    const t = this.scene.add.text(W / 2, H * 0.4, '⚠ SEGMENTATION FAULT ⚠', {
      fontFamily: 'monospace',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#FF0055',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5).setAlpha(0);

    this.scene.tweens.add({
      targets: t,
      alpha: 1,
      duration: 300,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.scene.tweens.add({
          targets: t,
          alpha: 0,
          y: H * 0.3,
          duration: 800,
          onComplete: () => t.destroy()
        });
      }
    });
  }

  // ─── Dibuja el boss ──────────────────────
  draw(time) {
    this.gfx.clear();
    this.hpGfx.clear();
    if (!this.alive) return;

    const flash = this.flashTimer > 0;
    Sprites.drawBoss(this.gfx, this.x, this.y, this.phase, time, flash);

    // ── Barra de vida del boss ───────────────
    this._drawHPBar();

    // ── Balas del boss ───────────────────────
    this._drawBullets();
  }

  // ─── Dibuja hexágono ────────────────────
  _drawHex(cx, cy, r, angle) {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const a = angle + (i * Math.PI / 3);
      points.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
    // Dibuja como triángulos desde el centro
    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6;
      this.gfx.fillTriangle(
        cx, cy,
        points[i].x, points[i].y,
        points[next].x, points[next].y
      );
    }
  }

  // ─── Barra HP del boss ──────────────────
  _drawHPBar() {
    const W = this.scene.scale.width;
    const bw = W * 0.6;
    const bx = (W - bw) / 2;
    const by = 12;
    const pct = Math.max(0, this.hp / this.maxHp);

    // Fondo
    this.hpGfx.fillStyle(0x111111);
    this.hpGfx.fillRect(bx - 2, by - 2, bw + 4, 18);

    // Relleno
    const col = pct > 0.6 ? 0xFF0055 : pct > 0.3 ? 0xFF6600 : 0xFF0000;
    this.hpGfx.fillStyle(col);
    this.hpGfx.fillRect(bx, by, bw * pct, 14);

    // Brillo superior
    this.hpGfx.fillStyle(0xFFFFFF, 0.15);
    this.hpGfx.fillRect(bx, by, bw * pct, 4);

    // Borde
    this.hpGfx.lineStyle(2, 0xFF0055, 0.7);
    this.hpGfx.strokeRect(bx, by, bw, 14);

    // Texto nombre
    // (el texto se crea una vez, no cada frame — se maneja desde GameScene)
  }

  // ─── Dibuja balas del boss ──────────────
  _drawBullets() {
    this.bullets.forEach(b => {
      b.gfx.clear();
      if (!b.alive) return;

      const phaseColors = [0xFF0055, 0xFF6600, 0xFF2200];
      const col = phaseColors[this.phase - 1];

      b.gfx.fillStyle(col, 0.3);
      b.gfx.fillCircle(b.x, b.y, b.r + 5);
      b.gfx.fillStyle(col);
      b.gfx.fillCircle(b.x, b.y, b.r);
      b.gfx.fillStyle(0xFFFFFF, 0.6);
      b.gfx.fillCircle(b.x - 2, b.y - 2, b.r * 0.3);
    });
  }

  // ─── Update (llamar desde GameScene.update) ──
  update(delta, time, players) {
    if (!this.alive) return;

    // ── Entrada ───────────────────────────
    if (!this.entryDone) {
      this.y += 90 * (delta / 1000);
      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.entryDone = true;
      }
      return;
    }

    // ── Movimiento lateral ────────────────
    this.x += this.vx * (delta / 1000);
    const W = this.scene.scale.width;
    if (this.x > W - 80) { this.x = W - 80; this.vx *= -1; }
    if (this.x < 80)     { this.x = 80;     this.vx *= -1; }

    // ── Movimiento vertical sinusoidal ────
    this.y = this.targetY + Math.sin(time * 0.001) * 30;

    // ── Flash timer ───────────────────────
    if (this.flashTimer > 0) this.flashTimer -= delta;

    // ── Ataque ────────────────────────────
    this.attackTimer += delta;
    if (this.attackTimer >= this.attackRate) {
      this.attackTimer = 0;
      this._attack(players);
    }

    // ── Mueve balas ───────────────────────
    const H = this.scene.scale.height;
    this.bullets.forEach(b => {
      if (!b.alive) return;
      b.life -= delta;
      b.x += b.vx * (delta / 1000);
      b.y += b.vy * (delta / 1000);
      if (b.life <= 0 || b.y > H + 20 || b.x < -20 || b.x > W + 20) {
        b.alive = false;
        b.gfx.destroy();
      }
    });
    this.bullets = this.bullets.filter(b => b.alive);

    // ── Verifica colisión balas → jugadores ──
    this.bullets.forEach(b => {
      if (!b.alive) return;
      players.forEach(p => {
        if (!p || p.hp <= 0) return;
        if (Math.hypot(b.x - p.x, b.y - p.y) < b.r + 16) {
          b.alive = false;
          b.gfx.destroy();
          // Llama al sistema de daño de la escena
          if (this.scene.hurtPlayer) this.scene.hurtPlayer(p, b.damage);
        }
      });
    });

    // ── Cambia de fase ────────────────────
    this._checkPhase();

    // ── Dibuja ────────────────────────────
    this.draw(time);
  }

  // ─── Patrones de ataque ─────────────────
  _attack(players) {
    if (this.phase === 1) this._attackSpread();
    else if (this.phase === 2) this._attackSpread(); this._attackAim(players);
    if (this.phase === 3) this._attackRing();
  }

  // Disparo disperso (5 balas en abanico)
  _attackSpread() {
    const baseAngle = Math.PI / 2; // hacia abajo
    const count = 4 + this.phase;
    for (let i = 0; i < count; i++) {
      const a = baseAngle - 0.6 + (i * 1.2 / (count - 1));
      this._spawnBullet(
        this.x, this.y + 50,
        Math.cos(a) * 200, Math.sin(a) * 200,
        8, 15
      );
    }
  }

  // Disparo apuntado al jugador más cercano
  _attackAim(players) {
    let nearest = null;
    let minDist = Infinity;
    players.forEach(p => {
      if (!p || p.hp <= 0) return;
      const d = Math.hypot(p.x - this.x, p.y - this.y);
      if (d < minDist) { minDist = d; nearest = p; }
    });
    if (!nearest) return;

    const angle = Math.atan2(nearest.y - this.y, nearest.x - this.x);
    this._spawnBullet(
      this.x, this.y,
      Math.cos(angle) * 280, Math.sin(angle) * 280,
      10, 20
    );
  }

  // Anillo de 8 balas en todas direcciones
  _attackRing() {
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8;
      this._spawnBullet(
        this.x, this.y,
        Math.cos(a) * 180, Math.sin(a) * 180,
        9, 18
      );
    }
  }

  // Crea una bala del boss
  _spawnBullet(x, y, vx, vy, r, damage) {
    this.bullets.push({
      x, y, vx, vy, r, damage,
      life: 3000,
      alive: true,
      gfx: this.scene.add.graphics()
    });
  }

  // ─── Recibe daño ─────────────────────────
  takeDamage(amount) {
    if (!this.alive) return;
    this.hp -= amount;
    this.flashTimer = 120;
    this.scene.cameras.main.shake(60, 0.006);

    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      this._die();
    }
  }

  // ─── Cambio de fase ──────────────────────
  _checkPhase() {
    const pct = this.hp / this.maxHp;
    let newPhase = 1;
    if (pct <= 0.6) newPhase = 2;
    if (pct <= 0.3) newPhase = 3;

    if (newPhase > this.phase) {
      this.phase = newPhase;
      this.attackRate = Math.max(800, 2200 - (newPhase * 400));
      this.vx = 60 + newPhase * 30;
      this.scene.cameras.main.shake(500, 0.025);

      const msgs = ['', '', '⚠ FASE 2 — SE ENOJÓ', '🔴 FASE FINAL — CORRE'];
      this._showPhaseText(msgs[newPhase]);
    }
  }

  // ─── Texto de cambio de fase ─────────────
  _showPhaseText(text) {
    const W = this.scene.scale.width;
    const H = this.scene.scale.height;
    const t = this.scene.add.text(W / 2, H / 2, text, {
      fontFamily: 'monospace',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#FF0055',
      stroke: '#000000',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: t,
      alpha: 0,
      y: H / 2 - 80,
      duration: 1800,
      ease: 'Cubic.Out',
      onComplete: () => t.destroy()
    });
  }

  // ─── Muerte del boss ─────────────────────
  _die() {
    const W = this.scene.scale.width;
    const H = this.scene.scale.height;

    // Explosiones en cascada
    for (let i = 0; i < 5; i++) {
      this.scene.time.delayedCall(i * 180, () => {
        const ox = this.x + Phaser.Math.Between(-40, 40);
        const oy = this.y + Phaser.Math.Between(-40, 40);
        if (this.scene.spawnExplosion) {
          this.scene.spawnExplosion(ox, oy, 0xFF0055, 20);
          this.scene.spawnExplosion(ox, oy, 0xFF6600, 12);
        }
        this.scene.cameras.main.shake(200, 0.02);
      });
    }

    // Limpia gráficos del boss
    this.scene.time.delayedCall(900, () => {
      this.gfx.destroy();
      this.hpGfx.destroy();
      this.bullets.forEach(b => b.gfx.destroy());
      this.bullets = [];

      // Muestra victoria
      const vic = this.scene.add.text(W / 2, H / 2, '🏆 SEGFAULT ELIMINADO', {
        fontFamily: 'monospace',
        fontSize: '30px',
        fontStyle: 'bold',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 6
      }).setOrigin(0.5).setAlpha(0);

      this.scene.tweens.add({
        targets: vic,
        alpha: 1,
        duration: 500,
        hold: 2000,
        onComplete: () => {
          // Señal a la escena de que el boss murió
          if (this.scene.onBossDead) this.scene.onBossDead();
        }
      });
    });
  }

  // ─── Verifica si una bala del jugador golpea al boss ──
  checkBulletHit(bullet) {
    if (!this.alive || !bullet.alive) return false;
    const r = 48; // radio del boss
    if (Math.hypot(bullet.x - this.x, bullet.y - this.y) < r + bullet.r) {
      this.takeDamage(bullet.damage);
      return true;
    }
    return false;
  }
}
