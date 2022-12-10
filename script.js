import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
const scene = new THREE.Scene();

const loader = new GLTFLoader();
const fileName = './cybertruck/scene.gltf';
let model;

// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

loader.load(fileName, function(gltf) {
  model = gltf.scene;
  model.traverse( function( node ) {
    if ( node.isMesh ) { node.castShadow = true; }
  });
  model.castShadow = true;
  scene.add(model);
  addLight();
  addGround();
  adjustModelAndCamera();
  scene.add(camera);
  renderer.render(scene, camera);
  animate();
}, undefined, function(e) {
  console.error(e);
});

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;

function addLight() {
  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(-5, 2 ,5);
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.castShadow = true;
  scene.add(light);

  //Orange light
  const light2 = new THREE.DirectionalLight(0xffa500, 2);
  light2.position.set(5, 2, -5);
  light2.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light2.castShadow = true;
  scene.add(light2);
}

function addGround() {
  const ground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: 0xffffff})
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.5;
  ground.receiveShadow = true;
  scene.add(ground);
}

function adjustModelAndCamera() {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  model.position.x += (model.position.x - center.x);
  model.position.y += (model.position.y - center.y);
  model.position.z += (model.position.z - center.z);

  camera.near = size / 100;
  camera.far = size * 100;
  camera.updateProjectionMatrix();

  camera.position.copy(center);
  camera.position.x += 0.5
  camera.position.y += 0.5
  camera.position.z += 1
  camera.lookAt(center);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

