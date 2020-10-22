import Popup from "./popup.js";
import { GameBuilder, Reason } from "./game.js";
import * as sound from "./sound.js";

("use strict");

const finishGameBanner = new Popup();

const game = new GameBuilder()
  .withDuration(3)
  .withCarrotCount(3)
  .withBugCount(3)
  .build();

game.setStopListener((reason) => {
  let message;
  switch (reason) {
    case Reason.cancel:
      message = "REPLAY??";
      sound.playAlert();
      break;
    case Reason.win:
      message = "WIN!!";
      sound.playWin();
      break;
    case Reason.lose:
      message = "LOSE ㅠ.ㅠ";
      sound.playBug();
      break;
    default:
      throw new Error("NO MESSAGE!!");
  }
  finishGameBanner.showPopup(message);
});
finishGameBanner.setClickListener(() => {
  game.startGame();
  game.showGameBtn();
});
