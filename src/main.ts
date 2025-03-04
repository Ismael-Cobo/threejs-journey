import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const imageSource = "/textures/door/color.jpg";

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load(imageSource);
texture.colorSpace = THREE.SRGBColorSpace;
// loadingManager.onProgress = (...rest) => {
//     console.log("On Progress", rest);
// };
// loadingManager.onLoad = () => {
//     console.log("On Load");
// };
// centrar la textura al cenmtro para poder rotarla desde el centro
// y no desde la esquina
// texture.center.x = 0.5;
// texture.center.y = 0.5;
// // rotar 45 grados
// texture.rotation = Math.PI / 4;

/**
 * Base
 */
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false, map: texture })
);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 2;
camera.lookAt(mesh.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const tick = () => {
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update aspect ratio
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
