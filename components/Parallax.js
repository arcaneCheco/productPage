import { World } from "../World";
import * as THREE from "three";

export class Parallax {
  constructor() {
    this.world = new World();
    this.camera = this.world.camera;
    this.mouse = this.world.mouse;
    this.initialHeight = this.camera.userData.initialPosition.y;
    this.lerp = 0.03;
    this.magZ = 2;
    this.magY = 2;
    this.enabled = true;
    this.target = new THREE.Vector2();
  }

  setTarget() {
    if (!this.enabled) return;
    this.target.y = this.mouse.y * this.magY;
    this.target.x = -this.mouse.x * this.magZ;
  }

  onPointermove() {
    this.setTarget();
  }

  update() {
    if (this.enabled) {
      this.camera.position.z +=
        (this.target.x - this.camera.position.z) * this.lerp;
      this.camera.position.y +=
        (this.target.y + this.initialHeight - this.camera.position.y) *
        this.lerp;
      //   this.camera.position.y = Math.max(this.camera.position.y, 0.05);

      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
  }
}
