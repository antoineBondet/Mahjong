import ObjectGraphique from "./ObjectGraphique.js";
import pyramideMask from "./maps/pyramide.js";
import tortueMask   from "./maps/tortue.js";
import murailleMask from "./maps/muraille.js";

const MAP_MASKS = { pyramide: pyramideMask, tortue: tortueMask, muraille: murailleMask };
const FLOWER_TO_SEASON = {
  Prunier:     'Hiver',
  Orchidée:    'Printemps',
  Chrysanthème:'Automne',
  Bambou:      'Été'
};


export default class Map {
  constructor(canvas, tileSize, images) {
    this.ctx = canvas.getContext("2d");
    this.tileSize = tileSize;
    this.images = images;
    this.tiles = [];
    this.grid = {};
  }

  generateMap(shape) {
    this.tiles = [];
    this.grid = {};
    const bag = this.randomTileName();
    const masks = MAP_MASKS[shape];
    if (!masks) return;
    Object.entries(masks).forEach(([z, rows]) => {
      const level = +z;
      rows.forEach((row, y) => {
        [...row].forEach((c, x) => {
          if (c === "#"){
            const name = bag.shift();
          this.addTile(x, y+2, level, name);
          } 
        })
      });
    });
  }

  addTile(gx, gy, gz, name) {
    const img = this.images[name];
    const t = new ObjectGraphique(this.tileSize, img, name);
    t.gridX = gx; t.gridY = gy; t.gridZ = gz;
    t.x = gx * this.tileSize;
    t.y = gy * this.tileSize;
    t.z = gz;
    this.tiles.push(t);
    this.grid[`${gx}|${gy}|${gz}`] = t;
  }

  randomTileName() {
    const r = [];
    for (let i=1;i<=4;i++) {
    for (let j = 1; j <= 9; j++) ["Cercle","Bambous","Caracteres"].forEach(f=>r.push(`${j} ${f}`));
    }
    for (let i=1;i<=4;i++) {
    r.push("Est","Sud","Ouest","Nord","Blanc","Rouge","Vert");
    }
    r.push("Prunier","Orchidée","Chrysanthème","Bambou","Printemps","Été","Automne","Hiver");
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r
  }
  

  

  getTileAt(x,y,z) { return this.grid[`${x}|${y}|${z}`] || null; }

  isFree(t) {
    const a=this.getTileAt(t.gridX,t.gridY,t.gridZ+1);
    const l=this.getTileAt(t.gridX-1,t.gridY,t.gridZ);
    const r=this.getTileAt(t.gridX+1,t.gridY,t.gridZ);
    return !(a&&a.active) && ((!l||!l.active)||(!r||!r.active));
  }

  
  hasMoves() {
    const freeTiles = this.tiles.filter(t => t.active && this.isFree(t));
  const counts    = {};
  freeTiles.forEach(t => {
    counts[t.id] = (counts[t.id] || 0) + 1;
  });
  if (Object.values(counts).some(c => c >= 2)) {
    return true;
  }
  const freeIds = new Set(freeTiles.map(t => t.id));
  for (const [flower, season] of Object.entries(FLOWER_TO_SEASON)) {
    if (freeIds.has(flower) && freeIds.has(season)) {
      return true;
    }
  }

  return false;
}

  shuffleActiveTiles() {
    const activeTiles = this.tiles.filter(t => t.active);
    const pool = activeTiles.map(t => ({ image: t.image, id: t.id }));
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    activeTiles.forEach((t, i) => {
      t.image = pool[i].image;
      t.id    = pool[i].id;
    });
  }

  drawTiles() {
    const DX = 4;      
    const DY = 6;      
    this.tiles.forEach(t => {
      if (!t.active) return;
      const x = t.x + t.z * DX;
      const y = t.y - t.z * DY;
      const s = 0.25;
      this.ctx.fillStyle = `rgba(0,0,0,${s})`;
      this.ctx.fillRect(x + 1, y + 6, this.tileSize, this.tileSize);
      if (t.z) {
        this.ctx.fillStyle = `rgba(255,255,255,${0.08 * t.z})`;
        this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
      }
      this.ctx.strokeStyle = "#000";
      this.ctx.lineWidth   = 1;
      this.ctx.strokeRect(x, y, this.tileSize, this.tileSize);
      this.ctx.drawImage(t.image, x, y, this.tileSize, this.tileSize);
    });
  }
  
}
