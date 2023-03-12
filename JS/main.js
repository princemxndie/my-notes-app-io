//import NotesAPI from "./NotesAPI.js";
//import NotesView from "./NotesView.js";
import App from "./App.js";

const root = document.getElementById("app");
const app = new App(root);

/**
 * 
 * @param {EventTarget} target
 * @param {Function} callback
 * 
*/ /*
class clickAndHold {
  constructor(target, callback) {
    this.target = target;
    this.callback = callback;
    this.isHeld = false;
    this.activeHoldTimeoutId = null;
    
    ["mousedown", "touchstart"].forEach(type => {
      this.target.addEventListener(type, this._onHoldStart.bind(this));
    });
    
    ["mouseup", "mouseleave", "mouseout", "touchend", "touchcancel"].forEach(type => {
      this.target.addEventListener(type, this._onHoldEnd.bind(this));
    });

  }
  
  _onHoldStart() {
    this.isHeld = true;
    
    this.activeHoldTimeoutId = setTimeout(() => {
      if (this.isHeld) {
        this.callback();
      }
    }, 1000);
  }
  
  _onHoldEnd() {
    this.isHeld = false;
    clearTimeout(this.activeHoldTimeoutId);
  }
  
  static apply(target, callback) {
    new clickAndHold(target, callback);
  }
}

const note = document.querySelectorAll(".notes__list-item").forEach(note => {
  clickAndHold.apply(note, () => {
    console.log("Hey, callback is running!");
  });
});

*/