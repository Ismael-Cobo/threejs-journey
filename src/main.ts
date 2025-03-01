import gsap from "gsap";
import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// Camera
const sizes = {
    width: 400,
    height: 300,
};
// FOV, Aspect Ratio
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

// Clock
const clock = new THREE.Clock();
gsap.to(mesh.position, { duration: 1, x: 2, delay: 1 });
gsap.to(mesh.position, { duration: 1, x: 0, delay: 2 });

// Animations
const tick = () => {
    // const ellapsedTime = clock.getElapsedTime();

    // Update
    // mesh.position.y = Math.cos(ellapsedTime);
    // mesh.position.x = Math.sin(ellapsedTime);
    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();
