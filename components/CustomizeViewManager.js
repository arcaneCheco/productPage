import { World } from "../World";

export class CustomizeViewManager {
  constructor() {
    this.world = new World();
    this.scene = this.world.scene;
    this.parent = this.world.model.parent;
    this.camera = this.world.camera;
    this.assemblyViewNavElement = document.querySelector(".toAssembly");
    this.assemblyViewNavElement.onclick = () => {
      this.world.changeView("assembly", this.targetGroup);
    };
    this.titleElement = document.querySelector(".title");

    this.customizePanelElement = document.querySelector("#customizePanel");

    this.customizePanels = {
      tire: this.customizePanelElement.querySelector("#customize__tire"),
      break: this.customizePanelElement.querySelector("#customize__break"),
      rim: this.customizePanelElement.querySelector("#customize__rim"),
    };
  }

  show(target) {
    this.panel = this.customizePanels[target];
    this.panel.style.display = "block";

    this.targetGroup = this.parent.children.find(
      (group) => group.name === target
    );
    this.scene.add(this.targetGroup);
    this.world.parallax.enabled = false;
    this.assemblyViewNavElement.style.visibility = "visible";
    this.customizePanelElement.style.display = "flex";
    const title = target.split("");
    title[0] = title[0].toUpperCase();
    this.titleElement.innerText = title.join("");

    this.camera.position.set(...this.camera.userData.initialPosition);
    this.camera.rotation.set(...this.camera.userData.initialRotation);
    this.targetGroup.position.set(0, 0, 1.8);
  }

  hide() {
    this.panel.style.display = "none";
    this.assemblyViewNavElement.style.visibility = "hidden";
    this.customizePanelElement.style.display = "none";
    this.targetGroup.position.set(0, 0, 0);
    this.scene.remove(this.targetGroup);
  }

  onPointermove() {}

  onPointerdown(coords) {}

  onPointerup() {}

  onResize() {}

  update() {}
}
