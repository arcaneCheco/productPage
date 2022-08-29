import { World } from "../World";
import * as THREE from "three";
import data from "../data.json";

export class Markers {
  constructor() {
    this.world = new World();
    this.camera = this.world.camera;
    this.model = this.world.model;
    this.timerDuration = 2500;
    this.lerp = 0.1;
    this.entries = data.markers.map(
      ({ id, description, title, position, descriptionOffset }) => {
        const domElement = document.getElementById(id);
        const titleElement = domElement.querySelector(".text__title");
        titleElement.innerText = title;
        const descriptionElement =
          domElement.querySelector(".text__description");
        descriptionElement.innerText = description;
        const navElement = domElement.querySelector(".actionButtons");
        navElement.onclick = (ev) => {
          const target = ev.target.offsetParent.id;
          this.world.changeView("customize", target);
        };
        const group3D = this.model.parent.children.find(
          ({ name }) => name === id
        );
        return {
          position3D: new THREE.Vector3(...position),
          descriptionOffset: new THREE.Vector2(...descriptionOffset),
          group3D,
          id,
          domElement,
          active: false,
          positionScreen: new THREE.Vector2(),
          hoverDomElement: false,
          timer: null,
          progress: 0,
        };
      }
    );

    this.initCanvas();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  drawCircle({ x, y }) {
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 10, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.lineWidth = 1;
  }

  drawLine(targetEntry) {
    this.ctx.beginPath();
    this.ctx.moveTo(targetEntry.positionScreen.x, targetEntry.positionScreen.y);
    this.ctx.lineTo(
      targetEntry.positionScreen.x +
        targetEntry.descriptionOffset.x * targetEntry.progress,
      targetEntry.positionScreen.y +
        targetEntry.descriptionOffset.y * targetEntry.progress
    );
    this.ctx.stroke();
  }

  draw(targetEntry) {
    this.drawCircle(targetEntry.positionScreen);
    this.drawLine(targetEntry);
    targetEntry.domElement.style.opacity = targetEntry.progress;
  }

  updateDescriptionPosition(targetEntry) {
    targetEntry.domElement.style.left = `${
      targetEntry.positionScreen.x + targetEntry.descriptionOffset.x
    }px`;
    targetEntry.domElement.style.top = `${
      targetEntry.positionScreen.y + targetEntry.descriptionOffset.y
    }px`;
  }

  update() {
    this.clearCanvas();
    this.entries.map((entry) => {
      if (!entry.active) return;
      this.updateScreenPosition(entry);
      this.updateProgress(entry);
      this.updateDescriptionPosition(entry);
      this.draw(entry);
    });
  }

  ndcToScreen(x, y) {
    const screenX = (window.innerWidth * (x + 1)) / 2;
    const screenY = (window.innerHeight * (-y + 1)) / 2;
    return [screenX, screenY];
  }

  updateProgress(targetEntry) {
    targetEntry.progress += (1 - targetEntry.progress) * this.lerp;
  }

  updateScreenPosition(targetEntry) {
    let positionNDC = new THREE.Vector3();
    targetEntry.group3D.getWorldPosition(positionNDC);
    positionNDC.add(targetEntry.position3D);
    positionNDC.project(this.camera);
    const [screenX, screenY] = this.ndcToScreen(positionNDC.x, positionNDC.y);
    targetEntry.positionScreen.set(screenX, screenY);
  }

  resetTimer(targetEntry) {
    window.clearTimeout(targetEntry.timer);
    this.setTimer(targetEntry);
  }

  setTimer(targetEntry) {
    targetEntry.timer = window.setTimeout(
      this.animateOut.bind(this),
      this.timerDuration,
      targetEntry
    );
  }

  addListeners(targetEntry) {
    targetEntry.domElement.onpointermove = this.domElementPointermove.bind(
      this,
      targetEntry
    );
  }

  removeListeners(targetEntry) {
    targetEntry.domElement.onpointermove = null;
  }

  domElementPointermove(targetEntry) {
    this.resetTimer(targetEntry);
  }

  animateOut(targetEntry) {
    targetEntry.active = false;
    targetEntry.progress = 0;
    this.removeListeners(targetEntry);
    targetEntry.domElement.style.visibility = "hidden";
  }

  animateIn(targetEntry) {
    targetEntry.active = true;
    targetEntry.domElement.style.visibility = "visible";
    this.addListeners(targetEntry);
    this.setTimer(targetEntry);
  }

  onPointermove(target) {
    const targetEntry = this.entries.find(({ id }) => id === target);
    if (targetEntry.active) {
      this.resetTimer(targetEntry);
    } else {
      this.animateIn(targetEntry);
    }
  }

  hide() {
    this.entries.map((entry) => {
      this.animateOut(entry);
      this.clearCanvas();
    });
  }

  initCanvas() {
    const container = document.getElementById("canvas2d");
    const canvas2d = document.createElement("canvas");
    container.appendChild(canvas2d);
    canvas2d.width = window.innerWidth;
    canvas2d.height = window.innerHeight;
    this.ctx = canvas2d.getContext("2d");
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 1;
  }
}
