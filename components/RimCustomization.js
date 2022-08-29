import { World } from "../World";
import ColorPicker from "simple-color-picker";

export class RimCustomization {
  constructor() {
    this.world = new World();
    this.handlers = this.world.model.rimOptions;
    this.element = document.querySelector(".customize__wrapper");
    this.option1 = this.element.querySelector("#rim1");
    this.option2 = this.element.querySelector("#rim2");
    this.barrelMaterialOption1 = this.element.querySelector(
      "#barrelMaterialMetal"
    );
    this.barrelMaterialOption2 =
      this.element.querySelector("#barrelMaterialCF");

    this.colorPickerContainer = this.element.querySelector(".barrelColor");
    this.colorPickerActive = false;
    this.isMetal = true;

    const colorPicker = new ColorPicker({
      el: this.colorPickerContainer,
    });
    colorPicker.setColor("#0000ff");

    colorPicker.onChange((hexColor) => {
      this.handlers.setBarrelColor(hexColor);
      this.barrelMaterialOption1.style.backgroundColor = hexColor;
    });

    this.option1.onclick = ({ target }) => {
      this.handlers.setModel1();
      this.option1.classList.add("activeOption");
      this.option2.classList.remove("activeOption");
    };
    this.option2.onclick = () => {
      this.option2.classList.add("activeOption");
      this.option1.classList.remove("activeOption");
      this.handlers.setModel2();
    };
    this.barrelMaterialOption1.onclick = () => {
      this.handlers.setBarrelMetal();
      this.barrelMaterialOption1.classList.add("activeOption");
      this.barrelMaterialOption2.classList.remove("activeOption");

      if (this.isMetal) {
        if (this.colorPickerActive) {
          this.colorPickerContainer.style.display = "none";
          this.colorPickerActive = false;
        } else {
          this.colorPickerActive = true;
          this.colorPickerContainer.style.display = "block";
        }
      } else {
        this.handlers.setBarrelMetal();
        this.isMetal = true;
      }
    };
    this.barrelMaterialOption2.onclick = () => {
      this.barrelMaterialOption2.classList.add("activeOption");
      this.barrelMaterialOption1.classList.remove("activeOption");
      this.isMetal = false;
      this.colorPickerContainer.style.display = "none";
      this.colorPickerActive = false;
      this.handlers.setBarrelCarbonFibre();
    };
  }
}
