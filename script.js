import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const container = document.getElementById('scene-container');

// --------------------
// СЦЕНА
// --------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(0, 0, 12.5);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --------------------
// СВЕТ
// --------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight1.position.set(7, 8, 10);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xaabfff, 0.45);
dirLight2.position.set(-7, -4, 7);
scene.add(dirLight2);

const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
pointLight.position.set(0, 0, 8);
scene.add(pointLight);

// --------------------
// ГЛАВНАЯ ГРУППА
// --------------------
const mainGroup = new THREE.Group();
scene.add(mainGroup);

const cubeCornersGroup = new THREE.Group();
const letterTGroup = new THREE.Group();

mainGroup.add(cubeCornersGroup);
mainGroup.add(letterTGroup);

// --------------------
// МАТЕРИАЛЫ
// --------------------
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xd8d8d8,
    metalness: 0.7,
    roughness: 0.28,
    emissive: 0x0f0f0f
});

const tMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.55,
    roughness: 0.22,
    emissive: 0x111111
});

// --------------------
// УГОЛ КУБА = 3 ТОНКИЕ ЛИНИИ
// --------------------
function createCorner(signX, signY, signZ, cubeHalfSize, armLength, thickness) {
    const group = new THREE.Group();

    const px = signX * cubeHalfSize;
    const py = signY * cubeHalfSize;
    const pz = signZ * cubeHalfSize;

    const xPart = new THREE.Mesh(
        new THREE.BoxGeometry(armLength, thickness, thickness),
        cubeMaterial
    );
    xPart.position.set(px - signX * armLength / 2, py, pz);
    group.add(xPart);

    const yPart = new THREE.Mesh(
        new THREE.BoxGeometry(thickness, armLength, thickness),
        cubeMaterial
    );
    yPart.position.set(px, py - signY * armLength / 2, pz);
    group.add(yPart);

    const zPart = new THREE.Mesh(
        new THREE.BoxGeometry(thickness, thickness, armLength),
        cubeMaterial
    );
    zPart.position.set(px, py, pz - signZ * armLength / 2);
    group.add(zPart);

    return group;
}

// --------------------
// КУБ ИЗ 8 УГЛОВ
// УМЕНЬШЕН И СДЕЛАН ТОНЬШЕ
// --------------------
const cubeHalfSize = 3.15;
const armLength = 1.2;
const armThickness = 0.07;

const signs = [-1, 1];
for (const sx of signs) {
    for (const sy of signs) {
        for (const sz of signs) {
            cubeCornersGroup.add(
                createCorner(sx, sy, sz, cubeHalfSize, armLength, armThickness)
            );
        }
    }
}

// --------------------
// ИДЕАЛЬНАЯ ОБЪЕМНАЯ БУКВА T
// БЕЗ ВЫСТУПОВ, ИЗ ОДНОГО ЦВЕТА
// --------------------
function createCleanVolumetricT() {
    const group = new THREE.Group();

    const topWidth = 2.8;
    const topHeight = 0.5;
    const stemWidth = 0.55;
    const stemHeight = 3.2;
    const depth = 0.55;

    const topBar = new THREE.Mesh(
        new THREE.BoxGeometry(topWidth, topHeight, depth),
        tMaterial
    );
    topBar.position.set(0, 1.05, 0);
    group.add(topBar);

    const stem = new THREE.Mesh(
        new THREE.BoxGeometry(stemWidth, stemHeight, depth),
        tMaterial
    );
    stem.position.set(0, -0.8, 0);
    group.add(stem);

    return group;
}

letterTGroup.add(createCleanVolumetricT());

// --------------------
// НАЧАЛЬНЫЕ ПОВОРОТЫ
// --------------------
cubeCornersGroup.rotation.x = 0.42;
cubeCornersGroup.rotation.y = 0.55;

letterTGroup.rotation.x = -0.2;
letterTGroup.rotation.y = -0.45;

// --------------------
// АНИМАЦИЯ
// --------------------
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    mainGroup.rotation.y = Math.sin(t * 0.35) * 0.18;
    mainGroup.rotation.x = Math.cos(t * 0.22) * 0.08;

    cubeCornersGroup.rotation.y += 0.006;
    cubeCornersGroup.rotation.x += 0.0033;
    cubeCornersGroup.rotation.z += 0.002;

    letterTGroup.rotation.y -= 0.010;
    letterTGroup.rotation.x -= 0.0038;
    letterTGroup.rotation.z += 0.0028;

    const pulse = 1 + Math.sin(t * 1.3) * 0.015;
    mainGroup.scale.set(pulse, pulse, pulse);

    renderer.render(scene, camera);
}

animate();

// --------------------
// АДАПТАЦИЯ ПОД ЭКРАН
// --------------------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});