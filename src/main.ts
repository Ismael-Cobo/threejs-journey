import gsap from "gsap";
import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * Debug
 */
const gui = new GUI();
const debugObject: any = {};
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
// Scene
const scene = new THREE.Scene();

// Object
debugObject.color = "#3a6ea6";
debugObject.subdevision = 2;
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, debugObject.subdevision, debugObject.subdevision, debugObject.subdevision),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false })
);
scene.add(mesh);
gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
gui.add(mesh.material, "wireframe").name("wireframe");
gui.addColor(debugObject, "color")
    .name("color")
    .onChange(() => {
        mesh.material.color.set(debugObject.color);
    });
debugObject.spin = () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
};

gui.add(debugObject, "spin");
gui.add(debugObject, "subdevision")
    .min(1)
    .max(50)
    .step(1)
    .name("subdevision")
    .onFinishChange((value: number) => {
        mesh.geometry.dispose();
        mesh.geometry = new THREE.BoxGeometry(1, 1, 1, value, value, value);
    });

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
