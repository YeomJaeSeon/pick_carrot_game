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

    this.x = 0;
    this.y = 0;

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
      this.x = getRandom(x1, this.x2);
      this.y = getRandom(y1, this.y2);
      img.style.position = "absolute";
      img.style.left = `${this.x}px`;
      img.style.top = `${this.y}px`;

      this.field.appendChild(img);
    }
  }
  move() {
    const bugs = document.querySelectorAll(".bug");

    this.timer = setInterval(() => {
      bugs.forEach((bug) => {
        const x = getRandom(-50, 50);
        const y = getRandom(-50, 50);

        bug.style.transition = "all 2000ms ease";

        let newX = parseFloat(bug.style.left);
        newX += x;

        // field범위넘어가면안됨.
        if (newX > 0 && newX < this.x2) {
          bug.style.left = `${newX}px`;
        }

        let newY = parseFloat(bug.style.top);
        newY += y;

        // field범위넘어가면안됨.
        if (newY > 0 && newY < this.y2) {
          bug.style.top = `${newY}px`;
        }
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
