import {
  Scene,
  PerspectiveCamera,
  Vector3,
  WebGLRenderer,
  sRGBEncoding,
  ReinhardToneMapping,
  PCFSoftShadowMap,
  Vector2,
  Raycaster,
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
  Object3D,
} from "three";
import { FolderApi, Pane } from "tweakpane";
import {
  Parallax,
  Markers,
  CustomizeViewManager,
  AssemblyViewManager,
  TireCustomization,
  Resources,
  Model,
  BreakCustomization,
  RimCustomization,
} from "./components";

enum View {
  assembly = "assembly",
  customize = "customize",
}

export class World {
  static instance: World;
  time = 0;
  container: HTMLDivElement;
  width: number;
  height: number;
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  mouse = new Vector2();
  pane = new Pane();
  debug: FolderApi;
  raycaster = new Raycaster();
  resources: any;
  model: any;
  parallax: any;
  markers: any;
  tireCustomization: any;
  breakCustomization: any;
  rimCustomization: any;
  viewManagers: {
    assembly: any;
    customize: any;
  };
  view: any;
  ambient: AmbientLight;
  dirLight: DirectionalLight;
  dirLightHelper: DirectionalLightHelper;
  constructor() {
    if (World.instance) {
      return World.instance;
    }
    World.instance = this;

    this.init();
  }

  async init() {
    this.container = document.querySelector("#canvas")!;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.scene = new Scene();
    this.setCamera();
    this.setRenderer();
    this.debug = this.pane.addFolder({ title: "debug" });
    this.resources = new Resources();
    await this.resources.load();
    this.model = new Model();
    this.parallax = new Parallax();
    this.setLights();
    this.debugCamera();
    this.markers = new Markers();
    this.tireCustomization = new TireCustomization();
    this.breakCustomization = new BreakCustomization();
    this.rimCustomization = new RimCustomization();
    this.viewManagers = {
      assembly: new AssemblyViewManager(),
      customize: new CustomizeViewManager(),
    };
    this.setInitialView();
    this.resize();
    this.addListerners();
    this.render();
  }

  setCamera() {
    this.camera = new PerspectiveCamera(65, this.width / this.height, 0.1, 200);
    this.camera.userData.initialPosition = new Vector3(3.3, 0.4, 0);
    this.camera.position.set(
      this.camera.userData.initialPosition.x,
      this.camera.userData.initialPosition.y,
      this.camera.userData.initialPosition.z
    );
    this.camera.userData.initialRotation = new Vector3(-1, 1.5, 1);
    this.camera.rotation.set(
      this.camera.userData.initialRotation.x,
      this.camera.userData.initialRotation.y,
      this.camera.userData.initialRotation.z
    );
  }

  setRenderer() {
    this.renderer = new WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.toneMapping = ReinhardToneMapping;
    this.renderer.toneMappingExposure = 3;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
  }

  setInitialView() {
    const { pathname, hash } = window.location;
    if (pathname === "/customize") {
      const targetObject =
        hash === "#tire" || hash === "#rim" || hash === "#break"
          ? hash.split("").slice(1).join("")
          : "tire";
      this.changeView(View.customize, targetObject);
    } else {
      this.changeView(View.assembly);
    }
  }

  changeView(destination: View, args?: any) {
    const url =
      destination === View.customize ? `${destination}#${args}` : destination;
    window.history.pushState({}, "", url);
    this.view && this.view.hide();
    this.view = this.viewManagers[destination];
    this.view.show(args);
  }

  ndcToScreen(x: number, y: number) {
    const screenX = (window.innerWidth * (x + 1)) / 2;
    const screenY = (window.innerHeight * (-y + 1)) / 2;
    return [screenX, screenY];
  }

  addListerners() {
    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener("pointermove", this.onPointermove.bind(this));
    window.addEventListener("pointerdown", this.onPointerdown.bind(this));
    window.addEventListener("pointerup", this.onPointerup.bind(this));
  }

  mouseNDC(x: number, y: number) {
    this.mouse.x = (2 * x) / window.innerWidth - 1;
    this.mouse.y = (-2 * y) / window.innerHeight + 1;
  }

  onPointerdown() {}

  onPointerup() {
    this.view.onPointerup();
  }

  onPointermove({ clientX, clientY }: PointerEvent) {
    this.mouseNDC(clientX, clientY);
    this.parallax.onPointermove();

    this.view.onPointermove();
  }

  debugCamera() {
    this.debug.addButton({ title: "print camera state" }).on("click", () => {
      console.log(...this.camera.position.toArray());
      console.log(...this.camera.rotation.toArray());
    });
  }

  setLights() {
    this.ambient = new AmbientLight();
    this.ambient.intensity = 0;
    this.scene.add(this.ambient);
    this.dirLight = new DirectionalLight();
    this.dirLight.intensity = 0;
    this.dirLight.castShadow = true;
    // this.dirLight.shadow.normalBias = 0.05;
    this.dirLightHelper = new DirectionalLightHelper(this.dirLight);
    // this.scene.add(this.dirLightHelper);
    this.scene.add(this.dirLight);
    this.dirLight.position.set(1, 2, 2);
    const target = new Object3D();
    this.scene.add(target);
    this.dirLight.target = target;
    this.dirLightHelper.update();
    window.setTimeout(() => {
      this.dirLightHelper.update();
    }, 1000);

    const lightDebug = this.debug.addFolder({
      title: "lights",
      expanded: false,
    });
    const ambientDebug = lightDebug.addFolder({ title: "ambient" });
    ambientDebug.addInput(this.ambient, "intensity", {
      min: 0,
      max: 5,
      step: 0.001,
      label: "intensity",
    });
    const dirLightDebug = lightDebug.addFolder({ title: "dirLight" });
    dirLightDebug.addInput(this.dirLight, "intensity", {
      min: 0,
      max: 5,
      step: 0.001,
      label: "intensity",
    });
    const dirLightPositionDebug = dirLightDebug.addFolder({
      title: "position",
    });
    dirLightPositionDebug.addInput(this.dirLight.position, "x", {
      min: -10,
      max: 10,
      step: 0.001,
    });
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();

    this.view.onResize();
  }

  update() {
    this.parallax.update();
    this.view.update();
  }

  render() {
    this.time += 0.01633;
    this.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}
