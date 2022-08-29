import { World } from "../World";
import * as THREE from "three";
import data from "../data.json";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export class Resources {
  constructor() {
    this.world = new World();
    const { assets } = data;
    this.numAssets = assets.length;
    this.assetsLoaded = 0;

    this.textures = {};
    this.models = {};
    this.cubeTextures = {};

    this.setLoaders();
  }

  setLoaders() {
    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const modelLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("draco/");
    modelLoader.setDRACOLoader(dracoLoader);

    this.loaders = {
      texture: textureLoader,
      model: modelLoader,
      cubeTexture: cubeTextureLoader,
    };
  }

  async load() {
    return new Promise((resolve) => {
      const { assets } = data;
      assets.map(({ type, name, src }) => {
        if (type === "texture") {
          this.loaders.texture.load(src, (texture) => {
            this.textures[name] = texture;
            this.assetsLoaded += 1;
            if (this.assetsLoaded === this.numAssets) {
              resolve();
            }
          });
        } else if (type === "cubeTexture") {
          this.loaders.cubeTexture.load(
            [
              `${src}/px.jpg`,
              `${src}/nx.jpg`,
              `${src}/py.jpg`,
              `${src}/ny.jpg`,
              `${src}/pz.jpg`,
              `${src}/nz.jpg`,
            ],
            (cubeTexture) => {
              cubeTexture.encoding = THREE.sRGBEncoding;
              this.cubeTextures[name] = cubeTexture;
              this.assetsLoaded += 1;
              if (this.assetsLoaded === this.numAssets) {
                resolve();
              }
            }
          );
        } else {
          this.loaders.model.load(src, ({ scene }) => {
            this.models[name] = scene;
            this.assetsLoaded += 1;
            if (this.assetsLoaded === this.numAssets) {
              resolve();
            }
          });
        }
      });
    });
  }
}
