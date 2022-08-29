import { World } from "../World";
import * as THREE from "three";
import data from "../data.json";

export class Model {
  constructor() {
    this.world = new World();
    this.resources = this.world.resources;
    this.model = this.resources.models.wheel;
    this.textures = this.resources.textures;
    this.textures.carbonFibre.wrapS = THREE.RepeatWrapping;
    this.textures.carbonFibre.wrapT = THREE.RepeatWrapping;
    this.cubeTextures = this.resources.cubeTextures;
    this.structure = data.modelStructure;

    this.wheel = {
      tire: {
        model1: this.model.children.find(({ name }) => name === "tire_1"),
        model2: this.model.children.find(({ name }) => name === "tire_2"),
      },
    };

    this.materials = {};
    this.setMaterials();

    this.parent = new THREE.Group();

    this.setTire();

    this.setBreak();

    this.setRim();
  }

  setMaterials() {
    this.setTireMaterials();
    this.setRimMaterials();
    this.setBreakMaterials();
  }

  setTireMaterials() {
    this.materials.tire = {};
    this.materials.tire.banner = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      envMap: this.cubeTextures.envMap1,
      envMapIntensity: 3,
      metalness: 0,
      roughness: 0.5,
      map: this.textures.tireBanner,
      transparent: true,
    });
    this.materials.tire.body = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      envMap: this.cubeTextures.envMap1,
      envMapIntensity: 3,
      metalness: 0,
      roughness: 0.3,
      color: new THREE.Color(0x000000),
    });
  }

  setRimMaterials() {
    this.materials.rim = {};
    this.materials.rim.spokes = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      envMap: this.cubeTextures.envMap1,
      envMapIntensity: 3,
      metalness: 0.8,
      roughness: 0.2,
      color: new THREE.Color(0x00ff00),
    });
    this.materials.rim.bore = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      envMap: this.cubeTextures.envMap1,
      envMapIntensity: 3,
      metalness: 0.8,
      roughness: 0.2,
      color: new THREE.Color(0xffffff),
    });
    this.materials.rim.screw = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      envMap: this.cubeTextures.envMap1,
      envMapIntensity: 3,
      metalness: 0.2,
      roughness: 0.6,
      color: new THREE.Color(0xffffff),
    });
    this.materials.rim.carbonFibre = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      envMap: this.cubeTextures.envMap1,
      envMapIntensity: 3,
      metalness: 0.8,
      roughness: 0.2,
      map: this.textures.carbonFibre,
    });
    this.materials.rim.barrel = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      envMap: this.cubeTextures.envMap1,
      envMapIntensity: 3,
      metalness: 0.8,
      roughness: 0.2,
      color: new THREE.Color(0x0000ff),
    });
  }

  setBreakMaterials() {
    this.materials.break = {};
    this.materials.break.body = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      envMap: this.cubeTextures.envMap1,
      envMapIntensity: 3,
      metalness: 0.8,
      roughness: 0.2,
      color: new THREE.Color(0x00ff00),
    });
    this.materials.break.fasteners = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      envMap: this.cubeTextures.envMap1,
      envMapIntensity: 3,
      metalness: 0.3,
      roughness: 0.8,
      color: new THREE.Color(0x6f6f6f),
    });
    this.materials.break.fasteningRod = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      envMap: this.cubeTextures.envMap1,
      envMapIntensity: 3,
      metalness: 0.8,
      roughness: 0.2,
      color: new THREE.Color(0x0000ff),
    });
    this.materials.break.plates = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      envMap: this.cubeTextures.envMap1,
      envMapIntensity: 3,
      metalness: 1,
      roughness: 0.2,
      color: new THREE.Color(0xffffff),
    });
    this.materials.break.centrePlate = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      envMap: this.cubeTextures.envMap1,
      envMapIntensity: 3,
      metalness: 0,
      roughness: 0.7,
      color: new THREE.Color(0x0b0b0b),
    });
  }

  setTire() {
    this.tire = new THREE.Group();
    this.tire.name = "tire";
    this.parent.add(this.tire);

    const model1 = this.model.children.find(({ name }) => name === "tire_1");
    this.nameGroupDescendants(model1, "tire");
    model1.children[0].material = this.materials.tire.banner;
    model1.children[1].material = this.materials.tire.body;

    const model2 = this.model.children.find(({ name }) => name === "tire_2");
    this.nameGroupDescendants(model2, "tire");
    model2.children[0].material = this.materials.tire.body;
    model2.children[1].material = this.materials.tire.banner;

    this.tire.add(model1);

    this.tireOptions = {
      setModel1: () => {
        this.tire.remove(model2);
        this.tire.add(model1);
      },
      setModel2: () => {
        this.tire.remove(model1);
        this.tire.add(model2);
      },
    };
  }

  nameGroupDescendants(group, name) {
    group.traverse((child) => child.isMesh && (child.name = name));
  }

  setBreak() {
    this.break = new THREE.Group();
    this.break.name = "break";
    this.parent.add(this.break);
    const breakModel = this.model.children.find(
      (child) => child.name === "break"
    );
    this.nameGroupDescendants(breakModel, "break");
    this.break.add(breakModel);

    breakModel.children[0].material = this.materials.break.body;
    breakModel.children[1].material = this.materials.break.fasteners;
    breakModel.children[2].material = this.materials.break.fasteningRod;
    breakModel.children[3].material = this.materials.break.plates;
    breakModel.children[4].material = this.materials.break.centrePlate;

    this.breakOptions = {
      color: (hexColor) => {
        this.materials.break.body.color = new THREE.Color(hexColor);
      },
    };
  }

  setRim() {
    this.rim = new THREE.Group();
    this.rim.name = "rim";
    this.parent.add(this.rim);

    const model1 = this.model.children.find(
      ({ name }) => name === "rim_spokes_1"
    );
    this.nameGroupDescendants(model1, "rim");
    model1.children[0].material = this.materials.rim.spokes;
    model1.children[1].material = this.materials.rim.bore;
    model1.children[2].material = this.materials.rim.screw;

    const model2 = this.model.children.find(
      ({ name }) => name === "rim_spokes_2"
    );
    this.nameGroupDescendants(model2, "rim");
    model2.children[0].material = this.materials.rim.screw;
    model2.children[1].material = this.materials.rim.spokes;
    model2.children[2].material = this.materials.rim.carbonFibre;
    model2.children[3].material = this.materials.break.centrePlate;

    const barrelModel1 = this.model.children.find(
      ({ name }) => name === "rim_barrel_1"
    );
    this.nameGroupDescendants(barrelModel1, "rim");
    barrelModel1.material = this.materials.rim.barrel;

    const barrelModel2 = this.model.children.find(
      ({ name }) => name === "rim_barrel_2"
    );
    this.nameGroupDescendants(barrelModel2, "rim");
    barrelModel2.material = this.materials.rim.barrel;

    this.rim.add(model1);
    this.rim.add(barrelModel1);

    this.rimOptions = {
      setModel1: () => {
        this.rim.remove(model2);
        this.rim.remove(barrelModel2);
        this.rim.add(model1);
        this.rim.add(barrelModel1);
      },
      setModel2: () => {
        this.rim.remove(model1);
        this.rim.remove(barrelModel1);
        this.rim.add(model2);
        this.rim.add(barrelModel2);
      },
      setBarrelMetal: () => {
        barrelModel1.material = this.materials.rim.barrel;
        barrelModel2.material = this.materials.rim.barrel;
      },
      setBarrelCarbonFibre: () => {
        barrelModel1.material = this.materials.rim.carbonFibre;
        barrelModel2.material = this.materials.rim.carbonFibre;
      },
      setBarrelColor: (hexColor) => {
        this.materials.rim.barrel.color = new THREE.Color(hexColor);
      },
    };
  }
}
