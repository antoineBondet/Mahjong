import Game from "./Game.js";

window.onload = async () => {
  
  const canvas = document.getElementById("myCanvas");
  const game   = new Game(canvas);
  await game.init();
  game.start();

  const music = document.getElementById('bgMusic');
  music.volume = 0.20; 

  
  const muteBtn = document.createElement('button');
  muteBtn.textContent = '🔈';
  muteBtn.id = 'muteBtn';
  document.body.appendChild(muteBtn);

  muteBtn.addEventListener('click', () => {
    if (music.paused) {
      music.play();
      muteBtn.textContent = '🔊';
    } else {
      music.pause();
      muteBtn.textContent = '🔈';
    }
  });

  document.getElementById("mapSelect")
    .addEventListener("change", e => game.generateMap(e.target.value));

 
  document.getElementById("reshuffleBtn")
    .addEventListener("click", () => {
      game.shuffle();
      game.score -= 200;
      if (game.score < 0) game.score = 0;
    });
    const hintToggle = document.getElementById("hintToggle");

    game.hintsEnabled = hintToggle.checked;
    hintToggle.addEventListener("change", e => {
      game.hintsEnabled = e.target.checked;
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
