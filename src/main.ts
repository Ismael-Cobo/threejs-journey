import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

// MeshPhongMaterial
const material = new THREE.MeshPhongMaterial();

const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const planaGeometry = new THREE.PlaneGeometry(1, 1);
const torusGeometrey = new THREE.TorusGeometry(0.3, 0.2, 16, 32);

const sphere = new THREE.Mesh(sphereGeometry, material);
const plan = new THREE.Mesh(planaGeometry, material);
const torus = new THREE.Mesh(torusGeometrey, material);

sphere.position.x = -1.5;
torus.position.x = 1.5;

scene.add(sphere, plan, torus);
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
