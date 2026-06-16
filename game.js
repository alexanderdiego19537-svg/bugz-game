// ═══════════════════════════════════════════════════════════
// BUGZ — El Programador vs Los Bugs
// Platanus Hack 26 · Arcade Challenge · CDMX
// ═══════════════════════════════════════════════════════════
const W=800,H=600,SK='bugz-hs';

// ─── CABINET KEYS ───────────────────────────────────────
const CABINET_KEYS={
  P1_U:['w'],P1_D:['s'],P1_L:['a'],P1_R:['d'],
  P1_1:['u'],P1_2:['i'],P1_3:['o'],P1_4:['j'],P1_5:['k'],P1_6:['l'],
  P2_U:['ArrowUp'],P2_D:['ArrowDown'],P2_L:['ArrowLeft'],P2_R:['ArrowRight'],
  P2_1:['r'],P2_2:['t'],P2_3:['y'],P2_4:['f'],P2_5:['g'],P2_6:['h'],
  START1:['Enter'],START2:['2'],
};
function normalizeIncomingKey(k){return k.length===1?k.toLowerCase():k}
const KB2ARC={};
for(const[a,ks]of Object.entries(CABINET_KEYS))for(const k of ks)KB2ARC[normalizeIncomingKey(k)]=a;

// ─── INPUT ──────────────────────────────────────────────
const pr={},jp={};
function setupInput(sc){
  sc.input.keyboard.on('keydown',e=>{const a=KB2ARC[normalizeIncomingKey(e.key)];if(a&&!pr[a])jp[a]=true;if(a)pr[a]=true});
  sc.input.keyboard.on('keyup',e=>{const a=KB2ARC[normalizeIncomingKey(e.key)];if(a)pr[a]=false});
}
function eatPress(c){if(jp[c]){jp[c]=false;return true}return false}
function clearJP(){for(const k in jp)jp[k]=false}
function dn(c){return!!pr[c]}

// ─── AUDIO ──────────────────────────────────────────────
let ax=null,mPlay=false;
function initA(){if(ax)return;try{ax=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
function tn(f,d,t,v,dl){
  if(!ax)return;const o=ax.createOscillator(),g=ax.createGain();
  o.type=t||'square';o.frequency.value=f;
  g.gain.setValueAtTime(v||0.12,ax.currentTime+(dl||0));
  g.gain.exponentialRampToValueAtTime(0.001,ax.currentTime+(dl||0)+d);
  o.connect(g);g.connect(ax.destination);o.start(ax.currentTime+(dl||0));o.stop(ax.currentTime+(dl||0)+d);
}
function sShoot(l){tn([880,1100,1320,1760][Math.min(l-1,3)],0.05,'square',0.07)}
function sHit(){tn(220,0.07,'sawtooth',0.08)}
function sDie(){tn(600,0.08,'square',0.08);tn(400,0.12,'square',0.06,0.04)}
function sBigDie(){tn(800,0.08,'square',0.1);tn(600,0.1,'square',0.08,0.05);tn(300,0.15,'sawtooth',0.08,0.1)}
function sHurt(){tn(120,0.18,'sawtooth',0.12);tn(80,0.12,'square',0.08,0.08)}
function sPow(){tn(523,0.07,'sine',0.1);tn(659,0.07,'sine',0.1,0.07);tn(784,0.1,'sine',0.1,0.14)}
function sWave(){tn(523,0.08,'square',0.08);tn(659,0.08,'square',0.08,0.08);tn(784,0.12,'square',0.1,0.16)}
function sBossIn(){for(let i=0;i<6;i++)tn(100+i*70,0.12,'sawtooth',0.07,i*0.05)}
function sBossDie(){for(let i=0;i<10;i++)tn(800-i*55,0.12,'square',0.08,i*0.07)}
function sOver(){tn(440,0.25,'sine',0.1);tn(350,0.25,'sine',0.08,0.25);tn(260,0.4,'sine',0.1,0.5)}
function sMenu(){tn(660,0.06,'square',0.08);tn(880,0.08,'square',0.08,0.05)}
function sDash(){tn(1200,0.06,'sawtooth',0.05)}
function sSkin(){for(let i=0;i<5;i++)tn(400+i*100,0.1,'sine',0.1,i*0.08)}
function sReward(){for(let i=0;i<4;i++)tn(523+i*80,0.08,'square',0.08,i*0.06);tn(1000,0.2,'sine',0.12,0.3)}

// Music
function startM(){
  if(!ax||mPlay)return;mPlay=true;
  const mel=[262,294,330,349,392,349,330,294,262,330,392,440,392,330,294,330];
  const bas=[131,131,165,165,196,196,165,165,131,131,165,165,196,196,131,131];
  let i=0;
  (function p(){if(!mPlay)return;
    tn(mel[i%16],0.22,'square',0.035);tn(bas[i%16],0.24,'triangle',0.025);
    i++;setTimeout(p,260)})();
}
function stopM(){mPlay=false}

// ─── PIXEL ART SYSTEM ───────────────────────────────────
// Draw pixel pattern: pattern=array of strings, cm=color map {char:0xCOLOR}, ps=pixel size
function px(g,x,y,pat,cm,ps){
  const h=pat.length,w=pat[0].length;
  const ox=x-(w*ps)/2,oy=y-(h*ps)/2;
  for(let r=0;r<h;r++)for(let c=0;c<w;c++){
    const ch=pat[r][c];if(ch===' '||ch==='.')continue;
    const cl=cm[ch];if(cl===undefined)continue;
    g.fillStyle(cl);g.fillRect(ox+c*ps,oy+r*ps,ps,ps);
  }
}

// ── PLAYER SPRITE PATTERNS (top-down, 10x12) ────────────
// ── PLAYER SPRITE PATTERNS (top-down, 12x12) ────────────
const P1PAT=[
  '....PPPP....',
  '..HHHHHHHH..',
  '.HSSSSSSSS.',
  'HSSGGGGGGSSH',
  'HSSGGGGGGSSH',
  '.HSSSSSSSS.',
  '..CCCCCCCC..',
  '.CCCCCCCCCC.',
  '.CCSLLLLSCC.',
  '.CCSLLLLSCC.',
  '..CCCCCCCC..',
  '..BB....BB..',
];
const P_WALK=[
  '....PPPP....',
  '..HHHHHHHH..',
  '.HSSSSSSSS.',
  'HSSGGGGGGSSH',
  'HSSGGGGGGSSH',
  '.HSSSSSSSS.',
  '..CCCCCCCC..',
  '.CCCCCCCCCC.',
  '.CCSLLLLSCC.',
  '.CCSLLLLSCC.',
  '..C......C..',
  '.BB......BB.',
];
const P1CM={'P':0xFF00AA,'H':0x00FF88,'S':0xFFCD9B,'G':0x00FFFF,'C':0x222222,'L':0x00FF88,'B':0x443322};
const P2CM={'P':0xFF8C00,'H':0x00A2FF,'S':0xFFCD9B,'G':0xFF00FF,'C':0x330066,'L':0xFFFF00,'B':0x222222};

// ── ENEMY PATTERNS ──────────────────────────────────────
// NullPointer (Spider skull glitch bug, 10x9)
const E_NULL=[
  '...XXXX...',
  '..XYYYYX..',
  '.XYWWWWYX.',
  'XYWOWOWOWX',
  'XYWWWWWWYX',
  '.XYWXXWYX.',
  '..XYWWYX..',
  '.X.XYYX.X.',
  'X..X..X..X',
];
const E_NULL_CM={'X':0x990000,'Y':0xFF3333,'W':0xFFFFFF,'O':0x000000};

// StackOverflow (Magma block overflow monster, 12x8)
const E_STACK=[
  '..DDDDDDDD..',
  '.DYYYYYYYYD.',
  'DYYOOYYOOYYD',
  'DOOOOOOOOOOD',
  'DDDRRDDDRRDD',
  'DRRRRRRRRRRD',
  'DDRRDDRRDDRR',
  '.DXXXXXXXXD.',
];
const E_STACK_CM={'D':0x3A3A3A,'Y':0xFFD700,'O':0xFF8C00,'R':0xFF3300,'X':0x111111};

// SyntaxError (Glowing pink eye with curly braces, 12x10)
const E_SYNTAX=[
  '....PPPP....',
  '..PPWWWWPP..',
  '.PWWOOOOWWP.',
  'PWWOMMMOWWPP',
  'PWWOMMMOWWPP',
  '.PWWOOOOWWP.',
  '..PPWWWWPP..',
  '....PPPP....',
  '...P....P...',
  '..P......P..',
];
const E_SYNTAX_CM={'P':0xFF0055,'W':0xFFFFFF,'O':0x000000,'M':0xFF00FF};

// InfiniteLoop (Green loop vortex, 10x8)
const E_LOOP=[
  '....GGGG....',
  '..GGLWwLGG..',
  '.GLWWOOWWLG.',
  'GLWOOOOOOWLG',
  'GLWOOOOOOWLG',
  '.GLWWOOWWLG.',
  '..GGLWwLGG..',
  '....GGGG....',
];
const E_LOOP_CM={'G':0x006622,'L':0x00FF88,'W':0xFFFFFF,'O':0x000000,'w':0x00FF88};

// 404 NotFound (Ghost with question marks, 12x9)
const E_404=[
  '....WWWW....',
  '..WWWWWWWW..',
  '.WWEEWWEEWW.',
  'WWEEEEEEEEWW',
  'WWWWQQQQWWWW',
  'WWWSSQQSSWWW',
  '.WWSSQQSSWW.',
  '..WSSQQSSW..',
  '..W.W..W.W..',
];
const E_404_CM={'W':0xCCCCCC,'S':0x888888,'E':0xFF0000,'Q':0x00FFFF};

// ── BOSS PATTERNS ───────────────────────────────────────
const BOSS_SEGFAULT=[
  '....XXXXRRXXXX....',
  '...XXRXXRRXXRXX...',
  '..XXRRXXRRXXRRXX..',
  '.XXRRRRRRRRRRRRXX.',
  'XXRRRRRWWWWWRRRRXX',
  'XRRRRRWWWWWWRRRRRX',
  'XRRRRWWOOOOWWRRRRX',
  'RRRRRWOOOOOOWRRRRR',
  'RRRRRWOOOOOOWRRRRR',
  'XRRRRWWOOOOWWRRRRX',
  'XRRRRRWWWWWWRRRRRX',
  'XXRRRRRWWWWWRRRRXX',
  '.XXRRRRRRRRRRRRXX.',
  '..XXRRXXRRXXRRXX..',
  '...XXRXXRRXXRXX...',
  '....XXXXRRXXXX....',
];
const BOSS_SEGFAULT_CM={'X':0x550011,'R':0xFF0033,'W':0xFFFFFF,'O':0x000000};

const BOSS_BLUESCREEN=[
  'GGGGGGGGGGGGGGGG',
  'GBBBBBBBBBBBBBBG',
  'GBWBBBBBBBBBBWBG',
  'GBWBBBBBBBBBBWBG',
  'GBWBBBBBBBBBBWBG',
  'GBBBBBBBBBBBBBBG',
  'GBBBBBBBBBBBBBBG',
  'GBBBBWWRRWWBBBBG',
  'GBBBWBBBBBBWBBBG',
  'GBBBBBBBBBBBBBBG',
  'GGGGGGGGGGGGGGGG',
  '....GGGGGGGG....',
  '...GGGGGGWWGG...',
  '..GGGG....GGGG..',
  '.GGGG......GGGG.',
];
const BOSS_BLUESCREEN_CM={'G':0xCCCCCC,'B':0x0022DD,'W':0xFFFFFF,'R':0xFF0000};

const BOSS_KERNELPANIC=[
  '....RRRRRRRR....',
  '..RRRRRRRRRRRR..',
  '.RRWWWRRRRWWWRR.',
  'RRWWWWWRRWWWWWRR',
  'RRWWOWWRRWWOWWRR',
  'RRWWWWRRRRWWWWRR',
  '.RRRRRRRRRRRRRR.',
  '..RRRRWWWWWRRR..',
  '...RRRWWWWWRR...',
  '....RRRWWWRR....',
  '...RRRRRRRRRR...',
  '..RR.RR..RR.RR..',
  '.RR..RR..RR..RR.',
  'RR...RR..RR...RR',
  '.....RR..RR.....',
];
const BOSS_KERNELPANIC_CM={'R':0x660000,'W':0xFF0000,'O':0xFFFFFF};

// ── MEME PATTERNS ───────────────────────────────────────
const MEME_DOGE=[
  '.1...1..',
  '11...11.',
  '.11111..',
  '.12.21..',
  '.11111..',
  '..333...',
  '.11111..',
  '..111...',
];
const MEME_DOGE_CM={'1':0xDDB060,'2':0x000000,'3':0xFF8888};

const MEME_COFFEE=[
  '..1.1...',
  '..1.1...',
  '.222222.',
  '.233332.',
  '.233332.',
  '.222222.',
  '.222222.',
  '..2222..',
];
const MEME_COFFEE_CM={'1':0xCCCCCC,'2':0xFFFFFF,'3':0x4A2F00};

const MEME_TROLL=[
  '.111111.',
  '11111111',
  '12211221',
  '11111111',
  '13333331',
  '.133331.',
  '..1111..',
  '...11...',
];
const MEME_TROLL_CM={'1':0xFFFFFF,'2':0x000000,'3':0xFF4444};

// ── POWER-UP / HUD PATTERNS ─────────────────────────────
const HEART_PAT=[
  '..11..11..',
  '.1221.1221.',
  '12222122221',
  '12222222221',
  '.122222221.',
  '..1222221..',
  '...12221...',
  '....121...',
  '.....1.....',
];
const HEART_CM={'1':0xFF0055,'2':0xFFFFFF};

const PU_STAR=['..1..','.111.','11111','.111.','..1..'];
const PU_BOLT=['.11','11.','111','..1','111','.11','.1.'];

const TOMB_PAT=[
  '....XXXX....',
  '...XWWWWX...',
  '..XWWWWWWX..',
  '.XWWWWWWWWX.',
  'XWWWWWWWWWWX',
  'XWWWRRIPWWWX',
  'XWWWWRRPWWWX',
  'XWWWWWWWWWWX',
  'XWWWWWWWWWWX',
  'XXXXXXXXXXXX',
];
const TOMB_CM={'X':0x444444,'W':0x888888,'R':0x333333,'I':0x333333,'P':0x333333};

// ── BULLET SYMBOLS ──────────────────────────────────────
const B_PAREN=[
  '..11..',
  '.1....',
  '.1....',
  '.1....',
  '.1....',
  '.1....',
  '..11..',
];
const B_BRACE=[
  '..11..',
  '.1....',
  '1.....',
  '.1....',
  '..11..',
  '.1....',
  '1.....',
  '.1....',
  '..11..',
];
const B_TAG=[
  '....1.',
  '...1..',
  '..1...',
  '.1....',
  '..1...',
  '...1..',
  '....1.',
];

// ── SKIN COLORS (unlock at wave 7, then every 7) ────────
const SKINS=[
  {'H':0x00FF88,'P':0xFF00AA,'C':0x222222,'G':0x00FFFF,'L':0x00FF88}, // default green
  {'H':0xFF6600,'P':0xFF0000,'C':0x111111,'G':0xFFFF00,'L':0xFF3300}, // fire orange
  {'H':0xFF00FF,'P':0x00FFFF,'C':0x2A0033,'G':0xFFFF00,'L':0xFF00FF}, // neon purple
  {'H':0xFFFF00,'P':0x9B30FF,'C':0x004455,'G':0xFF0033,'L':0xFFFF00}, // cyber
  {'H':0xFFFFFF,'P':0x88EEFF,'C':0x0A0A3A,'G':0x00FFFF,'L':0x88EEFF}, // ice
];
const SKINS2=[
  {'H':0x00A2FF,'P':0xFF8C00,'C':0x330066,'G':0xFF00FF,'L':0xFFFF00}, // default blue
  {'H':0xADFF2F,'P':0xFF1493,'C':0x222222,'G':0x00FFFF,'L':0xADFF2F}, // volt
  {'H':0x800000,'P':0x4B0082,'C':0x050505,'G':0xFF0000,'L':0x800000}, // shadow
  {'H':0xFFD700,'P':0x0000FF,'C':0x800000,'G':0xFFFFFF,'L':0xFFD700}, // royal
  {'H':0x00FF00,'P':0xFFFF00,'C':0x003300,'G':0xFF00FF,'L':0x00FF00}, // acid
];

// ─── ENVIRONMENTS ───────────────────────────────────────
const ENVS=[
  {bg:0x0A0A2A,grid:0x12124A,acc:0x00FF88,name:'< IDE >'},
  {bg:0x000A00,grid:0x003300,acc:0x00FF00,name:'TERMINAL $'},
  {bg:0x1A1A1A,grid:0x2A2A2A,acc:0xFF4400,name:'SERVER ROOM'},
  {bg:0x0A0A2E,grid:0x1A1A5E,acc:0x88BBFF,name:'☁ CLOUD'},
  {bg:0x1A000A,grid:0x3A001A,acc:0xFF0055,name:'DARK WEB'},
];

function getEnv(w){return ENVS[Math.min(Math.floor((w-1)/5),4)]}

function drawBG(g,w,t){
  const e=getEnv(w);g.clear();
  g.fillStyle(e.bg);g.fillRect(0,0,W,H);
  // Grid with parallax
  const off=(t*0.015)%40;
  g.lineStyle(1,e.grid,0.35);
  for(let x=-40+off;x<W+40;x+=40)g.lineBetween(x,0,x,H);
  for(let y=-40+off;y<H+40;y+=40)g.lineBetween(0,y,W,y);
  // Environment-specific effects
  const ei=Math.min(Math.floor((w-1)/5),4);
  if(ei===1){// Terminal: matrix chars
    g.fillStyle(0x00FF00,0.04);
    for(let i=0;i<25;i++){
      const cx=(i*53+Math.floor(t/150)*17)%W;
      const cy=(t*0.06+i*37)%H;
      g.fillRect(cx,cy,3,6);g.fillRect(cx+6,cy+3,4,4);
    }
  }else if(ei===2){// Server: LEDs
    for(let i=0;i<18;i++){
      const lx=25+i*44,ly=15+((i*47+Math.floor(t/500)*31)%570);
      g.fillStyle(Math.sin(t*0.004+i*2.1)>0?0x00FF00:0xFF0000,0.2);
      g.fillRect(lx,ly,4,4);
    }
  }else if(ei===3){// Cloud: floating shapes
    g.fillStyle(0xFFFFFF,0.025);
    for(let i=0;i<5;i++){
      const cx=(i*170+t*0.015)%900-50,cy=60+i*110;
      g.fillRect(cx-20,cy,50,12);g.fillRect(cx-10,cy-8,30,8);g.fillRect(cx,cy+12,20,6);
    }
  }else if(ei===4){// Dark web: pulse
    const p=0.015+Math.sin(t*0.002)*0.015;
    g.fillStyle(0xFF0000,p);g.fillRect(0,0,W,H);
    // Skull hints
    g.fillStyle(0xFF0000,0.03);
    const sx=(t*0.01)%W,sy=H/2+Math.sin(t*0.001)*100;
    g.fillRect(sx-8,sy-8,16,12);g.fillRect(sx-4,sy+4,8,6);
  }
}

// ─── MENU SCENE ─────────────────────────────────────────
class MenuScene extends Phaser.Scene{
  constructor(){super('Menu')}
  create(){
    setupInput(this);
    this.bgG=this.add.graphics();
    this.bgG.fillStyle(0x050510);this.bgG.fillRect(0,0,W,H);
    this.gridG=this.add.graphics();
    this.decoG=this.add.graphics();

    // Big title
    this.title=this.add.text(W/2,H*0.16,'BUGZ',{
      fontFamily:'monospace',fontSize:'96px',fontStyle:'bold',
      color:'#00FF88',stroke:'#003322',strokeThickness:8
    }).setOrigin(0.5).setAlpha(0).setScale(0.2);
    this.tweens.add({targets:this.title,alpha:1,scaleX:1,scaleY:1,duration:700,ease:'Back.Out'});

    // Subtitle
    this.sub=this.add.text(W/2,H*0.30,'',{
      fontFamily:'monospace',fontSize:'13px',color:'#FFD700',letterSpacing:2
    }).setOrigin(0.5);
    const fullSub='EL PROGRAMADOR VS LOS BUGS';
    let si=0;
    this.time.addEvent({delay:60,repeat:fullSub.length-1,callback:()=>{si++;this.sub.setText(fullSub.substring(0,si))}});

    // Arcade badge
    this.add.text(W/2,H*0.36,'PLATANUS HACK 26 · CDMX · ARCADE',{
      fontFamily:'monospace',fontSize:'8px',color:'#555555',letterSpacing:3
    }).setOrigin(0.5);

    // Selector options
    this.modes=['1 JUGADOR','2 JUGADORES','COMPAÑERO CPU'];
    this.modeGfx=[];
    this.menuSel=0;

    for(let i=0;i<this.modes.length;i++){
      const txt=this.add.text(W/2,H*0.46+i*32,'',{
        fontFamily:'monospace',fontSize:'18px',fontStyle:'bold',color:'#FFFFFF'
      }).setOrigin(0.5);
      this.modeGfx.push(txt);
    }
    this._drawMenuUI();

    // Controls
    this.add.text(W/2,H*0.74,'P1: WASD mover · U disparar · J dash · Enter pausar',{
      fontFamily:'monospace',fontSize:'9px',color:'#666666'
    }).setOrigin(0.5);
    this.add.text(W/2,H*0.79,'P2 / CPU: FLECHAS mover · R disparar · F dash · 2 unir/llamar',{
      fontFamily:'monospace',fontSize:'9px',color:'#666666'
    }).setOrigin(0.5);

    // Features list
    this.add.text(W/2,H*0.87,'5 enemigos · jefes con fases · skins · tazas café · doge · vidas extras',{
      fontFamily:'monospace',fontSize:'8px',color:'#444444'
    }).setOrigin(0.5);

    // Best score
    let best=0;try{best=parseInt(localStorage.getItem(SK)||'0')}catch(e){}
    if(best>0)this.add.text(W/2,H*0.93,'HIGH SCORE: '+best.toLocaleString(),{
      fontFamily:'monospace',fontSize:'11px',color:'#FFD700'
    }).setOrigin(0.5);

    this.pg1=this.add.graphics();this.pg2=this.add.graphics();
  }

  _drawMenuUI(){
    const colors=['#00FF88','#00E5FF','#FFD700'];
    for(let i=0;i<this.modeGfx.length;i++){
      const active=this.menuSel===i;
      this.modeGfx[i].setColor(active?colors[i]:'#555555');
      this.modeGfx[i].setText(active?`> ${this.modes[i]} <`:`  ${this.modes[i]}  `);
      this.modeGfx[i].setScale(active?1.15:1.0);
    }
  }

  update(time){
    this.gridG.clear();this.gridG.lineStyle(1,0x0A0035,0.25);
    const off=(time*0.02)%40;
    for(let x=-40+off;x<W+40;x+=40)this.gridG.lineBetween(x,0,x,H);
    for(let y=-40+off;y<H+40;y+=40)this.gridG.lineBetween(0,y,W,y);

    this.pg1.clear();this.pg2.clear();
    const frame=Math.floor(time/400)%2===0?P1PAT:P_WALK;
    px(this.pg1,120,H*0.56,frame,P1CM,3);
    px(this.pg2,W-120,H*0.56,frame,P2CM,3);

    this.decoG.clear();
    px(this.decoG,100+(time*0.03)%120,80,E_NULL,E_NULL_CM,2);
    px(this.decoG,W-80-(time*0.02)%100,140,E_STACK,E_STACK_CM,2);
    px(this.decoG,200+(time*0.025)%150,H-100,E_LOOP,E_LOOP_CM,2);

    if(eatPress('P1_U')||eatPress('P2_U')||eatPress('P1_L')||eatPress('P2_L')){
      this.menuSel=(this.menuSel+2)%3;sHit();this._drawMenuUI();
    }
    if(eatPress('P1_D')||eatPress('P2_D')||eatPress('P1_R')||eatPress('P2_R')){
      this.menuSel=(this.menuSel+1)%3;sHit();this._drawMenuUI();
    }

    if(eatPress('START1')){
      initA();sMenu();
      const p2=this.menuSel===1;
      const cpu=this.menuSel===2;
      this.scene.start('Game',{p2,cpu});
    }
    if(eatPress('START2')){
      initA();sMenu();
      this.scene.start('Game',{p2:true,cpu:false});
    }
    clearJP();
  }
}

// ─── GAME SCENE ─────────────────────────────────────────
class GameScene extends Phaser.Scene{
  constructor(){super('Game')}
  create(data){
    setupInput(this);initA();startM();
    this.wave=1;this.sc=0;this.gt=0;
    this.p2j=!!data.p2 || !!data.cpu;
    this.p2cpu=!!data.cpu;
    this.lives=3; // Shared life tokens!
    this.paused=false;
    this.pauseSel=0;
    this.pauseContainer=null;
    this.skin1=0;this.skin2=0; // skin index
    this.lastReward=0; // track 10k rewards

    this.bgG=this.add.graphics();
    // Players
    this.p1=this._mkP(W*0.35,H/2,1);
    this.p2=this.p2j?this._mkP(W*0.65,H/2,2):null;
    if(this.p2 && this.p2cpu) this.p2.isCPU=true;
    // Arrays
    this.en=[];this.bul=[];this.par=[];this.fl=[];this.pu=[];this.bBul=[];this.mem=[];
    // Boss state
    this.boss=null;this.bGfx=null;this.bHpG=null;this.bNameT=null;this.bossDying=false;
    // Timers
    this.sTimer=0;this.sRate=300;
    this.spTimer=0;this.spRate=1600;
    this.enSp=0;this.enTW=5;this.wClr=false;
    // HUD
    this.scT=this.add.text(14,8,'SCORE 0',{fontFamily:'monospace',fontSize:'16px',fontStyle:'bold',color:'#FFD700'});
    this.wT=this.add.text(W/2,8,'WAVE 1',{fontFamily:'monospace',fontSize:'13px',color:'#FF4500',letterSpacing:3}).setOrigin(0.5,0);
    this.skinT=this.add.text(W-14,8,'',{fontFamily:'monospace',fontSize:'9px',color:'#888888'}).setOrigin(1,0);
    this.hpG=this.add.graphics();
    this._startW();
  }

  _mkP(x,y,n){return{x,y,hp:100,mhp:100,spd:190,g:this.add.graphics(),
    wl:1,inv:0,dCd:0,dAct:0,ddx:0,ddy:0,n,alive:true,moving:false}}

  _startW(){
    this.enSp=0;
    this.enTW=Math.floor((4+this.wave*2)*(this.p2?1.4:1.0));
    this.spRate=Math.max(300,(1600-this.wave*60)*(this.p2?0.75:1.0));
    this.spTimer=0;this.wClr=false;this.bossDying=false;
    // Wave text
    const env=getEnv(this.wave);
    const t=this.add.text(W/2,H/2,'WAVE '+this.wave,{
      fontFamily:'monospace',fontSize:'36px',fontStyle:'bold',
      color:'#FFD700',stroke:'#000000',strokeThickness:5
    }).setOrigin(0.5);
    this.tweens.add({targets:t,alpha:0,y:H/2-50,duration:1200,ease:'Cubic.Out',onComplete:()=>t.destroy()});
    // Boss?
    if(this.wave%5===0){this.enTW=0;this.time.delayedCall(800,()=>this._spawnBoss())}
    // Meme every 3 waves
    if(this.wave>1&&this.wave%3===0)this.time.delayedCall(2500,()=>this._spawnMeme());
    // Env change text
    if(this.wave>1&&(this.wave-1)%5===0){
      const et=this.add.text(W/2,H/2+30,env.name,{
        fontFamily:'monospace',fontSize:'20px',fontStyle:'bold',color:'#FFFFFF',alpha:0.7,
        stroke:'#000',strokeThickness:3
      }).setOrigin(0.5);
      this.tweens.add({targets:et,alpha:0,y:H/2-10,duration:2000,onComplete:()=>et.destroy()});
    }
    // Skin unlock at wave 7 and every 7
    if(this.wave>1&&this.wave%7===0){
      const si=Math.min(Math.floor(this.wave/7),SKINS.length-1);
      this.skin1=si;this.skin2=si;
      sSkin();
      const st=this.add.text(W/2,H*0.35,'🎨 SKIN DESBLOQUEADA!',{
        fontFamily:'monospace',fontSize:'18px',fontStyle:'bold',color:'#FF00FF',
        stroke:'#000',strokeThickness:4
      }).setOrigin(0.5);
      this.tweens.add({targets:st,alpha:0,scaleX:1.3,scaleY:1.3,duration:2500,onComplete:()=>st.destroy()});
    }
  }

  _spawnBoss(){
    sBossIn();this.cameras.main.shake(350,0.02);
    const names=['SEGFAULT','BLUE SCREEN','KERNEL PANIC','STACK SMASH','MEMORY LEAK'];
    const idx=Math.floor((this.wave/5)-1)%5;
    let hp=700+this.wave*80;
    if(this.p2)hp=Math.floor(hp*1.55); // 55% more HP in 2-player mode!
    this.boss={x:W/2,y:-60,hp,mhp:hp,ph:1,alive:true,
      vx:45+this.wave*4,ty:85,entry:false,aT:0,aR:1800,fl:0,name:names[idx]};
    this.bGfx=this.add.graphics();this.bHpG=this.add.graphics();
    this.bNameT=this.add.text(W/2,26,this.boss.name,{
      fontFamily:'monospace',fontSize:'10px',fontStyle:'bold',color:'#FF0055',letterSpacing:3
    }).setOrigin(0.5,0);
    // Announcement
    const a=this.add.text(W/2,H*0.4,'⚠ '+this.boss.name+' ⚠',{
      fontFamily:'monospace',fontSize:'20px',fontStyle:'bold',
      color:'#FF0055',stroke:'#000',strokeThickness:4
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({targets:a,alpha:1,duration:180,yoyo:true,repeat:3,
      onComplete:()=>{this.tweens.add({targets:a,alpha:0,duration:500,onComplete:()=>a.destroy()})}});
  }

  _spawnMeme(){
    const types=['doge','coffee','troll'];
    const tp=types[Math.floor(Math.random()*3)];
    this.mem.push({x:-20,y:80+Math.random()*(H-160),tp,alive:true,a:1,
      vx:35+Math.random()*25,life:7000,g:this.add.graphics()});
  }

  _spawnEn(){
    const side=Phaser.Math.Between(0,3),pad=30;
    let x,y;
    if(side===0){x=Phaser.Math.Between(pad,W-pad);y=-pad}
    else if(side===1){x=W+pad;y=Phaser.Math.Between(pad,H-pad)}
    else if(side===2){x=Phaser.Math.Between(pad,W-pad);y=H+pad}
    else{x=-pad;y=Phaser.Math.Between(pad,H-pad)}

    // 2-player scaling
    const scaleHP=this.p2?1.35:1.0;
    const scaleSpd=this.p2?1.15:1.0;

    const r=Math.random();
    let tp='null',col=0xFF4444,hp=12+this.wave*4,spd=70+this.wave*4,rad=12,pts=50,
      pat=E_NULL,cm=E_NULL_CM;
    if(this.wave>=5&&r<0.1){tp='404';col=0x888888;hp=45+this.wave*6;spd=35+this.wave*2;rad=14;pts=250;pat=E_404;cm=E_404_CM}
    else if(this.wave>=4&&r<0.18){tp='loop';col=0x00FF88;hp=25+this.wave*5;spd=85+this.wave*5;rad=12;pts=150;pat=E_LOOP;cm=E_LOOP_CM}
    else if(this.wave>=3&&r<0.28){tp='syntax';col=0xFF0055;hp=50+this.wave*8;spd=32+this.wave*2;rad=18;pts=200;pat=E_SYNTAX;cm=E_SYNTAX_CM}
    else if(this.wave>=2&&r<0.42){tp='stack';col=0xFF8C00;hp=30+this.wave*6;spd=48+this.wave*3;rad=14;pts=100;pat=E_STACK;cm=E_STACK_CM}

    hp*=scaleHP;
    spd*=scaleSpd;

    this.en.push({x,y,tp,col,hp,mhp:hp,spd,rad,pts,pat,cm,
      g:this.add.graphics(),hg:this.add.graphics(),fl:0,alive:true,
      tpT:tp==='loop'?2000+Math.random()*1500:0});
    this.enSp++;
  }

  _shoot(p){
    if(!p||!p.alive||p.hp<=0)return;
    let nr=null,md=Infinity;
    this.en.forEach(e=>{if(!e.alive)return;const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<md){md=d;nr=e}});
    if(this.boss&&this.boss.alive){const d=Math.hypot(this.boss.x-p.x,this.boss.y-p.y);if(d<md){md=d;nr={x:this.boss.x,y:this.boss.y}}}
    if(!nr)return;
    sShoot(p.wl);
    const ang=Math.atan2(nr.y-p.y,nr.x-p.x),spd=460,wl=p.wl;
    const offs=wl>=4?[-0.18,-0.06,0.06,0.18]:wl>=3?[-0.15,0,0.15]:wl>=2?[-0.1,0.1]:[0];
    offs.forEach(o=>{
      const a=ang+o;
      this.bul.push({x:p.x,y:p.y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,
        dm:7+wl*4,wl,g:this.add.graphics(),life:1400,alive:true});
    });
  }

  _hurtP(p,d){
    if(!p||p.inv>0||p.hp<=0||!p.alive)return;
    p.hp=Math.max(0,p.hp-d);p.inv=500;
    this.cameras.main.shake(100,0.007);sHurt();
    this._float(p.x,p.y-22,'-'+d,'#FF4444');
    if(p.hp<=0)this._killP(p);
  }

  _killP(p){
    p.alive=false;
    this._boom(p.x,p.y,p.n===1?0x00FF88:0x00E5FF,15);
    sDie();
    if(this.lives>0){
      this.lives--;
      this._float(p.x,p.y-20,'-1 VIDA','#FF3333');
      this.time.delayedCall(2500,()=>{
        if(p){
          p.hp=70;
          p.alive=true;
          p.inv=2000;
          this._float(p.x,p.y-20,'RESPAWN!','#00FF88');
        }
      });
    }else{
      this._checkGO();
    }
  }

  _checkGO(){
    const p1Dead=this.p1.hp<=0&&!this.p1.alive;
    const p2Dead=!this.p2||(this.p2.hp<=0&&!this.p2.alive);
    if(p1Dead&&p2Dead&&this.lives<=0){
      sOver();stopM();
      this.time.delayedCall(700,()=>this.scene.start('Over',{sc:this.sc}));
    }
  }

  _float(x,y,txt,col){
    const t=this.add.text(x,y,txt,{fontFamily:'monospace',fontSize:'13px',fontStyle:'bold',color:col||'#FFD700'}).setOrigin(0.5);
    this.fl.push({t,vy:-50,life:700,ml:700});
  }

  _boom(x,y,col,n){
    n=n||8;for(let i=0;i<n;i++){
      const a=Math.random()*6.28,s=40+Math.random()*100;
      const g=this.add.graphics(),sz=1+Math.random()*2.5;
      g.fillStyle(col);g.fillRect(-sz/2,-sz/2,sz,sz);g.setPosition(x,y);
      this.par.push({g,x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:350+Math.random()*150,ml:350+Math.random()*150});
    }
  }

  _spawnPU(x,y){
    const rate=0.25;
    if(Math.random()>rate)return;
    const r=Math.random();
    let tp,col,pat;
    if(r<0.45){tp='heal';col=0xFF0055;pat=HEART_PAT}
    else if(r<0.68){tp='wpn';col=0xFFD700;pat=PU_STAR}
    else if(r<0.85){tp='spd';col=0x00E5FF;pat=PU_BOLT}
    else if(r<0.95){tp='shd';col=0x9B30FF;pat=PU_STAR}
    else{tp='life';col=0xFFD700;pat=HEART_PAT}
    this.pu.push({x,y,tp,col,pat,g:this.add.graphics(),alive:true,life:9000});
  }

  _chkWpn(){
    const th=[0,350,1000,2200,4000,7000];
    [this.p1,this.p2].forEach(p=>{
      if(!p)return;
      const nl=Math.min(th.filter(t=>this.sc>=t).length,5);
      if(nl>p.wl){
        p.wl=nl;
        const nm=['','console.log','debugger','git push','sudo rm -rf','kernel.exec'];
        this._float(p.x,p.y-35,'⚡ '+nm[nl],'#FFD700');
        this.cameras.main.shake(180,0.01);sPow();
      }
    });
  }

  _chkReward(){
    const tier=Math.floor(this.sc/10000);
    if(tier>this.lastReward){
      this.lastReward=tier;sReward();
      this.lives++;
      const rewards=['SPEED BOOST','MAX HEAL','DOUBLE DAMAGE','MEGA SHIELD','RAPID FIRE'];
      const rw=rewards[tier%rewards.length];
      const t=this.add.text(W/2,H*0.3,'🏆 '+tier*10+'K: '+rw+' +1 VIDA',{
        fontFamily:'monospace',fontSize:'16px',fontStyle:'bold',color:'#FFD700',
        stroke:'#000',strokeThickness:3
      }).setOrigin(0.5);
      this.tweens.add({targets:t,alpha:0,y:H*0.2,duration:3000,onComplete:()=>t.destroy()});
      [this.p1,this.p2].forEach(p=>{
        if(!p||p.hp<=0)return;
        if(rw==='MAX HEAL')p.hp=p.mhp;
        else if(rw==='MEGA SHIELD')p.inv=5000;
        else if(rw==='SPEED BOOST'){p.spd=280;this.time.delayedCall(10000,()=>{if(p)p.spd=190})}
      });
    }
  }

  _bossAtk(){
    if(!this.boss||!this.boss.alive)return;
    const b=this.boss;
    const tgts=[this.p1,this.p2].filter(p=>p&&p.hp>0&&p.alive);
    if(!tgts.length)return;
    if(b.ph===1){
      for(let i=0;i<4+b.ph;i++){const a=Math.PI/2-0.4+(i*0.2);this._bBul(b.x,b.y+35,Math.cos(a)*170,Math.sin(a)*170,12)}
    }else if(b.ph===2){
      for(let i=0;i<6;i++){const a=Math.PI/2-0.5+(i*0.2);this._bBul(b.x,b.y+35,Math.cos(a)*190,Math.sin(a)*190,14)}
      const tg=tgts[Math.floor(Math.random()*tgts.length)];
      const aa=Math.atan2(tg.y-b.y,tg.x-b.x);
      this._bBul(b.x,b.y,Math.cos(aa)*250,Math.sin(aa)*250,18);
    }else{
      for(let i=0;i<8;i++){const a=i*Math.PI*2/8;this._bBul(b.x,b.y,Math.cos(a)*150,Math.sin(a)*150,14)}
      tgts.forEach(tg=>{const a=Math.atan2(tg.y-b.y,tg.x-b.x);this._bBul(b.x,b.y,Math.cos(a)*270,Math.sin(a)*270,20)});
    }
  }

  _bBul(x,y,vx,vy,dm){this.bBul.push({x,y,vx,vy,dm,r:6,g:this.add.graphics(),life:2800,alive:true})}

  _bossChkPh(){
    const b=this.boss;if(!b)return;
    const pct=b.hp/b.mhp;let np=1;if(pct<=0.6)np=2;if(pct<=0.3)np=3;
    if(np>b.ph){
      b.ph=np;b.aR=Math.max(600,1800-np*300);b.vx=(45+this.wave*4)+np*18;
      this.cameras.main.shake(350,0.02);sBossIn();
      const msgs=['','','⚠ PHASE 2','🔴 FINAL PHASE'];
      const t=this.add.text(W/2,H/2,msgs[np],{fontFamily:'monospace',fontSize:'24px',fontStyle:'bold',
        color:'#FF0055',stroke:'#000',strokeThickness:4}).setOrigin(0.5);
      this.tweens.add({targets:t,alpha:0,y:H/2-50,duration:1300,onComplete:()=>t.destroy()});
    }
  }

  _bossDie(){
    const b=this.boss;if(!b)return;
    b.alive=false;this.bossDying=true;sBossDie();
    for(let i=0;i<6;i++){
      this.time.delayedCall(i*140,()=>{
        this._boom(b.x+Phaser.Math.Between(-30,30),b.y+Phaser.Math.Between(-30,30),0xFF0055,14);
        this._boom(b.x+Phaser.Math.Between(-20,20),b.y+Phaser.Math.Between(-20,20),0xFF8C00,8);
        this.cameras.main.shake(130,0.012);
      });
    }
    this.time.delayedCall(850,()=>{
      if(this.bGfx){this.bGfx.destroy();this.bGfx=null}
      if(this.bHpG){this.bHpG.destroy();this.bHpG=null}
      if(this.bNameT){this.bNameT.destroy();this.bNameT=null}
      this.bBul.forEach(bb=>{if(bb.g)bb.g.destroy()});this.bBul=[];
      this.sc+=400+this.wave*80;
      this.scT.setText('SCORE '+this.sc.toLocaleString());
      this._float(b.x,b.y,'🏆 BOSS DOWN!','#FFD700');
      this._chkWpn();this._chkReward();
      this.time.delayedCall(1200,()=>{
        this.boss=null;this.bossDying=false;
        this.wave++;this.wT.setText('WAVE '+this.wave);
        this._startW();
      });
    });
  }

  _moveP(p,l,r,u,d,dk,dt){
    if(!p||p.hp<=0)return;
    if(p.dAct>0){p.x+=p.ddx*420*(dt/1000);p.y+=p.ddy*420*(dt/1000)}
    else{
      const s=p.spd*(dt/1000);let dx=0,dy=0;
      if(dn(l))dx=-1;if(dn(r))dx=1;if(dn(u))dy=-1;if(dn(d))dy=1;
      p.moving=dx!==0||dy!==0;
      if(dx&&dy){dx*=0.707;dy*=0.707}
      p.x+=dx*s;p.y+=dy*s;
      if(eatPress(dk)&&p.dCd<=0&&(dx||dy)){
        p.dAct=130;p.dCd=1000;p.ddx=dx;p.ddy=dy;sDash();
        const g=this.add.graphics();g.fillStyle(p.n===1?0x00FF88:0x00E5FF,0.25);
        g.fillRect(p.x-8,p.y-10,16,20);
        this.tweens.add({targets:g,alpha:0,duration:250,onComplete:()=>g.destroy()});
      }
    }
    p.x=Phaser.Math.Clamp(p.x,16,W-16);p.y=Phaser.Math.Clamp(p.y,16,H-16);
  }

  _updBoss(dt,t){
    const b=this.boss;if(!b||!b.alive)return;
    if(!b.entry){b.y+=75*(dt/1000);if(b.y>=b.ty){b.y=b.ty;b.entry=true}
      this._drawBoss(t);return}
    b.x+=b.vx*(dt/1000);
    if(b.x>W-65){b.x=W-65;b.vx*=-1}if(b.x<65){b.x=65;b.vx*=-1}
    b.y=b.ty+Math.sin(t*0.001)*22;
    if(b.fl>0)b.fl-=dt;
    b.aT+=dt;if(b.aT>=b.aR){b.aT=0;this._bossAtk()}
    this._drawBoss(t);
  }

  _drawBoss(t){
    if(!this.bGfx||!this.boss)return;
    const b=this.boss;
    this.bGfx.clear();
    let pat=BOSS_SEGFAULT,cm=BOSS_SEGFAULT_CM;
    if(b.name==='BLUE SCREEN'){pat=BOSS_BLUESCREEN;cm=BOSS_BLUESCREEN_CM}
    else if(b.name==='KERNEL PANIC'){pat=BOSS_KERNELPANIC;cm=BOSS_KERNELPANIC_CM}
    const bCM={};
    for(const[k,v]of Object.entries(cm))bCM[k]=b.fl>0?0xFFFFFF:v;
    px(this.bGfx,b.x,b.y,pat,bCM,4);
    if(b.ph>=2)for(let i=0;i<4;i++){
      const a=t*0.003+i*Math.PI/2,ox=b.x+Math.cos(a)*50,oy=b.y+Math.sin(a)*50;
      this.bGfx.fillStyle(0xFF6600);this.bGfx.fillRect(ox-3,oy-3,6,6);
    }
    if(b.ph>=3)for(let i=0;i<6;i++){
      const a=-t*0.002+i*Math.PI/3,ox=b.x+Math.cos(a)*40,oy=b.y+Math.sin(a)*40;
      this.bGfx.fillStyle(0xFF0000,0.6);this.bGfx.fillRect(ox-2,oy-2,4,4);
    }
    if(!this.bHpG)return;this.bHpG.clear();
    const bw=W*0.5,bx=(W-bw)/2,by=8,pct=Math.max(0,b.hp/b.mhp);
    this.bHpG.fillStyle(0x111111);this.bHpG.fillRect(bx-1,by-1,bw+2,12);
    this.bHpG.fillStyle(pct>0.6?0xFF0055:pct>0.3?0xFF6600:0xFF0000);
    this.bHpG.fillRect(bx,by,bw*pct,10);
    this.bHpG.fillStyle(0xFFFFFF,0.1);this.bHpG.fillRect(bx,by,bw*pct,3);
    this.bHpG.lineStyle(1,0xFF0055,0.4);this.bHpG.strokeRect(bx,by,bw,10);
  }

  _showPauseUI(){
    this.pauseContainer=this.add.container(0,0);
    const bg=this.add.graphics();
    bg.fillStyle(0x000000,0.75);bg.fillRect(0,0,W,H);
    this.pauseContainer.add(bg);
    const title=this.add.text(W/2,H*0.35,'PAUSA',{
      fontFamily:'monospace',fontSize:'48px',fontStyle:'bold',color:'#00E5FF',
      stroke:'#003344',strokeThickness:6
    }).setOrigin(0.5);
    this.pauseContainer.add(title);
    this.pResText=this.add.text(W/2,H*0.48,'',{
      fontFamily:'monospace',fontSize:'18px',fontStyle:'bold',color:'#FFFFFF'
    }).setOrigin(0.5);
    this.pauseContainer.add(this.pResText);
    this.pExitText=this.add.text(W/2,H*0.55,'',{
      fontFamily:'monospace',fontSize:'18px',fontStyle:'bold',color:'#FFFFFF'
    }).setOrigin(0.5);
    this.pauseContainer.add(this.pExitText);
    const inst=this.add.text(W/2,H*0.7,'W/S o FLECHAS para mover · ENTER/BOTÓN 1 para seleccionar',{
      fontFamily:'monospace',fontSize:'10px',color:'#888888'
    }).setOrigin(0.5);
    this.pauseContainer.add(inst);
    this.pauseSel=0;
    this._drawPauseUI();
  }

  _drawPauseUI(){
    if(!this.pauseContainer)return;
    this.pResText.setColor(this.pauseSel===0?'#00FF88':'#888888');
    this.pResText.setText(this.pauseSel===0?'> RESUMIR OLEADA <':'  RESUMIR OLEADA  ');
    this.pExitText.setColor(this.pauseSel===1?'#FF0055':'#888888');
    this.pExitText.setText(this.pauseSel===1?'> SALIR AL MENÚ <':'  SALIR AL MENÚ  ');
  }

  _hidePauseUI(){
    if(this.pauseContainer){this.pauseContainer.destroy();this.pauseContainer=null}
  }

  update(t,dt){
    this.gt=t;

    // Pause Toggle
    if(eatPress('START1')){
      this.paused=!this.paused;
      sMenu();
      if(this.paused){
        stopM();
        this._showPauseUI();
      }else{
        startM();
        this._hidePauseUI();
      }
    }

    // Handle Pause Menu
    if(this.paused){
      if(eatPress('P1_U')||eatPress('P2_U')||eatPress('P1_L')||eatPress('P2_L')){
        this.pauseSel=0;sHit();this._drawPauseUI();
      }
      if(eatPress('P1_D')||eatPress('P2_D')||eatPress('P1_R')||eatPress('P2_R')){
        this.pauseSel=1;sHit();this._drawPauseUI();
      }
      if(eatPress('P1_1')||eatPress('P2_1')){
        sMenu();
        if(this.pauseSel===0){
          this.paused=false;
          startM();
          this._hidePauseUI();
        }else{
          stopM();
          this._hidePauseUI();
          this.scene.start('Menu');
        }
      }
      clearJP();
      return;
    }

    // P2 join (CPU)
    if(!this.p2&&eatPress('START2')){
      this.p2=this._mkP(W*0.65,H/2,2);
      this.p2.isCPU=true;
      this._float(W*0.65,H/2-25,'COMPAÑERO CPU!','#00E5FF');
      sPow();
    }

    // BG
    drawBG(this.bgG,this.wave,t);

    // Timers
    this.sTimer+=dt;this.spTimer+=dt;
    if(this.p1.inv>0)this.p1.inv-=dt;if(this.p2&&this.p2.inv>0)this.p2.inv-=dt;
    if(this.p1.dCd>0)this.p1.dCd-=dt;if(this.p2&&this.p2.dCd>0)this.p2.dCd-=dt;
    if(this.p1.dAct>0)this.p1.dAct-=dt;if(this.p2&&this.p2.dAct>0)this.p2.dAct-=dt;

    // Spawn
    if(!this.wClr&&this.enSp<this.enTW&&this.spTimer>=this.spRate){this.spTimer=0;this._spawnEn()}

    // Wave clear check
    const alv=this.en.filter(e=>e.alive).length;
    const bAlv=this.boss&&this.boss.alive;
    if(!this.wClr&&!this.bossDying&&this.enSp>=this.enTW&&alv===0&&!bAlv&&!this.boss){
      this.wClr=true;sWave();
      this.time.delayedCall(1000,()=>{this.wave++;this.wT.setText('WAVE '+this.wave);this._startW()});
    }

    // CPU Companion AI
    if(this.p2&&this.p2.hp>0&&this.p2.isCPU&&this.p2.alive){
      let target=null;let minDist=Infinity;
      this.en.forEach(e=>{
        if(!e.alive)return;
        const d=Math.hypot(e.x-this.p2.x,e.y-this.p2.y);
        if(d<minDist){minDist=d;target=e}
      });
      if(this.boss&&this.boss.alive){
        const d=Math.hypot(this.boss.x-this.p2.x,this.boss.y-this.p2.y);
        if(d<minDist){minDist=d;target=this.boss}
      }
      let dx=0,dy=0;
      if(target){
        const dist=Math.hypot(target.x-this.p2.x,target.y-this.p2.y);
        const angle=Math.atan2(target.y-this.p2.y,target.x-this.p2.x);
        if(dist>140){dx=Math.cos(angle);dy=Math.sin(angle)}
        else if(dist<90){dx=-Math.cos(angle);dy=-Math.sin(angle)}
        this.p2.moving=dx!==0||dy!==0;
      }else{
        const distToP1=Math.hypot(this.p1.x-this.p2.x,this.p1.y-this.p2.y);
        if(distToP1>80){
          const angle=Math.atan2(this.p1.y-this.p2.y,this.p1.x-this.p2.x);
          dx=Math.cos(angle);dy=Math.sin(angle);this.p2.moving=true;
        }else{
          this.p2.moving=false;
        }
      }
      const s=this.p2.spd*(dt/1000);
      this.p2.x+=dx*s;this.p2.y+=dy*s;
      this.p2.x=Phaser.Math.Clamp(this.p2.x,16,W-16);
      this.p2.y=Phaser.Math.Clamp(this.p2.y,16,H-16);
      if(minDist<50&&this.p2.dCd<=0){
        this.p2.dAct=130;this.p2.dCd=1200;
        this.p2.ddx=dx!==0?-dx:(Math.random()>0.5?1:-1);
        this.p2.ddy=dy!==0?-dy:(Math.random()>0.5?1:-1);
        sDash();
      }
    }

    // Movement
    this._moveP(this.p1,'P1_L','P1_R','P1_U','P1_D','P1_4',dt);
    if(this.p2&&!this.p2.isCPU)this._moveP(this.p2,'P2_L','P2_R','P2_U','P2_D','P2_4',dt);

    // Shooting - auto
    if(this.sTimer>=this.sRate){
      this.sTimer=0;
      const hasTargets=this.en.some(e=>e.alive)||(this.boss&&this.boss.alive);
      if(hasTargets){
        if(this.p1.hp>0&&this.p1.alive)this._shoot(this.p1);
        if(this.p2&&this.p2.hp>0&&this.p2.alive)this._shoot(this.p2);
      }
    }

    // Boss
    if(this.boss&&this.boss.alive)this._updBoss(dt,t);

    // Enemies
    this.en.forEach(e=>{
      if(!e.alive)return;
      if(e.fl>0)e.fl-=dt;
      if(e.tp==='loop'){e.tpT-=dt;if(e.tpT<=0){e.tpT=2200+Math.random()*1500;e.x=40+Math.random()*(W-80);e.y=40+Math.random()*(H-80)}}
      // Chase
      const tgs=[this.p1,this.p2].filter(p=>p&&p.hp>0&&p.alive);
      let nr=null,md=Infinity;
      tgs.forEach(p=>{const d=Math.hypot(p.x-e.x,p.y-e.y);if(d<md){md=d;nr=p}});
      if(nr){const a=Math.atan2(nr.y-e.y,nr.x-e.x);e.x+=Math.cos(a)*e.spd*(dt/1000);e.y+=Math.sin(a)*e.spd*(dt/1000)}
      // Hit players
      [this.p1,this.p2].forEach(p=>{if(!p||p.hp<=0||!p.alive)return;if(Math.hypot(p.x-e.x,p.y-e.y)<e.rad+12)this._hurtP(p,9)});
      // Draw enemy pixel art
      e.g.clear();
      const ecm={};for(const[k,v]of Object.entries(e.cm))ecm[k]=e.fl>0?0xFFFFFF:v;
      if(e.tp==='404'){const a=0.3+Math.abs(Math.sin(t*0.003))*0.7;e.g.setAlpha(a)}else{e.g.setAlpha(1)}
      px(e.g,e.x,e.y,e.pat,ecm,3);
      // HP bar
      e.hg.clear();
      if(e.mhp>=25){const bw=e.rad*2,bx=e.x-bw/2,by=e.y-e.rad-7,pct=e.hp/e.mhp;
        e.hg.fillStyle(0x333333);e.hg.fillRect(bx,by,bw,2);
        e.hg.fillStyle(pct>0.5?0x00FF00:pct>0.25?0xFFAA00:0xFF0000);e.hg.fillRect(bx,by,bw*pct,2)}
    });

    // Bullets
    this.bul.forEach(b=>{
      if(!b.alive)return;b.life-=dt;
      if(b.life<=0||b.x<-20||b.x>W+20||b.y<-20||b.y>H+20){b.alive=false;b.g.destroy();return}
      b.x+=b.vx*(dt/1000);b.y+=b.vy*(dt/1000);
      // Hit boss
      if(this.boss&&this.boss.alive&&Math.hypot(b.x-this.boss.x,b.y-this.boss.y)<40){
        b.alive=false;b.g.destroy();this.boss.hp-=b.dm;this.boss.fl=70;sHit();
        this._float(this.boss.x+Phaser.Math.Between(-15,15),this.boss.y-35,'-'+b.dm,'#FFF');
        if(this.boss.hp<=0){this.boss.hp=0;this._bossDie()}else this._bossChkPh();return;
      }
      // Hit enemies
      for(const e of this.en){
        if(!e.alive||!b.alive)continue;
        if(Math.hypot(b.x-e.x,b.y-e.y)<e.rad+4){
          b.alive=false;b.g.destroy();e.hp-=b.dm;e.fl=70;sHit();
          this._float(e.x,e.y-e.rad,'-'+b.dm,'#FFF');
          if(e.hp<=0){
            e.alive=false;e.g.clear();e.hg.clear();
            this.sc+=e.pts;this.scT.setText('SCORE '+this.sc.toLocaleString());
            this._float(e.x,e.y-12,'+'+e.pts,'#FFD700');
            this._boom(e.x,e.y,e.col);
            e.tp==='syntax'||e.tp==='404'?sBigDie():sDie();
            this._spawnPU(e.x,e.y);this._chkWpn();this._chkReward();
          }break;
        }
      }
      // Draw bullet as pixel symbol
      b.g.clear();if(!b.alive)return;
      const cols=[0xFFD700,0x00E5FF,0xFF8C00,0xFF0055,0xFF00FF];
      const c=cols[Math.min(b.wl-1,4)];
      let bPat=B_PAREN;
      if(b.wl===2)bPat=B_BRACE;
      else if(b.wl===3)bPat=B_TAG;
      else if(b.wl>=4)bPat=B_BRACE;
      b.g.fillStyle(c,0.25);b.g.fillRect(b.x-6,b.y-6,12,12);
      px(b.g,b.x,b.y,bPat,{'1':c},2);
    });

    // Boss bullets
    this.bBul.forEach(b=>{
      if(!b.alive)return;b.life-=dt;b.x+=b.vx*(dt/1000);b.y+=b.vy*(dt/1000);
      if(b.life<=0||b.y>H+15||b.x<-15||b.x>W+15||b.y<-15){b.alive=false;b.g.destroy();return}
      [this.p1,this.p2].forEach(p=>{if(!p||p.hp<=0||!p.alive||!b.alive)return;
        if(Math.hypot(b.x-p.x,b.y-p.y)<b.r+12){b.alive=false;b.g.destroy();this._hurtP(p,b.dm)}});
      b.g.clear();if(!b.alive)return;
      b.g.fillStyle(0xFF0055,0.2);b.g.fillRect(b.x-b.r-3,b.y-b.r-3,b.r*2+6,b.r*2+6);
      b.g.fillStyle(0xFF0055);b.g.fillRect(b.x-b.r/2,b.y-b.r/2,b.r,b.r);
    });

    // Power-ups
    this.pu.forEach(p=>{
      if(!p.alive)return;p.life-=dt;
      if(p.life<=0){p.alive=false;p.g.destroy();return}
      [this.p1,this.p2].forEach(pl=>{
        if(!pl||pl.hp<=0||!pl.alive||!p.alive)return;
        if(Math.hypot(pl.x-p.x,pl.y-p.y)<20){
          p.alive=false;p.g.destroy();sPow();
          if(p.tp==='heal'){pl.hp=Math.min(pl.mhp,pl.hp+25);this._float(p.x,p.y-12,'+25HP','#00FF00')}
          else if(p.tp==='wpn'){pl.wl=Math.min(5,pl.wl+1);this._float(p.x,p.y-12,'WEAPON UP','#FFD700')}
          else if(p.tp==='spd'){pl.spd=270;this.time.delayedCall(8000,()=>{if(pl)pl.spd=190});this._float(p.x,p.y-12,'SPEED!','#00E5FF')}
          else if(p.tp==='shd'){pl.inv=3500;this._float(p.x,p.y-12,'SHIELD!','#9B30FF')}
          else if(p.tp==='life'){this.lives++;this._float(p.x,p.y-12,'+1 VIDA!','#FFD700')}
        }
      });
      p.g.clear();if(!p.alive)return;
      const bob=Math.sin(t*0.005+p.x)*3,pulse=0.6+Math.sin(t*0.006)*0.4;
      p.g.fillStyle(p.col,pulse);
      px(p.g,p.x,p.y+bob,p.pat,{'1':p.col,'2':0xFFFFFF},3);
    });

    // Memes
    this.mem.forEach(m=>{
      if(!m.alive)return;m.life-=dt;m.x+=m.vx*(dt/1000);
      if(m.life<=0||m.x>W+30){m.alive=false;m.g.destroy();return}
      [this.p1,this.p2].forEach(p=>{
        if(!p||p.hp<=0||!p.alive||!m.alive)return;
        if(Math.hypot(p.x-m.x,p.y-m.y)<25){
          m.alive=false;m.g.destroy();sPow();
          if(m.tp==='doge'){p.inv=3000;this._float(m.x,m.y-12,'WOW SHIELD','#DDB060')}
          else if(m.tp==='coffee'){p.spd=290;this.time.delayedCall(6000,()=>{if(p)p.spd=190});this._float(m.x,m.y-12,'COFFEE!','#4A2F00')}
          else{p.wl=Math.min(5,p.wl+1);this._float(m.x,m.y-12,'TROLL POWER','#FF4444')}
          this.sc+=100;this.scT.setText('SCORE '+this.sc.toLocaleString());
        }
      });
      m.g.clear();if(!m.alive)return;
      m.a=m.life<1000?m.life/1000:1;m.g.setAlpha(m.a);
      const mp=m.tp==='doge'?MEME_DOGE:m.tp==='coffee'?MEME_COFFEE:MEME_TROLL;
      const mc=m.tp==='doge'?MEME_DOGE_CM:m.tp==='coffee'?MEME_COFFEE_CM:MEME_TROLL_CM;
      px(m.g,m.x,m.y,mp,mc,3);
    });

    // Particles
    this.par.forEach(p=>{p.life-=dt;p.x+=p.vx*(dt/1000);p.y+=p.vy*(dt/1000);p.vy+=45*(dt/1000);
      p.g.setPosition(p.x,p.y);p.g.setAlpha(Math.max(0,p.life/p.ml))});
    this.par.filter(p=>p.life<=0).forEach(p=>p.g.destroy());
    this.par=this.par.filter(p=>p.life>0);

    // Floats
    this.fl.forEach(f=>{f.life-=dt;f.t.y+=f.vy*(dt/1000);f.t.setAlpha(Math.max(0,f.life/f.ml))});
    this.fl.filter(f=>f.life<=0).forEach(f=>f.t.destroy());
    this.fl=this.fl.filter(f=>f.life>0);

    // Cleanup
    this.bul=this.bul.filter(b=>b.alive);
    this.en=this.en.filter(e=>e.alive);
    this.pu=this.pu.filter(p=>p.alive);
    this.bBul=this.bBul.filter(b=>b.alive);
    this.mem=this.mem.filter(m=>m.alive);

    // Draw players pixel art
    const sk1=Object.assign({},P1CM,SKINS[this.skin1]||{});
    const sk2=Object.assign({},P2CM,SKINS2[this.skin2]||{});
    this.p1.g.clear();
    if(this.p1.hp>0&&this.p1.alive){
      if(!(this.p1.inv>0&&Math.floor(this.p1.inv/70)%2===0)){
        const frame=this.p1.moving&&Math.floor(t/250)%2===0?P_WALK:P1PAT;
        px(this.p1.g,this.p1.x,this.p1.y,frame,sk1,3);
      }
    }else{
      px(this.p1.g,this.p1.x,this.p1.y,TOMB_PAT,TOMB_CM,3);
    }
    if(this.p2){
      this.p2.g.clear();
      if(this.p2.hp>0&&this.p2.alive){
        if(!(this.p2.inv>0&&Math.floor(this.p2.inv/70)%2===0)){
          const frame=this.p2.moving&&Math.floor(t/250)%2===0?P_WALK:P1PAT;
          px(this.p2.g,this.p2.x,this.p2.y,frame,sk2,3);
        }
      }else{
        px(this.p2.g,this.p2.x,this.p2.y,TOMB_PAT,TOMB_CM,3);
      }
    }

    // HUD
    this.hpG.clear();
    const drawBar=(x,y,cur,max,col,lbl)=>{
      const bw=140;
      this.hpG.fillStyle(col,0.6);
      this.hpG.fillStyle(0x222222);this.hpG.fillRect(x,y,bw,8);
      const pct=Math.max(0,cur/max);
      this.hpG.fillStyle(pct>0.5?col:pct>0.25?0xFFAA00:0xFF0000);
      this.hpG.fillRect(x,y,bw*pct,8);
      this.hpG.lineStyle(1,col,0.3);this.hpG.strokeRect(x,y,bw,8);
    };
    drawBar(12,H-30,this.p1.hp,this.p1.mhp,0x00FF88,'P1');
    if(this.p2)drawBar(W-152,H-30,this.p2.hp,this.p2.mhp,0x00E5FF,'P2');

    // Draw life tokens (HUD)
    this.hpG.fillStyle(0xFFD700);
    for(let i=0;i<this.lives;i++){
      const lx=W/2-(this.lives*16)/2+i*16;
      px(this.hpG,lx,32,HEART_PAT,{'1':0xFF0055,'2':0xFFFFFF},1.5);
    }

    // Skin indicator
    if(this.skin1>0)this.skinT.setText('SKIN '+(this.skin1+1));

    clearJP();
  }
}

// ─── GAME OVER SCENE ────────────────────────────────────
class OverScene extends Phaser.Scene{
  constructor(){super('Over')}
  create(data){
    setupInput(this);
    const sc=data.sc||0;
    let best=0;try{best=parseInt(localStorage.getItem(SK)||'0')}catch(e){}
    best=Math.max(sc,best);try{localStorage.setItem(SK,best)}catch(e){}

    this.add.rectangle(W/2,H/2,W,H,0x050510);
    // Grid
    const gg=this.add.graphics();gg.lineStyle(1,0x0A0035,0.2);
    for(let x=0;x<W;x+=40)gg.lineBetween(x,0,x,H);
    for(let y=0;y<H;y+=40)gg.lineBetween(0,y,W,y);

    const go=this.add.text(W/2,H*0.2,'GAME OVER',{
      fontFamily:'monospace',fontSize:'52px',fontStyle:'bold',
      color:'#FF0000',stroke:'#330000',strokeThickness:5
    }).setOrigin(0.5).setAlpha(0).setScale(0.5);
    this.tweens.add({targets:go,alpha:1,scaleX:1,scaleY:1,duration:500,ease:'Back.Out',delay:200});

    this.add.text(W/2,H*0.38,'FINAL SCORE',{
      fontFamily:'monospace',fontSize:'10px',color:'#FFD700',alpha:0.5,letterSpacing:5
    }).setOrigin(0.5);
    this.add.text(W/2,H*0.46,sc.toLocaleString(),{
      fontFamily:'monospace',fontSize:'44px',fontStyle:'bold',color:'#FFD700'
    }).setOrigin(0.5);
    this.add.text(W/2,H*0.57,'BEST: '+best.toLocaleString(),{
      fontFamily:'monospace',fontSize:'13px',color:'#AAAAAA'
    }).setOrigin(0.5);

    // Stats
    this.add.text(W/2,H*0.67,'PRESS START TO PLAY AGAIN',{
      fontFamily:'monospace',fontSize:'10px',color:'#888888'
    }).setOrigin(0.5);

    const rst=this.add.text(W/2,H*0.76,'>> ENTER <<',{
      fontFamily:'monospace',fontSize:'18px',fontStyle:'bold',color:'#00E5FF'
    }).setOrigin(0.5);
    this.tweens.add({targets:rst,alpha:0.2,duration:500,yoyo:true,repeat:-1});

    this.add.text(W/2,H*0.92,'BUGZ · PLATANUS HACK 26 · CDMX',{
      fontFamily:'monospace',fontSize:'8px',color:'#333333',letterSpacing:2
    }).setOrigin(0.5);
  }
  update(){
    if(eatPress('START1')||eatPress('START2')){sMenu();this.scene.start('Menu')}
    clearJP();
  }
}

// ─── PHASER CONFIG ──────────────────────────────────────
const config={
  type:Phaser.AUTO,width:W,height:H,
  parent:'game-root',
  backgroundColor:'#050510',
  physics:{default:'arcade',arcade:{gravity:{y:0},debug:false}},
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},
  scene:[MenuScene,GameScene,OverScene]
};
new Phaser.Game(config);
