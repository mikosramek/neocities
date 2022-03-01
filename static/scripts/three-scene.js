import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

const textureLoader = new THREE.TextureLoader();

const clock = new THREE.Clock();
const loader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

function updateCanvas() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}


// walls
textureLoader.load('./images/stone_wall.jpg', (texture) => {
  const material = new THREE.MeshStandardMaterial({
    map: texture
  });
  const wallGeometry = new THREE.BoxGeometry(35, 25, 25);

  material.side = THREE.BackSide;
  const walls = new THREE.Mesh(wallGeometry, material);
  walls.position.z = 5;

  scene.add(walls);
}, undefined, console.error);

// floor
textureLoader.load('./images/cobblestone.jpg', (texture) => {

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  const cubeGeometry = new THREE.BoxGeometry(35, 0.1, 25);
  const material = new THREE.MeshStandardMaterial({ map: texture });

  const cube = new THREE.Mesh(cubeGeometry, material);

  cube.position.y = -0.18;
  cube.position.z = 5;
  scene.add(cube);
}, undefined, console.error);

// scene.add(new THREE.AxesHelper( 20 ));

camera.position.z = 7;
camera.position.y = -1;
camera.position.x = -3;
controls.update();

scene.add(new THREE.AmbientLight(0x777777, 0.4));

const light1 = new THREE.DirectionalLight(0xaaaaaa, 0.6);
light1.position.set(0, 10, 10);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xaaaaaa, 0.3);
light2.position.set(0, -15, -4);
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xffffff, 0.3);
light3.position.set(0, 10, 0);
scene.add(light3);

// scene.add(new THREE.DirectionalLightHelper(light1, 5));
// scene.add(new THREE.DirectionalLightHelper(light2, 5));

let outerGate = null;
let innerGate = null;

const modelLoaded = (gltf) => {
  console.log('Loaded!');
  const gate = gltf.scene;
  gate.position.y = -2;

  outerGate = new THREE.Scene();
  outerGate.add(gate.children[0]);
  outerGate.add(gate.children[0]);

  innerGate = new THREE.Scene();
  innerGate.add(gate.children[0]);
  innerGate.add(gate.children[0]);
  innerGate.add(gate.children[0]);
  innerGate.add(gate.children[0]);

  outerGate.add(gate.children[0]);

  scene.add(innerGate);
  scene.add(outerGate);
}
const handleModeLoading = (xhr) => {
  console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded');
}

loader.load('./models/ring.gltf', modelLoaded, handleModeLoading, console.error);

let gateSpeed = 1;

function animate() {
  requestAnimationFrame(animate);

  if (innerGate) {
    clock.getDelta();
    innerGate.rotation.y += ((Math.PI * 2) / 360) * gateSpeed;
    innerGate.position.y = Math.sin(Math.PI * 2 * clock.elapsedTime / 5) * 0.05;
  }

  renderer.render(scene, camera);
}

scene.position.y = -1.5;

document.querySelectorAll('.Landing__nav-item').forEach(function(item) {
  const link = item.children[0];
  link.addEventListener('mouseenter', function() {
    gateSpeed = 2;
  });
  link.addEventListener('mouseleave', function() {
    gateSpeed = 1;
  });
});

window.onresize = updateCanvas;

animate();