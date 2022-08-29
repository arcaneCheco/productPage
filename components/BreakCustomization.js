import { World } from "../World";
import ColorPicker from "simple-color-picker";

export class BreakCustomization {
  constructor() {
    this.world = new World();
    this.element = document.querySelector(".customize__wrapper");
    this.colorHandler = this.world.model.breakOptions.color;
    this.option = this.element.querySelector("#break__color");

    this.colorPickerContainer = this.element.querySelector(".colorPicker");

    this.colorPickerActive = false;

    const colorPicker = new ColorPicker({
      el: this.colorPickerContainer,
    });
    colorPicker.setColor("#00ff00");

    colorPicker.onChange((hexColor) => {
      this.colorHandler(hexColor);
      this.option.style.backgroundColor = hexColor;
    });

    this.option.onclick = () => {
      if (this.colorPickerActive) {
        this.colorPickerContainer.style.display = "none";
        this.colorPickerActive = false;
      } else {
        this.colorPickerActive = true;
        this.colorPickerContainer.style.display = "block";
      }
    };
  }
}
