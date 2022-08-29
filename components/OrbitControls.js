import * as THREE from "three";
import { World } from "./World";

export class OrbitControls {
  constructor() {
    this.world = new World();
    this.mouse = this.world.mouse;
    this.camera = this.world.camera;
    this.raycaster = this.world.raycaster;
    this.current = new THREE.Vector2();
    this.target = new THREE.Vector2();
    this.diff = new THREE.Vector2();
    this.sensitivity = 0.003;
    this.lerp = 0.05;
    this.enabled = false;
    this.hoverTargetObject = false;
  }

  setTargetObject(targetObject) {
    if (targetObject.isMesh) {
      this.targetObject = [targetObject];
    } else {
      this.targetObject = [];
      targetObject.traverse((child) => {
        child.isMesh && this.targetObject.push(child);
      });
    }
  }

  onPointerdown(coords) {
    this.raycaster.setFromCamera(coords, this.camera);
    const [hit] = this.raycaster.intersectObjects(this.targetObject);
    if (hit) {
      this.hoverTargetObject = true;
      this.enabled = true;
      this.current.x = coords.x;
      this.current.y = coords.y;
      this.target.x = coords.x;
      this.target.y = coords.y;
    } else {
      this.hoverTargetObject = false;
      this.enabled = false;
    }
  }

  onPointermove() {
    if (this.enabled) {
      this.target.x = this.mouse.x;
      this.target.y = this.mouse.y;
    }
  }

  onPointerup() {}

  update() {
    this.current.lerp(this.target, this.lerp);
    this.diff.subVectors(this.target, this.current);
    if (this.diff.length() > 1) {
      this.diff.multiplyScalar(this.sensitivity);
      const q = new THREE.Quaternion().setFromEuler(
        new Euler(this.diff.y, this.diff.x, 0, "XYZ")
      );
      this.targetObject.quaternion.multiplyQuaternions(
        q,
        this.targetObject.quaternion
      );
    }
  }
}
