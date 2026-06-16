// ═══════════════════════════════════════════════════════════
// SOUNDSYSTEM.JS — Audio generado con código (Web Audio API)
// Diseñadora de sonido: Yenisei
// Regla: NO archivos de audio externos
// ═══════════════════════════════════════════════════════════

export class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.masterVolume = 0.35;
  }

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      this.enabled = false;
    }
  }

  // ─── FUNCIÓN BASE ─────────────────────────────────
  play(freq, type, duration, volume, delay = 0, detune = 0) {
    if (!this.ctx || !this.enabled) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      filter.type = 'lowpass';
      filter.frequency.value = 3000;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      osc.detune.value = detune;

      const vol = volume * this.masterVolume;
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) {}
  }

  // ─── SONIDOS DEL JUGADOR ─────────────────────────

  shootLevel1() {
    this.play(900, 'square', 0.06, 0.15);
    this.play(700, 'sine', 0.05, 0.08, 0.02);
  }

  shootLevel2() {
    this.play(600, 'square', 0.08, 0.2);
    this.play(1200, 'triangle', 0.05, 0.1, 0.01);
  }

  shootLevel3() {
    this.play(400, 'sawtooth', 0.1, 0.25);
    this.play(800, 'square', 0.06, 0.15, 0.01);
    this.play(1600, 'sine', 0.04, 0.1, 0.02);
  }

  shootLevel4() {
    this.play(200, 'sawtooth', 0.15, 0.35);
    this.play(400, 'square', 0.1, 0.25, 0.01);
    this.play(100, 'sine', 0.2, 0.3, 0.0, -200);
  }

  // Disparo según nivel
  shoot(level) {
    if (level === 1) this.shootLevel1();
    else if (level === 2) this.shootLevel2();
    else if (level === 3) this.shootLevel3();
    else this.shootLevel4();
  }

  playerHurt() {
    this.play(120, 'sawtooth', 0.25, 0.5);
    this.play(80, 'square', 0.3, 0.4, 0.03, -150);
  }

  gameOver() {
    [400, 300, 200, 150].forEach((f, i) => {
      this.play(f, 'triangle', 0.3, 0.4, i * 0.15);
    });
  }

  // ─── SONIDOS DE ENEMIGOS ──────────────────────────

  enemyDie() {
    this.play(200, 'sawtooth', 0.12, 0.3);
    this.play(150, 'square', 0.1, 0.2, 0.02);
  }

  enemyDieBig() {
    this.play(100, 'sawtooth', 0.25, 0.4);
    this.play(80, 'square', 0.2, 0.35, 0.03);
    this.play(150, 'triangle', 0.15, 0.25, 0.06);
  }

  enemyHit() {
    this.play(300, 'sawtooth', 0.1, 0.3);
  }

  // ─── SONIDOS DEL JEFE ─────────────────────────────

  bossAppear() {
    this.play(60, 'sawtooth', 0.6, 0.5);
    this.play(80, 'square', 0.5, 0.4, 0.1);
    this.play(100, 'sawtooth', 0.4, 0.3, 0.2);
    this.play(55, 'sine', 0.8, 0.5, 0.0, -100);
  }

  bossShoot() {
    this.play(150, 'sawtooth', 0.15, 0.35);
    this.play(100, 'square', 0.12, 0.25, 0.02);
  }

  bossPhaseChange() {
    [200, 400, 200, 100].forEach((f, i) => {
      this.play(f, 'sawtooth', 0.2, 0.4, i * 0.1);
    });
  }

  bossDie() {
    this.play(80, 'sawtooth', 0.8, 0.6);
    this.play(60, 'square', 0.6, 0.5, 0.05);
    this.play(100, 'sawtooth', 0.5, 0.4, 0.1);
    this.play(40, 'sine', 1.0, 0.7, 0.0);
    // Victoria
    [400, 600, 800, 1000, 1200].forEach((f, i) => {
      this.play(f, 'triangle', 0.2, 0.35, 0.4 + i * 0.08);
    });
  }

  // ─── SONIDOS DE UI ────────────────────────────────

  levelUp() {
    [300, 400, 500, 600, 800, 1000].forEach((f, i) => {
      this.play(f, 'triangle', 0.18, 0.3, i * 0.07);
    });
  }

  weaponUpgrade() {
    [400, 600, 800, 600, 1000, 1200].forEach((f, i) => {
      this.play(f, 'triangle', 0.2, 0.35, i * 0.06);
    });
    this.play(200, 'sawtooth', 0.4, 0.4, 0.0);
  }

  collectGem() {
    this.play(1000, 'sine', 0.06, 0.15);
    this.play(1400, 'sine', 0.04, 0.1, 0.03);
  }

  waveClear() {
    [500, 700, 900, 1100].forEach((f, i) => {
      this.play(f, 'triangle', 0.15, 0.25, i * 0.08);
    });
  }

  menuSelect() {
    this.play(600, 'triangle', 0.1, 0.2);
    this.play(900, 'sine', 0.08, 0.15, 0.05);
  }
}
