import * as sound from "./sound.js";

const ITEM_SIZE = 80;

export const ItemType = Object.freeze({
  carrot: "carrot",
  bug: "bug",
});

export class Field {
  constructor(carrotCount, bugCount, isGameRunning) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.isGameRunning = isGameRunning;

    this.field = document.querySelector(".game__field");
    this.fieldRect = this.field.getBoundingClientRect();

    this.field.addEventListener("click", this.onFieldGame);
  }
  setStopListener(onStop) {
    this.onStop = onStop;
  }
  onFieldGame = (event) => {
    if (!this.isGameRunning()) return;
    const target = event.target;
    if (target.matches(".carrot")) {
      sound.playCarrot();
      target.remove();
      this.onStop && this.onStop(ItemType.carrot);
    } else if (target.matches(".bug")) {
      this.onStop && this.onStop(ItemType.bug);
    }
  };
  init() {
    this.field.innerHTML = "";
    this.addItem("carrot", this.carrotCount, "./img/carrot.png");
    this.addItem("bug", this.bugCount, "./img/bug.png");
  }
  addItem(className, count, imgPath) {
    const x1 = 0;
    const x2 = this.fieldRect.width - ITEM_SIZE;
    const y1 = 0;
    const y2 = this.fieldRect.height - ITEM_SIZE;

    for (let i = 0; i < count; i++) {
      const img = document.createElement("img");
      img.setAttribute("class", className);
      img.setAttribute("src", imgPath);
      const x = getRandom(x1, x2);
      const y = getRandom(y1, y2);
      img.style.position = "absolute";
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;

      this.field.appendChild(img);
    }
  }
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
