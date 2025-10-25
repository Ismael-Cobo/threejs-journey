import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

const gui = new GUI({ width: 400 });

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
 * Galaxy
 */

const parameters = {
    count: 80000,
    size: 0.01,
    radius: 5,
    branches: 4,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3, // ⭐ Valor óptimo
    insideColor: "#ff6030", // Naranja centro
    outsideColor: "#1b3984", // Azul bordes
};

gui.add(parameters, "count")
    .min(100)
    .max(1000000)
    .step(100)
    .onFinishChange(() => generateGalaxy());
gui.add(parameters, "size")
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .onFinishChange(() => generateGalaxy());
gui.add(parameters, "radius")
    .min(0.01)
    .max(20)
    .step(0.1)
    .onFinishChange(() => generateGalaxy());
gui.add(parameters, "branches")
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(() => generateGalaxy());
gui.add(parameters, "spin")
    .min(-5)
    .max(5)
    .step(0.001)
    .onFinishChange(() => generateGalaxy());
gui.add(parameters, "randomness")
    .min(0)
    .max(2)
    .step(0.001)
    .onFinishChange(() => generateGalaxy());
gui.add(parameters, "randomnessPower")
    .min(1)
    .max(10)
    .step(0.001)
    .onFinishChange(() => generateGalaxy());
gui.addColor(parameters, "insideColor").onFinishChange(() => generateGalaxy());
gui.addColor(parameters, "outsideColor").onFinishChange(() => generateGalaxy());

let geometry: THREE.BufferGeometry | null = null;
let material: THREE.PointsMaterial | null = null;
let galaxy: THREE.Points | null = null;

const generateGalaxy = () => {
    if (!!galaxy) {
        geometry?.dispose();
        material?.dispose();
        scene.remove(galaxy);
    }

    geometry = new THREE.BufferGeometry();
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });
    galaxy = new THREE.Points(geometry, material);

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);
    for (let i = 0; i < parameters.count; i++) {
        // Position
        const i3 = i * 3;

        const radius = Math.random() * parameters.radius;

        const spinAngle = radius * parameters.spin;
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        const randomX =
            Math.pow(Math.random(), parameters.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            parameters.randomness *
            radius;
        const randomY =
            Math.pow(Math.random(), parameters.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            parameters.randomness *
            radius;
        const randomZ =
            Math.pow(Math.random(), parameters.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            parameters.randomness *
            radius;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    scene.add(galaxy);
};

generateGalaxy();

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
const tick = () => {
    // Timer
    timer.update();
    const elapsedTime = timer.getElapsed();

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
