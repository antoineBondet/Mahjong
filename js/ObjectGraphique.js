export default class ObjectGraphique {
    constructor(taille, image, id) {
        this.taille = taille;
        this.image   = image;
        this.id      = id;
        this.active  = true;
        this.gridX   = 0;
        this.gridY   = 0;
        this.gridZ   = 0;
        this.x       = 0;
        this.y       = 0;
        this.z       = 0;
    }

    draw(ctx) {
        if (!this.active) return;
        const yOffset = this.y - this.z * 5;
        ctx.drawImage(this.image, this.x, yOffset, this.taille, this.taille);
    }

    remove() {
        this.active = false;
    }

    isEmpty() {
        return !this.active;
    }
}
