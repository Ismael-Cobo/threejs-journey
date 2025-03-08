import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/Addons.js";

/**
 * Debug
 **/
const gui = new GUI();

/**
 * Base
 */
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorAlphaSrc = "/textures/door/alpha.jpg";
const doorAmbientOcclusionSrc = "/textures/door/ambientOcclusion.jpg";
const doorColorSrc = "/textures/door/color.jpg";
const doorHeightSrc = "/textures/door/height.jpg";
const doorMetalnessSrc = "/textures/door/metalness.jpg";
const doorNormalSrc = "/textures/door/normal.jpg";
const doorRoughnessSrc = "/textures/door/roughness.jpg";
const matCapSrc = "textures/matcaps/1.png";
const gradient3Src = "/textures/gradients/3.jpg";

const doorAlpha = textureLoader.load(doorAlphaSrc);
const doorAmbientOcclusion = textureLoader.load(doorAmbientOcclusionSrc);
const doorColor = textureLoader.load(doorColorSrc);
const doorHeight = textureLoader.load(doorHeightSrc);
const doorMetalness = textureLoader.load(doorMetalnessSrc);
const doorNormal = textureLoader.load(doorNormalSrc);
const doorRoughness = textureLoader.load(doorRoughnessSrc);
const matcap = textureLoader.load(matCapSrc);
const gradient3 = textureLoader.load(gradient3Src);

doorColor.colorSpace = THREE.SRGBColorSpace;
matcap.colorSpace = THREE.SRGBColorSpace;

/**
 * Objects
 * Sphere, plane abd torus
 */
// // MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColor;
// material.color = new THREE.Color("#ff0000");
// // material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.5;
// // material.alphaMap = doorAlpha;
// material.side = THREE.DoubleSide;

// // MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// // MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcap;

// // MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial();

// // MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial();
// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

// // MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);

// // MeshToonMaterial
// const material = new THREE.MeshToonMaterial();
// gradient3.minFilter = THREE.NearestFilter;
// gradient3.magFilter = THREE.NearestFilter;
// material.gradientMap = gradient3;

// // // MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial();
// // material.metalness = 0.7;
// // material.roughness = 0.2;
// material.map = doorColor;
// material.aoMap = doorAmbientOcclusion;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeight;
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalness;
// material.roughnessMap = doorRoughness;
// material.normalMap = doorNormal;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlpha;

// gui.add(material, "metalness").min(0).max(1).step(0.01);
// gui.add(material, "roughness").min(0).max(1).step(0.01);

// // MeshPhysicalMaterial
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
// material.map = doorColor;
// material.aoMap = doorAmbientOcclusion;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeight;
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalness;
// material.roughnessMap = doorRoughness;
// material.normalMap = doorNormal;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlpha;

gui.add(material, "metalness").min(0).max(1).step(0.01);
gui.add(material, "roughness").min(0).max(1).step(0.01);

// // clearcoat
// material.clearcoat = 1;
// material.clearcoatRoughness = 1;

// gui.add(material, "clearcoat").min(0).max(1).step(0.01);
// gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.01);

// // Sheen
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1, 1, 1);

// gui.add(material, "sheen").min(0).max(1).step(0.01);
// gui.add(material, "sheenRoughness").min(0).max(1).step(0.01);
// gui.addColor(material, "sheenColor");

// // Iridescence
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];

// gui.add(material, "iridescence").min(0).max(1).step(0.001);
// gui.add(material, "iridescenceIOR").min(1).max(2.333).step(0.001);

// Transmission
material.transmission = 1;
material.ior = 2.418;
material.thickness = 0.5;

gui.add(material, "transmission").min(0).max(1).step(0.001);
gui.add(material, "ior").min(0).max(10).step(0.001);
gui.add(material, "thickness").min(0).max(1).step(0.001);

const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64);
const planaGeometry = new THREE.PlaneGeometry(1, 1, 100, 100);
const torusGeometrey = new THREE.TorusGeometry(0.3, 0.2, 64, 128);

const sphere = new THREE.Mesh(sphereGeometry, material);
const plan = new THREE.Mesh(planaGeometry, material);
const torus = new THREE.Mesh(torusGeometrey, material);

sphere.position.x = -1.5;
torus.position.x = 1.5;

scene.add(sphere, plan, torus);

/**
 *
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

/**
 * Enviroment map
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (enviromentMap) => {
    enviromentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = enviromentMap;
    scene.environment = enviromentMap;
});

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    sphere.rotation.y = elapsedTime * 0.1;
    plan.rotation.y = elapsedTime * 0.1;
    torus.rotation.y = elapsedTime * 0.1;

    sphere.rotation.x = elapsedTime * -0.15;
    plan.rotation.x = elapsedTime * -0.15;
    torus.rotation.x = elapsedTime * -0.15;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
