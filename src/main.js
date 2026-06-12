import Phaser from 'phaser';

// ─── ESCENA DEL MENÚ ─────────────────────────────
class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Fondo
    this.add.rectangle(W/2, H/2, W, H, 0x050010);

    // Título BUGZ
    this.add.text(W/2, H*0.35, 'BUGZ', {
      fontFamily: 'monospace',
      fontSize: '80px',
      fontStyle: 'bold',
      color: '#00FF88',
      stroke: '#003322',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Subtítulo
    this.add.text(W/2, H*0.50, 'EL PROGRAMADOR VS LOS BUGS', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#FFD700'
    }).setOrigin(0.5);

    // Instrucción parpadeante
    const startText = this.add.text(
      W/2, H*0.68,
      '[ PRESIONA ENTER PARA EMPEZAR ]', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#00E5FF'
    }).setOrigin(0.5);

    // Animación de parpadeo
    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    // Controles
    this.add.text(W/2, H*0.82, 'P1: FLECHAS          P2: WASD', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#FFFFFF',
      alpha: 0.35
    }).setOrigin(0.5);

    // Escuchar Enter para ir al juego
    this.input.keyboard.on('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });
  }
}

// ─── ESCENA DEL JUEGO ────────────────────────────
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // ── FONDO ──────────────────────────────────
    this.bgGfx = this.add.graphics();
    this.drawBackground();

    // ── SCORE ──────────────────────────────────
    this.score = 0;
    this.wave = 1;

    this.scoreText = this.add.text(16, 14, 'SCORE: 0', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#FFD700'
    });

    this.waveText = this.add.text(W/2, 14, 'OLEADA 1', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#FF4500',
      letterSpacing: 4
    }).setOrigin(0.5, 0);

    // ── JUGADOR 1 ──────────────────────────────
    this.p1 = {
      x: W * 0.35, y: H / 2,
      hp: 100, maxHp: 100,
      speed: 220,
      gfx: this.add.graphics(),
      weaponLevel: 1,
      invTimer: 0
    };

    // ── JUGADOR 2 ──────────────────────────────
    this.p2 = {
      x: W * 0.65, y: H / 2,
      hp: 100, maxHp: 100,
      speed: 220,
      gfx: this.add.graphics(),
      weaponLevel: 1,
      invTimer: 0
    };

    // ── CONTROLES P1 — FLECHAS ─────────────────
    this.cursors = this.input.keyboard.createCursorKeys();

    // ── CONTROLES P2 — WASD ────────────────────
    this.wasd = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // ── ENEMIGOS ───────────────────────────────
    this.enemies = [];

    // ── BALAS ──────────────────────────────────
    this.bullets = [];

    // ── BARRAS DE VIDA ─────────────────────────
    this.hpGfx = this.add.graphics();

    // ── PARTÍCULAS ─────────────────────────────
    this.particles = [];

    // ── TEXTOS FLOTANTES ───────────────────────
    this.floatTexts = [];

    // ── TIMERS ─────────────────────────────────
    // Disparo automático
    this.shootTimer = 0;
    this.shootRate = 350; // ms

    // Spawn de enemigos
    this.spawnTimer = 0;
    this.spawnRate = 2000;
    this.enemiesSpawned = 0;
    this.enemiesThisWave = 6;

    // Wave clear
    this.waveClearTimer = 0;
    this.waveClearing = false;

    // ── TIEMPO ─────────────────────────────────
    this.gameTime = 0;

    // ── INICIA OLEADA ──────────────────────────
    this.startWave();
  }

  // ─── FONDO ───────────────────────────────────
  drawBackground() {
    const W = this.scale.width;
    const H = this.scale.height;
    this.bgGfx.clear();

    // Fondo base
    this.bgGfx.fillStyle(0x050010);
    this.bgGfx.fillRect(0, 0, W, H);

    // Grid sutil
    this.bgGfx.lineStyle(1, 0x0A0035, 0.5);
    for (let x = 0; x < W; x += 48) {
      this.bgGfx.lineBetween(x, 0, x, H);
    }
    for (let y = 0; y < H; y += 48) {
      this.bgGfx.lineBetween(0, y, W, y);
    }
  }

  // ─── INICIA OLEADA ───────────────────────────
  startWave() {
    this.enemiesSpawned = 0;
    this.enemiesThisWave = 4 + (this.wave * 3);
    this.spawnRate = Math.max(600, 2000 - (this.wave * 120));
    this.spawnTimer = 0;
    this.waveClearing = false;

    // Texto de oleada
    this.showWaveText('OLEADA ' + this.wave);
  }

  showWaveText(text) {
    const W = this.scale.width;
    const H = this.scale.height;
    const t = this.add.text(W/2, H/2, text, {
      fontFamily: 'monospace',
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.tweens.add({
      targets: t,
      alpha: 0,
      y: H/2 - 60,
      duration: 1500,
      ease: 'Cubic.Out',
      onComplete: () => t.destroy()
    });
  }

  // ─── SPAWN ENEMIGO ───────────────────────────
  spawnEnemy() {
    const W = this.scale.width;
    const H = this.scale.height;
    const pad = 40;
    const side = Phaser.Math.Between(0, 3);
    let x, y;

    if (side === 0) { x = Phaser.Math.Between(pad, W-pad); y = -pad; }
    else if (side === 1) { x = W + pad; y = Phaser.Math.Between(pad, H-pad); }
    else if (side === 2) { x = Phaser.Math.Between(pad, W-pad); y = H + pad; }
    else { x = -pad; y = Phaser.Math.Between(pad, H-pad); }

    // Elige tipo según oleada
    const roll = Math.random();
    let type = 'nullpointer';
    if (this.wave >= 2 && roll < 0.3) type = 'stackoverflow';
    if (this.wave >= 3 && roll < 0.15) type = 'syntaxerror';

    const stats = {
      nullpointer: { hp: 20 + this.wave*8,  spd: 80 + this.wave*8,  r: 12, col: 0xFF4444, pts: 50  },
      stackoverflow:{ hp: 40 + this.wave*10, spd: 55 + this.wave*5,  r: 18, col: 0xFF8C00, pts: 100 },
      syntaxerror:  { hp: 90 + this.wave*15, spd: 35 + this.wave*3,  r: 24, col: 0xFF0055, pts: 200 },
    };

    const s = stats[type];
    this.enemies.push({
      x, y, type,
      hp: s.hp, maxHp: s.hp,
      spd: s.spd, r: s.r,
      col: s.col, pts: s.pts,
      gfx: this.add.graphics(),
      hpGfx: this.add.graphics(),
      flashTimer: 0,
      angle: 0,
      alive: true
    });
    this.enemiesSpawned++;
  }

  // ─── DIBUJA JUGADOR ──────────────────────────
  drawPlayer(p, num, time) {
    p.gfx.clear();
    if (p.hp <= 0) return;

    // Parpadeo cuando recibe daño
    if (p.invTimer > 0 && Math.floor(p.invTimer / 80) % 2 === 0) return;

    const col = num === 1 ? 0x00FF88 : 0x00E5FF;

    // Glow exterior
    p.gfx.fillStyle(col, 0.08);
    p.gfx.fillCircle(p.x, p.y, 32);
    p.gfx.fillStyle(col, 0.12);
    p.gfx.fillCircle(p.x, p.y, 26);

    // Cuerpo principal
    p.gfx.fillStyle(col);
    p.gfx.fillCircle(p.x, p.y, 18);

    // Pantalla de laptop adentro
    p.gfx.fillStyle(0x001122);
    p.gfx.fillRect(p.x - 10, p.y - 7, 20, 14);

    // Líneas de código en la pantalla (parpadean)
    const blink = Math.floor(time / 500) % 2;
    p.gfx.fillStyle(col);
    p.gfx.fillRect(p.x - 8, p.y - 5, 10 + blink*3, 2);
    p.gfx.fillRect(p.x - 8, p.y - 1, 7, 2);
    p.gfx.fillRect(p.x - 8, p.y + 3, 12, 2);

    // Borde pulsante
    const pulse = 0.6 + Math.sin(time * 0.004) * 0.4;
    p.gfx.lineStyle(2, col, pulse);
    p.gfx.strokeCircle(p.x, p.y, 20);

    // Número de jugador
    p.gfx.fillStyle(0xFFFFFF, 0.5);
  }

  // ─── DIBUJA ENEMIGO ──────────────────────────
  drawEnemy(e, time) {
    e.gfx.clear();
    e.hpGfx.clear();
    if (!e.alive) return;

    const flash = e.flashTimer > 0;
    const col = flash ? 0xFFFFFF : e.col;
    e.angle += 0.03;

    // Glow
    e.gfx.fillStyle(col, 0.08);
    e.gfx.fillCircle(e.x, e.y, e.r + 10);

    // Forma según tipo
    if (e.type === 'nullpointer') {
      // Círculo con X
      e.gfx.fillStyle(col);
      e.gfx.fillCircle(e.x, e.y, e.r);
      e.gfx.lineStyle(2.5, flash ? 0x000000 : 0xFFFFFF, 0.9);
      e.gfx.lineBetween(e.x-6, e.y-6, e.x+6, e.y+6);
      e.gfx.lineBetween(e.x+6, e.y-6, e.x-6, e.y+6);
    }
    else if (e.type === 'stackoverflow') {
      // Cuadrados apilados
      e.gfx.fillStyle(col);
      e.gfx.fillRect(e.x-e.r, e.y-e.r, e.r*2, e.r*2);
      e.gfx.fillStyle(col, 0.6);
      e.gfx.fillRect(e.x-e.r+4, e.y-e.r-6, e.r*2-4, e.r*2-4);
      e.gfx.lineStyle(2, 0xFFFFFF, 0.4);
      e.gfx.strokeRect(e.x-e.r, e.y-e.r, e.r*2, e.r*2);
    }
    else if (e.type === 'syntaxerror') {
      // Diamante grande con !
      e.gfx.fillStyle(col);
      e.gfx.fillTriangle(e.x, e.y-e.r, e.x+e.r*.8, e.y, e.x, e.y+e.r);
      e.gfx.fillTriangle(e.x, e.y-e.r, e.x-e.r*.8, e.y, e.x, e.y+e.r);
      // Signo !
      e.gfx.fillStyle(0xFFFFFF);
      e.gfx.fillRect(e.x-2, e.y-12, 4, 12);
      e.gfx.fillRect(e.x-2, e.y+3, 4, 4);
    }

    // Barra de HP encima del enemigo
    if (e.maxHp >= 40) {
      const bw = e.r * 2.5;
      const bx = e.x - bw/2;
      const by = e.y - e.r - 10;
      const pct = e.hp / e.maxHp;
      e.hpGfx.fillStyle(0x333333);
      e.hpGfx.fillRect(bx, by, bw, 4);
      e.hpGfx.fillStyle(pct > 0.5 ? 0x00FF00 : pct > 0.25 ? 0xFFAA00 : 0xFF0000);
      e.hpGfx.fillRect(bx, by, bw * pct, 4);
    }
  }

  // ─── DIBUJA BALA ─────────────────────────────
  drawBullet(b) {
    b.gfx.clear();
    if (!b.alive) return;

    const colors = [0xFFD700, 0x00E5FF, 0xFF4500, 0xFF0055];
    const col = colors[b.weaponLevel - 1] || 0xFFD700;
    const size = 5 + (b.weaponLevel * 1.5);

    b.gfx.fillStyle(col, 0.25);
    b.gfx.fillCircle(b.x, b.y, size + 6);
    b.gfx.fillStyle(col);
    b.gfx.fillCircle(b.x, b.y, size);
    b.gfx.fillStyle(0xFFFFFF, 0.7);
    b.gfx.fillCircle(b.x - 1, b.y - 1, size * 0.35);
  }

  // ─── DIBUJA BARRAS HP JUGADORES ──────────────
  drawHPBars() {
    const W = this.scale.width;
    const H = this.scale.height;
    this.hpGfx.clear();

    // P1 — abajo izquierda
    const drawBar = (x, y, current, max, col, label) => {
      const bw = 180;
      // Label
      this.hpGfx.fillStyle(col, 0.6);
      // Fondo
      this.hpGfx.fillStyle(0x222222);
      this.hpGfx.fillRect(x, y, bw, 12);
      // Relleno
      const pct = Math.max(0, current / max);
      const barCol = pct > 0.5 ? col : pct > 0.25 ? 0xFFAA00 : 0xFF0000;
      this.hpGfx.fillStyle(barCol);
      this.hpGfx.fillRect(x, y, bw * pct, 12);
      // Borde
      this.hpGfx.lineStyle(1, col, 0.4);
      this.hpGfx.strokeRect(x, y, bw, 12);
    };

    drawBar(16, H - 42, this.p1.hp, this.p1.maxHp, 0x00FF88, 'P1');
    drawBar(W - 196, H - 42, this.p2.hp, this.p2.maxHp, 0x00E5FF, 'P2');

    // Labels de vida
    this.hpGfx.fillStyle(0x00FF88, 0.5);
    this.hpGfx.fillRect(16, H - 56, 2, 10);

    this.hpGfx.fillStyle(0x00E5FF, 0.5);
    this.hpGfx.fillRect(W - 196, H - 56, 2, 10);
  }

  // ─── DISPARO AUTOMÁTICO ──────────────────────
  shoot(player) {
    if (player.hp <= 0) return;
    if (this.enemies.length === 0) return;

    // Encuentra el enemigo más cercano
    let nearest = null;
    let minDist = Infinity;
    this.enemies.forEach(e => {
      if (!e.alive) return;
      const d = Math.hypot(e.x - player.x, e.y - player.y);
      if (d < minDist) { minDist = d; nearest = e; }
    });

    if (!nearest) return;

    const angle = Math.atan2(nearest.y - player.y, nearest.x - player.x);
    const speed = 520;
    const wl = player.weaponLevel;

    // Número de balas según nivel
    const offsets = wl >= 3 ? [-0.22, 0, 0.22] : wl >= 2 ? [-0.15, 0.15] : [0];

    offsets.forEach(offset => {
      const a = angle + offset;
      this.bullets.push({
        x: player.x, y: player.y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        damage: 10 + (wl * 5),
        weaponLevel: wl,
        gfx: this.add.graphics(),
        life: 1500,
        alive: true
      });
    });
  }

  // ─── TEXTO FLOTANTE ──────────────────────────
  spawnFloat(x, y, text, color) {
    const t = this.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: color || '#FFD700'
    }).setOrigin(0.5);
    this.floatTexts.push({ t, vy: -60, life: 900, maxLife: 900 });
  }

  // ─── EXPLOSIÓN DE PARTÍCULAS ─────────────────
  spawnExplosion(x, y, col, count = 14) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 60 + Math.random() * 160;
      const g = this.add.graphics();
      const sz = 2 + Math.random() * 4;
      g.fillStyle(col);
      g.fillCircle(0, 0, sz);
      g.setPosition(x, y);
      this.particles.push({
        g, x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 500 + Math.random() * 300,
        maxLife: 500 + Math.random() * 300,
        sz
      });
    }
  }

  // ─── DAÑO AL JUGADOR ─────────────────────────
  hurtPlayer(player, dmg) {
    if (player.invTimer > 0) return;
    player.hp = Math.max(0, player.hp - dmg);
    player.invTimer = 700;
    this.cameras.main.shake(180, 0.01);
    this.spawnFloat(player.x, player.y - 30, '-' + dmg, '#FF4444');
    if (player.hp <= 0) {
      this.checkGameOver();
    }
  }

  checkGameOver() {
    if (this.p1.hp <= 0 && this.p2.hp <= 0) {
      this.time.delayedCall(800, () => {
        this.scene.start('GameOverScene', { score: this.score });
      });
    }
  }

  // ─── UPGRADE ARMA ────────────────────────────
  checkWeaponUpgrade() {
    const thresholds = [0, 500, 1500, 3000];
    [this.p1, this.p2].forEach(p => {
      const newLevel = thresholds.filter(t => this.score >= t).length;
      if (newLevel > p.weaponLevel && newLevel <= 4) {
        p.weaponLevel = newLevel;
        const names = ['','console.log','debugger','git push --force','sudo rm -rf'];
        this.showWaveText('⚡ ' + names[newLevel]);
        this.cameras.main.shake(250, 0.015);
      }
    });
  }

  // ─── UPDATE — 60 VECES POR SEGUNDO ───────────
  update(time, delta) {
    this.gameTime = time;

    // ── Timers ──────────────────────────────
    this.shootTimer += delta;
    this.spawnTimer += delta;
    if (this.p1.invTimer > 0) this.p1.invTimer -= delta;
    if (this.p2.invTimer > 0) this.p2.invTimer -= delta;

    // ── Spawn enemigos ───────────────────────
    if (!this.waveClearing &&
        this.enemiesSpawned < this.enemiesThisWave &&
        this.spawnTimer >= this.spawnRate) {
      this.spawnTimer = 0;
      this.spawnEnemy();
    }

    // ── Verifica si la oleada terminó ────────
    const aliveEnemies = this.enemies.filter(e => e.alive).length;
    if (!this.waveClearing &&
        this.enemiesSpawned >= this.enemiesThisWave &&
        aliveEnemies === 0) {
      this.waveClearing = true;
      this.time.delayedCall(1500, () => {
        this.wave++;
        this.waveText.setText('OLEADA ' + this.wave);
        this.startWave();
      });
    }

    // ── Movimiento P1 ────────────────────────
    const spd1 = this.p1.speed * (delta / 1000);
    if (this.cursors.left.isDown)  this.p1.x -= spd1;
    if (this.cursors.right.isDown) this.p1.x += spd1;
    if (this.cursors.up.isDown)    this.p1.y -= spd1;
    if (this.cursors.down.isDown)  this.p1.y += spd1;

    // ── Movimiento P2 ────────────────────────
    const spd2 = this.p2.speed * (delta / 1000);
    if (this.wasd.left.isDown)  this.p2.x -= spd2;
    if (this.wasd.right.isDown) this.p2.x += spd2;
    if (this.wasd.up.isDown)    this.p2.y -= spd2;
    if (this.wasd.down.isDown)  this.p2.y += spd2;

    // Límites de pantalla
    const W = this.scale.width;
    const H = this.scale.height;
    this.p1.x = Phaser.Math.Clamp(this.p1.x, 20, W-20);
    this.p1.y = Phaser.Math.Clamp(this.p1.y, 20, H-20);
    this.p2.x = Phaser.Math.Clamp(this.p2.x, 20, W-20);
    this.p2.y = Phaser.Math.Clamp(this.p2.y, 20, H-20);

    // ── Disparo automático ───────────────────
    if (this.shootTimer >= this.shootRate) {
      this.shootTimer = 0;
      this.shoot(this.p1);
      this.shoot(this.p2);
    }

    // ── Mueve enemigos ───────────────────────
    this.enemies.forEach(e => {
      if (!e.alive) return;
      if (e.flashTimer > 0) e.flashTimer -= delta;

      // Va hacia el jugador más cercano
      const d1 = Math.hypot(this.p1.x - e.x, this.p1.y - e.y);
      const d2 = Math.hypot(this.p2.x - e.x, this.p2.y - e.y);
      const target = (this.p1.hp > 0 && d1 <= d2) ? this.p1 : this.p2;

      const angle = Math.atan2(target.y - e.y, target.x - e.x);
      const spd = e.spd * (delta / 1000);
      e.x += Math.cos(angle) * spd;
      e.y += Math.sin(angle) * spd;

      // Golpea al jugador
      const hitDist = e.r + 18;
      if (this.p1.hp > 0 && Math.hypot(this.p1.x - e.x, this.p1.y - e.y) < hitDist) {
        this.hurtPlayer(this.p1, 12);
      }
      if (this.p2.hp > 0 && Math.hypot(this.p2.x - e.x, this.p2.y - e.y) < hitDist) {
        this.hurtPlayer(this.p2, 12);
      }

      this.drawEnemy(e, time);
    });

    // ── Mueve balas ──────────────────────────
    this.bullets.forEach(b => {
      if (!b.alive) return;
      b.life -= delta;
      if (b.life <= 0 || b.x < -50 || b.x > W+50 || b.y < -50 || b.y > H+50) {
        b.alive = false;
        b.gfx.destroy();
        return;
      }
      b.x += b.vx * (delta / 1000);
      b.y += b.vy * (delta / 1000);

      // Golpea enemigos
      this.enemies.forEach(e => {
        if (!e.alive || !b.alive) return;
        if (Math.hypot(b.x - e.x, b.y - e.y) < e.r + 7) {
          b.alive = false;
          b.gfx.destroy();
          e.hp -= b.damage;
          e.flashTimer = 100;
          this.spawnFloat(e.x, e.y - e.r, '-' + b.damage, '#FFFFFF');

          if (e.hp <= 0) {
            e.alive = false;
            this.score += e.pts;
            this.scoreText.setText('SCORE: ' + this.score.toLocaleString());
            this.spawnFloat(e.x, e.y - 20, '+' + e.pts, '#FFD700');
            this.spawnExplosion(e.x, e.y, e.col);
            e.gfx.clear();
            e.hpGfx.clear();
            this.checkWeaponUpgrade();
          }
        }
      });

      this.drawBullet(b);
    });

    // Limpia balas muertas
    this.bullets = this.bullets.filter(b => b.alive);
    this.enemies = this.enemies.filter(e => e.alive);

    // ── Partículas ───────────────────────────
    this.particles.forEach(p => {
      p.life -= delta;
      p.x += p.vx * (delta / 1000);
      p.y += p.vy * (delta / 1000);
      p.vy += 60 * (delta / 1000);
      const a = Math.max(0, p.life / p.maxLife);
      p.g.setPosition(p.x, p.y);
      p.g.setAlpha(a);
    });
    this.particles.filter(p => p.life <= 0).forEach(p => p.g.destroy());
    this.particles = this.particles.filter(p => p.life > 0);

    // ── Textos flotantes ─────────────────────
    this.floatTexts.forEach(f => {
      f.life -= delta;
      f.t.y += f.vy * (delta / 1000);
      f.t.setAlpha(Math.max(0, f.life / f.maxLife));
    });
    this.floatTexts.filter(f => f.life <= 0).forEach(f => f.t.destroy());
    this.floatTexts = this.floatTexts.filter(f => f.life > 0);

    // ── Dibuja jugadores ─────────────────────
    this.drawPlayer(this.p1, 1, time);
    this.drawPlayer(this.p2, 2, time);

    // ── Dibuja barras HP ─────────────────────
    this.drawHPBars();
  }
}

// ─── ESCENA GAME OVER ─────────────────────────
class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data) {
    const W = this.scale.width;
    const H = this.scale.height;
    const score = data.score || 0;

    // Guarda el mejor score
    const best = Math.max(score, parseInt(localStorage.getItem('bugz_best') || '0'));
    localStorage.setItem('bugz_best', best);

    this.add.rectangle(W/2, H/2, W, H, 0x050010);

    // Game Over
    const go = this.add.text(W/2, H*0.28, 'GAME OVER', {
      fontFamily: 'monospace',
      fontSize: '58px',
      fontStyle: 'bold',
      color: '#FF0000',
      stroke: '#550000',
      strokeThickness: 6
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: go, alpha: 1, duration: 500, delay: 200 });

    this.add.text(W/2, H*0.44, 'SCORE FINAL', {
      fontFamily: 'monospace', fontSize: '11px',
      color: '#FFD700', alpha: 0.5, letterSpacing: 6
    }).setOrigin(0.5);

    this.add.text(W/2, H*0.52, score.toLocaleString(), {
      fontFamily: 'monospace', fontSize: '52px',
      fontStyle: 'bold', color: '#FFD700'
    }).setOrigin(0.5);

    this.add.text(W/2, H*0.64,
      'MEJOR: ' + best.toLocaleString(), {
      fontFamily: 'monospace', fontSize: '16px', color: '#AAAAAA'
    }).setOrigin(0.5);

    const restart = this.add.text(W/2, H*0.78,
      '[ ENTER — INTENTAR DE NUEVO ]', {
      fontFamily: 'monospace', fontSize: '16px', color: '#00E5FF'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: restart, alpha: 0,
      duration: 650, yoyo: true, repeat: -1
    });

    this.input.keyboard.on('keydown-ENTER', () => {
      this.scene.start('MenuScene');
    });
  }
}

// ─── CONFIGURACIÓN PHASER ─────────────────────
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#050010',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [MenuScene, GameScene, GameOverScene]
};

new Phaser.Game(config);
