import Game from "./Game.js";

window.onload = async () => {
    const canvas = document.getElementById("myCanvas");
    const game = new Game(canvas);
    await game.init();
    game.start();
    document.getElementById("mapSelect")
        .addEventListener("change", e => game.generateMap(e.target.value));
    document.getElementById("reshuffleBtn")
    .addEventListener("click", () => game.shuffle());
};
