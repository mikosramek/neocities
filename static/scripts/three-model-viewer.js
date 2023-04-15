import * as THREE from "https://cdn.skypack.dev/three@0.128.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js";
// import { RoomEnvironment } from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/environments/RoomEnvironment.js";

// import { RGBELoader } from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/RGBELoader.js";

const loader = new GLTFLoader();

const getSize = () => {
  const width = window.innerWidth * 0.95 > 500 ? 500 : window.innerWidth * 0.95;
  const height = width;
  return {
    width,
    height,
  };
};

const createModelViewer = (container, modelUrl) => {
  const { width, height } = getSize();

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // const neutralEnvironment = pmremGenerator.fromScene(
  //   new RoomEnvironment()
  // ).texture;

  // new RGBELoader()
  //   .setPath("https://threejs.org/examples/textures/equirectangular/")
  //   .load("royal_esplanade_1k.hdr", function (texture) {
  //     var envMap = pmremGenerator.fromEquirectangular(texture).texture;
  //     scene.background = envMap;
  //     scene.environment = envMap;
  //     texture.dispose();
  //     pmremGenerator.dispose();
  //   });

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.z = 0;
  camera.position.y = 7;
  camera.position.x = -11;
  controls.update();

  // scene.environment = neutralEnvironment;

  scene.add(new THREE.AmbientLight(0x777777, 0.4));
  scene.add(new THREE.AmbientLight(0xffffff, 1.5));

  const lights = [{ x: -15, y: -2, z: 6, intensity: 0.2 }];

  lights.forEach(({ x, y, z, color = 0xffffff, intensity = 1 }) => {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    scene.add(light);
    // scene.add(new THREE.DirectionalLightHelper(light, 5));
  });

  function updateCanvas() {
    const { width, height } = getSize();
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", updateCanvas);

  const modelLoaded = (gltf) => {
    const model = gltf.scene;

    const scale = 20;
    model.position.y = 0.2 - 4;
    model.scale.set(scale, scale, scale);

    scene.add(model);
  };

  const handleModeLoading = (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  };

  loader.load(modelUrl, modelLoaded, handleModeLoading, console.error);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
};

document.addEventListener("DOMContentLoaded", () => {
  const modelDivs = document.querySelectorAll("[data-model-url]");

  modelDivs.forEach((div) => {
    const url = div.dataset.modelUrl;
    div.parentElement
      .querySelector(".Slice__model-button")
      .addEventListener("click", function () {
        createModelViewer(div, url);
        this.parentElement.classList.add("hidden");
      });
  });
});
