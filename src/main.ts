import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// Canvas
const canvas: HTMLElement = document.querySelector("canvas.webgl")!;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Scene
const scene = new THREE.Scene();

/**
 * Particles
 */
const textureLoader = new THREE.TextureLoader();

const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;
// *3 because is formed by x, y and z
const position = new Float32Array(count * 3);
// *3 because is formed by rgb
const colors = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
    position[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}

const positionAttribute = new THREE.BufferAttribute(position, 3);
particlesGeometry.setAttribute("position", positionAttribute);
particlesGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

const particleTexture = textureLoader.load("./textures/particles/2.png");
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    // color: "#ff88cc",
    alphaMap: particleTexture,
    transparent: true,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 8;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Animate
 */
const timer = new THREE.Timer();
console.log();
const tick = () => {
    // Timer
    timer.update();
    const elapsedTime = timer.getElapsed();

    // update particles
    for (let i = 0; i < count; i++) {
        const x = particles.geometry.attributes.position.getX(i);
        particles.geometry.attributes.position.setY(i, Math.sin(x + elapsedTime));
    }

    particles.geometry.attributes.position.needsUpdate = true;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    requestAnimationFrame(tick);
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

tick();
