import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const container = document.getElementById('scene-container');

// --------------------
// БАЗОВАЯ СЦЕНА
// --------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(0, 0, 14);

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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
dirLight1.position.set(6, 8, 10);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0x88aaff, 0.7);
dirLight2.position.set(-8, -4, 6);
scene.add(dirLight2);

const pointLight = new THREE.PointLight(0xffffff, 1.2, 100);
pointLight.position.set(0, 0, 8);
scene.add(pointLight);

// --------------------
// ГЛАВНЫЕ ГРУППЫ
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
const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xd8d8d8,
    metalness: 0.7,
    roughness: 0.25,
    emissive: 0x111111
});

const tMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.45,
    roughness: 0.2,
    emissive: 0x161616
});

// --------------------
// ФУНКЦИЯ СОЗДАНИЯ "УГЛА" КУБА
// Каждый угол = 3 палки, сходящиеся в вершине
// --------------------
function createCorner(signX, signY, signZ, cubeHalfSize, armLength, thickness) {
    const cornerGroup = new THREE.Group();

    const px = signX * cubeHalfSize;
    const py = signY * cubeHalfSize;
    const pz = signZ * cubeHalfSize;

    // Палка вдоль X
    const xGeom = new THREE.BoxGeometry(armLength, thickness, thickness);
    const xMesh = new THREE.Mesh(xGeom, metalMaterial);
    xMesh.position.set(px - signX * armLength / 2, py, pz);
    cornerGroup.add(xMesh);

    // Палка вдоль Y
    const yGeom = new THREE.BoxGeometry(thickness, armLength, thickness);
    const yMesh = new THREE.Mesh(yGeom, metalMaterial);
    yMesh.position.set(px, py - signY * armLength / 2, pz);
    cornerGroup.add(yMesh);

    // Палка вдоль Z
    const zGeom = new THREE.BoxGeometry(thickness, thickness, armLength);
    const zMesh = new THREE.Mesh(zGeom, metalMaterial);
    zMesh.position.set(px, py, pz - signZ * armLength / 2);
    cornerGroup.add(zMesh);

    return cornerGroup;
}

// --------------------
// СОЗДАНИЕ РАЗОРВАННОГО КУБА ИЗ 8 УГЛОВ
// --------------------
const cubeHalfSize = 4.2;
const armLength = 1.6;
const armThickness = 0.12;

const signs = [-1, 1];
for (const sx of signs) {
    for (const sy of signs) {
        for (const sz of signs) {
            const corner = createCorner(sx, sy, sz, cubeHalfSize, armLength, armThickness);
            cubeCornersGroup.add(corner);
        }
    }
}

// --------------------
// ОБЪЕМНАЯ БУКВА T
// --------------------
function createVolumetricT() {
    const group = new THREE.Group();

    // Верхняя перекладина T
    const topBar = new THREE.Mesh(
        new THREE.BoxGeometry(3.8, 0.7, 0.7),
        tMaterial
    );
    topBar.position.set(0, 1.8, 0);
    group.add(topBar);

    // Вертикальная ножка T
    const stem = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 4.8, 0.9),
        tMaterial
    );
    stem.position.set(0, -0.3, 0);
    group.add(stem);

    // Дополнительные элементы для большей "объемности" и интересного вида
    const innerCore = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 5.0, 0.55),
        new THREE.MeshStandardMaterial({
            color: 0xbfbfbf,
            metalness: 0.9,
            roughness: 0.15,
            emissive: 0x101010
        })
    );
    innerCore.position.set(0, -0.25, 0);
    group.add(innerCore);

    return group;
}

const tMeshGroup = createVolumetricT();
letterTGroup.add(tMeshGroup);

// --------------------
// ДОПОЛНИТЕЛЬНЫЕ ЭЛЕМЕНТЫ СЦЕНЫ
// --------------------

// Небольшое свечение/ореол в центре через спрайт не делаем,
// чтобы оставить сцену чистой и не перегруженной.

// --------------------
// НАЧАЛЬНЫЕ ПОВОРОТЫ
// --------------------
cubeCornersGroup.rotation.x = 0.4;
cubeCornersGroup.rotation.y = 0.5;

letterTGroup.rotation.x = -0.25;
letterTGroup.rotation.y = -0.6;

// --------------------
// АНИМАЦИЯ
// --------------------
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    // Медленное общее вращение всей композиции
    mainGroup.rotation.y = Math.sin(t * 0.35) * 0.25;
    mainGroup.rotation.x = Math.cos(t * 0.25) * 0.12;

    // Куб из углов вращается в одну сторону
    cubeCornersGroup.rotation.y += 0.006;
    cubeCornersGroup.rotation.x += 0.0035;
    cubeCornersGroup.rotation.z += 0.0022;

    // Буква T вращается в другую сторону
    letterTGroup.rotation.y -= 0.01;
    letterTGroup.rotation.x -= 0.004;
    letterTGroup.rotation.z += 0.003;

    // Небольшое "дыхание" композиции
    const scalePulse = 1 + Math.sin(t * 1.4) * 0.02;
    mainGroup.scale.set(scalePulse, scalePulse, scalePulse);

    renderer.render(scene, camera);
}

animate();

// --------------------
// RESIZE
// --------------------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});