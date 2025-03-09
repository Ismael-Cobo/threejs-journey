import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

// // Axis helper
// const axisHelper = new THREE.AxesHelper();
// scene.add(axisHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTextureSrc = "/textures/matcaps/4.png";

const matcapTexture = textureLoader.load(matcapTextureSrc);
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Fonts
 */

const fontLoader = new FontLoader();
fontLoader.load(
    "/fonts/helvetiker_regular.typeface.json",
    (font) => {
        const textGeometry = new TextGeometry("Hello three.js!", {
            font,
            size: 0.5,
            depth: 0.2,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4,
        });
        // textGeometry.computeBoundingBox();
        // textGeometry.translate(
        //     -((textGeometry.boundingBox?.max.x || 0) - 0.02) * 0.5,
        //     -((textGeometry.boundingBox?.max.y || 0) - 0.02) * 0.5,
        //     -((textGeometry.boundingBox?.max.z || 0) - 0.03) * 0.5
        // );
        textGeometry.center();
        const textMaterial = new THREE.MeshBasicMaterial({ map: matcapTexture });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(text);

        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
        const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
        for (let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(donutGeometry, donutMaterial);
            donut.position.x = (Math.random() - 0.5) * 10;
            donut.position.y = (Math.random() - 0.5) * 10;
            donut.position.z = (Math.random() - 0.5) * 10;

            donut.rotation.x = Math.random() * Math.PI;
            donut.rotation.y = Math.random() * Math.PI;

            const scale = Math.random();
            donut.scale.set(scale, scale, scale);

            scene.add(donut);
        }
    },
    () => {},
    () => {
        console.log("error");
    }
);

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

const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
