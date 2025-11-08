document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("audio");
  const cover = document.getElementById("cover");
  const buttons = Array.from(document.querySelectorAll(".track"));
  if (!audio || buttons.length === 0) return;

  let idx = 0;

  function playByIndex(i) {
    idx = i;
    const b = buttons[idx];
    if (!b) return;
    audio.src = b.dataset.src;
    audio.play().catch(() => {});
    if (cover && b.dataset.cover) cover.src = b.dataset.cover;
    buttons.forEach(x => x.classList.remove("active"));
    b.classList.add("active");
  }

  buttons.forEach((b, i) => b.addEventListener("click", () => playByIndex(i)));

  audio.addEventListener("ended", () => {
    const next = (idx + 1) % buttons.length;
    playByIndex(next);
  });

  buttons[0].classList.add("active");
});
