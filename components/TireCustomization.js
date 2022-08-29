import { World } from "../World";

export class TireCustomization {
  constructor() {
    this.world = new World();
    this.handlers = this.world.model.tireOptions;
    this.element = document.querySelector(".customize__wrapper");
    this.option1 = this.element.querySelector("#tire1");
    this.option2 = this.element.querySelector("#tire2");
    // this.modelOptionElements = Array.from(
    //   this.element.querySelectorAll(".option")
    // );

    this.option1.onclick = ({ target }) => {
      // ev.target.id
      this.handlers.setModel1();
      this.option1.classList.add("activeOption");
      this.option2.classList.remove("activeOption");
    };
    this.option2.onclick = (ev) => {
      this.option2.classList.add("activeOption");
      this.option1.classList.remove("activeOption");
      // ev.target.id
      this.handlers.setModel2();
    };
  }
}
