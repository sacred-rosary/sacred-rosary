// js/rosary3d.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
const beads = [];
const originalMaterials = new Map();
let highlightMaterial;

// This map defines the index for each bead in our 3D model.
// We will use this in app.js to link prayers to beads.
export const beadMap = {
    signOfCross: 0,
    apostlesCreed: 1,
    openingOurFather: 2,
    openingHailMary1: 3,
    openingHailMary2: 4,
    openingHailMary3: 5,
    openingGloryBe: 6,
    decade1: { ourFather: 7, hailMarys: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], gloryBeAndFatima: 18 },
    decade2: { ourFather: 19, hailMarys: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], gloryBeAndFatima: 30 },
    decade3: { ourFather: 31, hailMarys: [32, 33, 34, 35, 36, 37, 38, 39, 40, 41], gloryBeAndFatima: 42 },
    decade4: { ourFather: 43, hailMarys: [44, 45, 46, 47, 48, 49, 50, 51, 52, 53], gloryBeAndFatima: 54 },
    decade5: { ourFather: 55, hailMarys: [56, 57, 58, 59, 60, 61, 62, 63, 64, 65], gloryBeAndFatima: 66 }
};

// --- Public Functions (called from app.js) ---

export function init3D() {
    setupScene();
    if (scene) {
        createRosary();
        animate();
    }
}

export function highlightBead(index = -1) {
    // Reset all beads first
    beads.forEach(bead => {
        if (originalMaterials.has(bead)) {
            bead.material = originalMaterials.get(bead);
        }
    });

    if (index >= 0 && beads[index]) {
        beads[index].material = highlightMaterial;
    }
}

export function zoom(type) {
    controls.autoRotate = false;
    const duration = 2.0;
    if (type === 'out') {
        gsap.to(camera.position, { x: 0, y: 0, z: 25, duration: duration, onComplete: () => { controls.autoRotate = true; } });
    } else if (type === 'in') {
        gsap.to(camera.position, { x: 0, y: 0, z: 15, duration: duration, onComplete: () => { controls.autoRotate = true; } });
    }
}


// --- Internal 3D Setup ---

function setupScene() {
    const container = document.querySelector('.model-section');
    if (!container) return;

    scene = new THREE.Scene();
    scene.background = null; // Transparent background

    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 25);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 8);
    scene.add(dirLight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enablePan = false;
    controls.minDistance = 10;
    controls.maxDistance = 40;

    highlightMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xcc9900,
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 2
    });

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

function createRosary() {
    const beadTextureLoader = new THREE.TextureLoader();
    const pearlTexture = beadTextureLoader.load('https://i.imgur.com/S5nR1gG.jpg'); // A simple pearl texture
    const beadMaterial = new THREE.MeshStandardMaterial({ map: pearlTexture, metalness: 0.2, roughness: 0.1, envMapIntensity: 1 });
    
    const woodTexture = beadTextureLoader.load('https://i.imgur.com/M8a3t0N.jpg'); // A simple wood texture
    const largeBeadMaterial = new THREE.MeshStandardMaterial({ map: woodTexture, metalness: 0.1, roughness: 0.7 });

    const beadGeo = new THREE.SphereGeometry(0.35, 32, 16);
    const largeBeadGeo = new THREE.SphereGeometry(0.5, 32, 16);

    // Stem
    addBead(createCross(), largeBeadMaterial, 0, -9.5, 0);       // 0
    addBead(largeBeadGeo, largeBeadMaterial, 0, -7.0, 0);     // 1
    addBead(largeBeadGeo, largeBeadMaterial, 0, -5.5, 0);     // 2
    for (let i = 0; i < 3; i++) {
        addBead(beadGeo, beadMaterial, 0, -4 + i * 1.1, 0); // 3, 4, 5
    }
    addBead(largeBeadGeo, largeBeadMaterial, 0, -0.5, 0);     // 6

    // Decades Loop
    const radius = 6;
    const totalPoints = 60; // 5 decades * (10 Hail Marys + 1 Our Father + 1 Glory Be placeholder)
    for (let i = 0; i < totalPoints; i++) {
        const angle = (Math.PI * 2 / totalPoints) * i + Math.PI / 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle) + 4;

        if (i % 12 === 0) { // Our Father
            addBead(largeBeadGeo, largeBeadMaterial, x, y, 0);
        } else if (i % 12 === 11) { // Glory Be
             addBead(largeBeadGeo, largeBeadMaterial, x, y, 0);
        }
        else { // Hail Mary
            addBead(beadGeo, beadMaterial, x, y, 0);
        }
    }
}

function addBead(geometry, material, x, y, z) {
    let bead;
    if (geometry.type === 'Group') { // For the cross
        bead = geometry;
    } else {
        bead = new THREE.Mesh(geometry, material.clone());
    }
    bead.position.set(x, y, z);
    scene.add(bead);
    beads.push(bead);
    originalMaterials.set(bead, material.clone());
}

function createCross() {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x9c6e49, metalness: 0.4, roughness: 0.5 });
    const vert = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.5, 0.2), mat);
    const horiz = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.2), mat);
    horiz.position.y = 0.5;
    group.add(vert, horiz);
    return group;
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
