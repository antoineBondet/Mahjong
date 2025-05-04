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
    this.bg     = null;
    this.map          = new Map(canvas, 50, this.images);
    this.tileSize     = 50;
    this.selectedTile = null;
    this.shape        = "pyramide";
    this.gameOver     = false;
  }

  async init() {
    await this.loadImages();
    await this.loadBackground();
    this.generateMap("pyramide");
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
    for (const n of names) {
      const img = new Image();
      img.src = `./images/${n}.png`;
      this.images[n] = img;
      await new Promise(r => img.onload = r);
    }
  }
  async loadBackground() {
    const img = new Image();
    img.src = "./images/bg_bois.jpg";  
    await new Promise(r => img.onload = r);
    this.bg = img;
  }

  generateMap(shape) {
    this.shape = shape;
    this.selectedTile = null;
    this.map.generateMap(shape);
    this.score= 0;
    this.startTime = Date.now();
    this.gameOver = false;
  }

  onClick(evt) {
    if (this.gameOver) {
      this.generateMap(this.shape);
      this.start();                      
      return;
    }
    const anyActive = this.map.tiles.some(t => t.active);
    
    if (!this.map.hasMoves() || !anyActive) {
      this.gameOver = true;
      const TempsPartie = (Date.now() - this.startTime) / 1000;
      let multiplier ;
      if (TempsPartie < 240) {
        multiplier = 4;
      } else if (TempsPartie < 480) {
        multiplier = 3;
      } else if (TempsPartie < 720) {
        multiplier = 2;
      } else {
        multiplier = 1.5;
      }
      this.score = this.score * multiplier;
      return;
    }
    const rect  = this.canvas.getBoundingClientRect();
    const cx    = evt.clientX - rect.left;
    const cy    = evt.clientY - rect.top;
    const tiles = [...this.map.tiles].sort((a, b) => b.z - a.z);
  
    for (const tile of tiles) {
      if (!tile.active) continue;
      const yOff = tile.y - tile.z * 6;
      if (
        cx >= tile.x && cx <= tile.x + this.tileSize &&
        cy >= yOff   && cy <= yOff   + this.tileSize
      ) {
        if (!this.map.isFree(tile)) return;
  
        if (!this.selectedTile) {
          this.selectedTile = tile;
        } else if (this.selectedTile === tile) {
          this.selectedTile = null;
        } else if (
          this.selectedTile.id === tile.id ||
          FLOWER_TO_SEASON[this.selectedTile.id] === tile.id ||
          FLOWER_TO_SEASON[tile.id] === this.selectedTile.id
        ) {
          this.selectedTile.remove();
          tile.remove();
          this.score += 100;
          this.selectedTile = null;
          while (!this.map.hasMoves()&& this.map.tiles.some(t => t.active)) this.shuffle();
        } else {
          this.selectedTile = tile;
        }
        return;
      }
    }
  }
  

  shuffle() {
    this.map.shuffleActiveTiles();
  }

  start() {
    const loop = () => {
      if (this.bg) {
        this.ctx.drawImage(this.bg, 0, 0,this.canvas.width, this.canvas.height);
      } else {
        this.ctx.clearRect(0, 0,this.canvas.width, this.canvas.height);
      }
  
      this.map.drawTiles();
  
      if (this.selectedTile) {
        const { x, y, z } = this.selectedTile;
        const yOff = y - z * 6;
        this.ctx.strokeStyle = "yellow";
        this.ctx.lineWidth   = 4;
        this.ctx.strokeRect(x +6*z, yOff + 2,this.tileSize - 4, this.tileSize - 4);
      }
      const TempsPartie = this.gameOver ? (Date.now()-this.startTime)/1000 : (Date.now()-this.startTime)/1000;
      this.ctx.fillStyle = "black";
      this.ctx.font      = "30px sans-serif";
      this.ctx.fillText(`Temps: ${Math.floor(TempsPartie)}`, 250, 90);
      this.ctx.fillText(`Score: ${this.score}`, 425, 90);
      const anyActive = this.map.tiles.some(t => t.active);
      if (!this.map.hasMoves() || !anyActive) {
        this.ctx.fillStyle = "rgba(0,0,0,0.7)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
