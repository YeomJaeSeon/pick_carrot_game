import { Field, ItemType } from "./field.js";
import * as sound from "./sound.js";

export const Reason = Object.freeze({
  cancel: "cancel",
  win: "win",
  lose: "lose",
});

export class GameBuilder {
  withDuration(gameDuration) {
    this.gameDuration = gameDuration;
    return this;
  }
  withCarrotCount(carrotCount) {
    this.carrotCount = carrotCount;
    return this;
  }
  withBugCount(bugCount) {
    this.bugCount = bugCount;
    return this;
  }
  build() {
    return new Game(this.gameDuration, this.carrotCount, this.bugCount);
  }
}
class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameBtn = document.querySelector(".game__button");
    this.gameTimer = document.querySelector(".game__timer");
    this.gameScore = document.querySelector(".game__score");

    this.gameBtn.addEventListener("click", () => {
      if (!this.started) {
        this.startGame();
      } else {
        this.stop(Reason.cancel);
      }
    });

    this.started = false;
    this.score = 0;
    this.timer = undefined;

    this.gameField = new Field(
      this.carrotCount,
      this.bugCount,
      () => this.started
    );
    this.gameField.setStopListener(this.onFieldGame);
  }
  setStopListener(onStop) {
    this.onStop = onStop;
  }
  onFieldGame = (item) => {
    ++this.score;
    this.upDateScore();
    if (item === ItemType.carrot) {
      if (this.carrotCount === this.score) this.stop(Reason.win);
    } else if (item === ItemType.bug) this.stop(Reason.lose);
  };
  startGame() {
    sound.stopBg();
    sound.playBg();
    this.started = true;
    this.init();
    this.changePauseBtn();
    this.showGameTimer();
    this.showGameScore();
    this.startGameTimer();
  }
  stop(reason) {
    sound.stopBg();
    this.started = false;

    this.hideGameBtn();
    this.stopGameTimer();

    this.onStop && this.onStop(reason);
  }

  showGameBtn() {
    this.gameBtn.style.visibility = "visible";
  }
  hideGameBtn() {
    this.gameBtn.style.visibility = "hidden";
  }
  changePauseBtn() {
    const playBtn = document.querySelector(".fas");
    playBtn.classList.add("fa-stop");
    playBtn.classList.remove("fa-play");
  }
  startGameTimer() {
    let remainTimes = this.gameDuration;
    this.upDateTimer(remainTimes);
    this.timer = setInterval(() => {
      this.upDateTimer(--remainTimes);
      if (remainTimes <= 0) {
        this.stopGameTimer();
        this.stop(this.carrotCount === this.score ? Reason.win : Reason.lose);
      }
    }, 1000);
  }
  stopGameTimer() {
    clearInterval(this.timer);
  }
  upDateTimer(time) {
    const minute = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerText = `${minute}:${seconds}`;
  }
  showGameTimer() {
    this.gameTimer.style.visibility = "visible";
  }
  showGameScore() {
    this.gameScore.style.visibility = "visible";
  }
  init() {
    this.score = 0;
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();
  }
  upDateScore() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }
}
