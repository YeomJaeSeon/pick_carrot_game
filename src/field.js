import * as sound from "./sound.js";

("use strict");
const ITEM_SIZE = 80;
const MOVE_DURATION = 500;

export const ItemType = Object.freeze({
  carrot: "carrot",
  bug: "bug",
});

export class Field {
  constructor(carrotCount, bugCount, isGameRunning, level) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.isGameRunning = isGameRunning;
    this.level = level;

    this.field = document.querySelector(".game__field");
    this.fieldRect = this.field.getBoundingClientRect();

    this.x2 = this.fieldRect.width - ITEM_SIZE;
    this.y2 = this.fieldRect.height - ITEM_SIZE;

    this.field.addEventListener("click", this.onFieldGame);

    this.timer = undefined;
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
    this.addItem("carrot", this.carrotCount * this.level(), "./img/carrot.png");
    this.addItem("bug", this.bugCount * this.level(), "./img/bug.png");
    this.move();
  }
  addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;

    for (let i = 0; i < count; i++) {
      const img = document.createElement("img");
      img.setAttribute("class", className);
      img.setAttribute("src", imgPath);
      const x = getRandom(x1, this.x2);
      const y = getRandom(y1, this.y2);
      img.style.position = "absolute";
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;

      this.field.appendChild(img);
    }
  }
  move() {
    const bugs = document.querySelectorAll(".bug");
    this.timer = setInterval(() => {
      bugs.forEach((bug) => {
        const x = getRandom(0, this.x2);
        const y = getRandom(0, this.y2);
        bug.style.left = `${x}px`;
        bug.style.top = `${y}px`;
      });
    }, MOVE_DURATION);
  }
  moveStop() {
    clearInterval(this.timer);
  }
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
