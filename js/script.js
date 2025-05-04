import Game from "./Game.js";

window.onload = async () => {
  
  const canvas = document.getElementById("myCanvas");
  const game   = new Game(canvas);
  await game.init();
  game.start();

  
  document.getElementById("mapSelect")
    .addEventListener("change", e => game.generateMap(e.target.value));

 
  document.getElementById("reshuffleBtn")
    .addEventListener("click", () => {
      game.shuffle();
      game.score -= 200;
      if (game.score < 0) game.score = 0;
    });

  
  const btn    = document.getElementById("rulesBtn");
  const modal  = document.getElementById("rulesModal");
  const closeX = modal.querySelector(".close");

  btn.addEventListener("click",  () => modal.style.display = "flex");
  closeX.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
};
