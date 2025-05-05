import Map from "./Map.js";

const FLOWER_TO_SEASON = {
  Prunier:     'Hiver',
  Orchidée:    'Printemps',
  Chrysanthème:'Automne',
  Bambou:      'Été'
};

export default class Game {
  constructor(canvas) {
    this.canvas       = canvas;
    this.ctx          = canvas.getContext("2d");
    this.images       = {};
    this.bg           = null;
    this.map          = new Map(canvas, 50, this.images);
    this.tileSize     = 50;
    this.selectedTile = null;
    this.shape        = "pyramide";
    this.score        = 0;
    this.gameOver     = false;
    this.startTime    = 0;
    this.lastMatchTime = 0;
    this.hintPair     = [];
    this.hintsEnabled = false;
    this.isPaused = false;
    this.pauseBtnRegion = {};  
    this.pauseStartTime = 0;
    this.pausedDuration = 0;
  }

  async init() {
    await this.loadImages();
    await this.loadBackground();
    this.generateMap(this.shape);
    this.canvas.addEventListener("click", this.onClick.bind(this));
    this.start();
  }

  async loadImages() {
    const families = ["Cercle", "Bambous", "Caracteres"];
    const names = [];
    for (let i = 1; i <= 9; i++) {
      families.forEach(f => names.push(`${i} ${f}`));
    }
    names.push(
      "Est", "Sud", "Ouest", "Nord",
      "Blanc", "Rouge", "Vert",
      "Prunier", "Orchidée", "Chrysanthème", "Bambou",
      "Printemps", "Été", "Automne", "Hiver"
    );
    await Promise.all(names.map(n => new Promise(resolve => {
      const img = new Image();
      img.src = `./images/${n}.png`;
      img.onload = resolve;
      this.images[n] = img;
    })));
  }

  async loadBackground() {
    const img = new Image();
    img.src = "./images/bg_bois.jpg";
    await new Promise(r => img.onload = r);
    this.bg = img;
  }

  generateMap(shape) {
    this.shape        = shape;
    this.selectedTile = null;
    this.map.generateMap(shape);
    this.score        = 0;
    this.startTime    = Date.now();
    this.lastMatchTime = Date.now();
    this.gameOver     = false;
    this.hintPair     = [];
    
  }

  onClick(evt) {
    if (this.gameOver) {
      this.generateMap(this.shape);
      this.start();
      return;
    }

    
    

    const rect = this.canvas.getBoundingClientRect();
    const cx   = evt.clientX - rect.left;
    const cy   = evt.clientY - rect.top;

    const b = this.pauseBtnRegion;
if (cx >= b.x && cx <= b.x + b.w && cy >= b.y && cy <= b.y + b.h) {
  this.isPaused = !this.isPaused;
  if (this.isPaused) {
    this.pauseStartTime = Date.now();
  } else {
    this.pausedDuration += Date.now() - this.pauseStartTime;
    this.lastMatchTime  = Date.now();
  }
  return;
}
if (this.isPaused) return;

    const tile = [...this.map.tiles]
      .filter(t => t.active)
      .sort((a, b) => b.z - a.z)
      .find(t => {
        const yOff = t.y - t.z * 6;
        return cx >= t.x && cx <= t.x + this.tileSize &&
               cy >= yOff && cy <= yOff + this.tileSize;
      });
    if (!tile || !this.map.isFree(tile)) return;

    if (!this.selectedTile) {
      this.selectedTile = tile;
    } else if (this.selectedTile === tile) {
      this.selectedTile = null;
    } else {
      const a = this.selectedTile.id, b = tile.id;
      if (a === b ||
          FLOWER_TO_SEASON[a] === b ||
          FLOWER_TO_SEASON[b] === a) {
        this.selectedTile.remove();
        tile.remove();
        if (Date.now() - this.lastMatchTime <= 5000) {
          this.score += 150;
        }
        else {this.score += 100;}
        this.lastMatchTime = Date.now();
        this.hintPair = [];
        while (!this.map.hasMoves() && this.map.tiles.some(t => t.active)) {
          this.shuffle();
        }
        if (!this.map.tiles.some(t => t.active)) {
          this.gameOver = true;
          const TempsMis = (Date.now() - this.startTime) / 1000;
          let multiplier;
          if (TempsMis < 240)      multiplier = 4;
          else if (TempsMis < 360) multiplier = 3.5;
          else if (TempsMis < 480) multiplier = 3;
          else if (TempsMis < 600) multiplier = 2.5;
          else if (TempsMis < 720) multiplier = 2;
          else                     multiplier = 1.5;
          this.score = Math.floor(this.score * multiplier);
          return;
        }
      }
      this.selectedTile = null;
    }
  }

  shuffle() {
    this.map.shuffleActiveTiles();
  }

  findHintPair() {
    const frees = this.map.tiles.filter(t => t.active && this.map.isFree(t));
    const counts = {};
    for (let t of frees) counts[t.id] = (counts[t.id] || 0) + 1;
  
    for (let t of frees) if (counts[t.id] >= 2) {
      const pair = frees.filter(x => x.id === t.id).slice(0,2);
      return pair;
    }
    for (let [f, s] of Object.entries(FLOWER_TO_SEASON)) {
      const fa = frees.find(x => x.id === f);
      const sa = frees.find(x => x.id === s);
      if (fa && sa) return [fa, sa];
    }
    return [];
  }

  start() {
  const loop = () => {
    
    const btnW = 80, btnH = 30;
    const btnX = this.canvas.width - btnW - 10;
    const btnY = 35;
    this.pauseBtnRegion = { x:btnX, y:btnY, w:btnW, h:btnH };

    // Fond et bouton
    if (this.bg) this.ctx.drawImage(this.bg, 0,0, this.canvas.width, this.canvas.height);
    else         this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

    this.ctx.textAlign    = "start";
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(btnX, btnY, btnW, btnH);
    this.ctx.fillStyle = "white";
    this.ctx.font      = "18px sans-serif";
    this.ctx.fillText("Pause", btnX+15, btnY+20);

    //  Si Pause 
    if (this.isPaused) {
      this.ctx.fillStyle = "rgba(0,0,0,0.5)";
      this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "white";
      this.ctx.textAlign = "center";
      this.ctx.font      = "36px sans-serif";
      this.ctx.fillText("PAUSE", this.canvas.width/2, this.canvas.height/2);
      
      requestAnimationFrame(loop);
      return;
    }

    // --- Jeu Actif ---
    this.map.drawTiles();

    if (this.selectedTile) {
      const { x, y, z } = this.selectedTile;
      const yOff = y - z*6;
      this.ctx.strokeStyle = "yellow";
      this.ctx.lineWidth   = 4;
      this.ctx.strokeRect(x + 6*z, yOff + 2, this.tileSize-4, this.tileSize-4);
    }

    const now = Date.now();
    if (this.hintsEnabled && !this.gameOver && now - this.lastMatchTime > 20000) {
      if (!this.hintPair.length) this.hintPair = this.findHintPair();
      if (this.hintPair.length === 2) {
        this.ctx.strokeStyle = "blue";
        this.ctx.lineWidth   = 3;
        for (const t of this.hintPair) {
          const yOff = t.y - t.z*6;
          this.ctx.strokeRect(t.x + 6*t.z, yOff + 2, this.tileSize-4, this.tileSize-4);
        }
      }
    }

    const elapsedSec = Math.floor((now - this.startTime - this.pausedDuration)/1000);
    const minutes    = Math.floor(elapsedSec/60);
    const seconds    = elapsedSec % 60;
    const secStr     = seconds<10 ? '0'+seconds : seconds;
    this.ctx.fillStyle = "black";
    this.ctx.font      = "30px sans-serif";
    this.ctx.fillText(`Temps: ${minutes}:${secStr}`, 240, 90);
    this.ctx.fillText(`Score: ${this.score}`,      435, 90);

    if (this.gameOver) {
      this.ctx.fillStyle = "rgba(0,0,0,0.7)";
      this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "white";
      this.ctx.textAlign = "center";
      this.ctx.font      = "36px sans-serif";
      this.ctx.fillText(`Fin – Score: ${this.score}`, this.canvas.width/2, this.canvas.height/2 - 20);
      this.ctx.font      = "24px sans-serif";
      this.ctx.fillText("Cliquez pour rejouer", this.canvas.width/2, this.canvas.height/2 + 30);
      return;
    }

    requestAnimationFrame(loop);
  };

  loop();
}

}
