export default class Popup {
  constructor() {
    this.popup = document.querySelector(".popup");
    this.popupBtn = document.querySelector(".popup__refresh");
    this.popupMessage = document.querySelector(".popup__message");

    this.popupBtn.addEventListener("click", () => {
      this.hidePopup();
      this.onClick && this.onClick();
    });
  }
  setClickListener(onClick) {
    this.onClick = onClick;
  }
  hidePopup() {
    this.popup.classList.add("popup--hide");
  }
  showPopup(text) {
    this.popup.classList.remove("popup--hide");
    this.popupMessage.innerText = text;
  }
}
