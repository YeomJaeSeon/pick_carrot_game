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
        const x = getRandomMove(-1, 1);
        const y = getRandomMove(-1, 1);
        const bugX = bug.style.top;
        const bugY = bug.style.left;
        const newX = bugX + x;
        const newY = bugY + y;

        bug.style.transform = `translateX(${x}px) translateY(${y}px)`;
        // bug.style.transform = `translateY(${y}px)`;

        // bug.style.left = `${newX}px`;
        // bug.style.top = `${newY}px`;
        // bug.style.transition = `transform 300ms ease`;
        // bug.style.
        // bug.style.transform = `translateX(${x}px)`;

        // bug.style.transform = `translateY(${y}px)`;
        //bug.style.transform = `translate(${x}px, ${y}px);`;
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
function getRandomMove(min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min) * 10;
}
