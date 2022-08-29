import { World } from "../World";
import GSAP from "gsap";

export class AssemblyViewManager {
  constructor() {
    this.world = new World();
    this.scene = this.world.scene;
    this.model = this.world.model;
    this.parent = this.model.parent;
    this.tire = this.model.tire;
    this.rim = this.model.rim;
    this.break = this.model.break;
    this.raycaster = this.world.raycaster;
    this.camera = this.world.camera;
    this.markers = this.world.markers;
    this.mouse = this.world.mouse;
    this.parallax = this.world.parallax;
    this.titleElement = document.querySelector(".title");

    this.isExploded = false;

    this.explodeButton = document.querySelector(".explode");
    this.explodeButton.onclick = () => this.explode();

    this.assembleButton = document.querySelector(".assemble");
    this.assembleButton.onclick = () => this.assemble();

    this.setAnimations();
  }

  show(targetGroup) {
    this.explodeAnimation.timeScale(1);
    this.explodeAnimation.pause();
    targetGroup && this.parent.add(targetGroup);
    this.scene.add(this.parent);
    this.titleElement.innerText = "Full Assembly";
    this.parallax.enabled = true;
    this.explodeButton.style.visibility = "visible";
    this.assembleButton.style.visibility = "visible";
  }

  hide() {
    this.scene.remove(this.parent);
    if (this.isExploded) {
      this.explodeAnimation.timeScale(200);
      this.assemble();
    }
    this.explodeButton.style.visibility = "hidden";
    this.assembleButton.style.visibility = "hidden";
    this.markers.hide();
  }

  onPointermove() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const [hit] = this.raycaster.intersectObjects(this.parent.children);
    if (hit) {
      document.body.style.cursor = "pointer";
      this.hover = true;
      this.target = hit.object.name;
      this.markers.onPointermove(this.target);
    } else {
      this.target = null;
      document.body.style.cursor = "";
    }
  }

  onPointerdown() {
    this.down = true;
  }

  onPointerup() {
    if (!this.down) return;
    if (this.target) {
      this.parallax.enabled = false;
    } else {
      this.parallax.enabled = true;
    }
  }

  onResize() {}

  update() {
    this.markers.update();
  }

  setAnimations() {
    const dur = 0.8;
    this.explodeAction = GSAP.timeline({
      paused: true,
      defaults: { ease: "none", duration: dur },
    });
    this.explodeAction
      .to(this.parent.rotation, { y: -Math.PI / 2 }, 0)
      .to(this.tire.position, { x: -2 }, dur / 4)
      .to(this.rim.position, { x: 2 }, dur / 4)
      .to(this.tire.rotation, { y: Math.PI / 2 }, dur / 2)
      .to(this.rim.rotation, { y: Math.PI / 2 }, dur / 2)
      .to(this.break.rotation, { y: Math.PI / 2 }, dur / 2);

    this.explodeAnimation = GSAP.to(this.explodeAction, {
      time: this.explodeAction.duration(),
      duration: this.explodeAction.duration(),
      ease: "power1.out",
      paused: true,
    });
  }

  explode() {
    if (this.isExploded) return;
    this.isExploded = true;
    this.explodeAnimation.play();
  }

  assemble() {
    if (!this.isExploded) return;
    this.isExploded = false;
    this.explodeAnimation.reverse();
  }
}
