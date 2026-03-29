import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const container = document.getElementById('scene-container');

// --------------------------------------------------
// СЦЕНА / КАМЕРА / РЕНДЕР
// --------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(0, 0, 18.5);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// --------------------------------------------------
// СВЕТ
// --------------------------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.1);
dirLight1.position.set(8, 10, 12);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xbfcfff, 0.3);
dirLight2.position.set(-8, -5, 8);
scene.add(dirLight2);

const pointLight = new THREE.PointLight(0xffffff, 0.55, 100);
pointLight.position.set(0, 0, 9);
scene.add(pointLight);

// --------------------------------------------------
// ГЛАВНАЯ ГРУППА
// --------------------------------------------------
const mainGroup = new THREE.Group();
scene.add(mainGroup);

const cubeCornersGroup = new THREE.Group();
const letterTGroup = new THREE.Group();

mainGroup.add(cubeCornersGroup);
mainGroup.add(letterTGroup);

// --------------------------------------------------
// МАТЕРИАЛЫ
// --------------------------------------------------
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xd9d9d9,
    metalness: 0.72,
    roughness: 0.26,
    emissive: 0x101010
});

const tMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.58,
    roughness: 0.22,
    emissive: 0x111111
});

// --------------------------------------------------
// УГОЛ КУБА
// Каждый угол = 3 очень тонкие прямые,
// сходящиеся в одной точке
// --------------------------------------------------
function createCorner(signX, signY, signZ, armLength, thickness, material) {
    const group = new THREE.Group();

    const xBar = new THREE.Mesh(
        new THREE.BoxGeometry(armLength, thickness, thickness),
        material
    );
    xBar.position.set(-signX * armLength / 2, 0, 0);
    group.add(xBar);

    const yBar = new THREE.Mesh(
        new THREE.BoxGeometry(thickness, armLength, thickness),
        material
    );
    yBar.position.set(0, -signY * armLength / 2, 0);
    group.add(yBar);

    const zBar = new THREE.Mesh(
        new THREE.BoxGeometry(thickness, thickness, armLength),
        material
    );
    zBar.position.set(0, 0, -signZ * armLength / 2);
    group.add(zBar);

    return group;
}

// --------------------------------------------------
// КУБ ИЗ 8 УГЛОВ
// ЛИНИИ СТАЛИ СИЛЬНО ТОНЬШЕ
// --------------------------------------------------
const cubeHalfSize = 3.2;
const armLength = 1.5;
const armThickness = 0.018;

const signs = [-1, 1];

for (const sx of signs) {
    for (const sy of signs) {
        for (const sz of signs) {
            const corner = createCorner(sx, sy, sz, armLength, armThickness, cubeMaterial);
            corner.position.set(
                sx * cubeHalfSize,
                sy * cubeHalfSize,
                sz * cubeHalfSize
            );
            cubeCornersGroup.add(corner);
        }
    }
}

// --------------------------------------------------
// ЦЕЛЬНАЯ ОБЪЕМНАЯ БУКВА T
// --------------------------------------------------
function createSolidT() {
    const topWidth = 3.2;
    const topHeight = 0.62;
    const stemWidth = 0.82;
    const totalHeight = 4.2;
    const depth = 0.72;

    const halfTopWidth = topWidth / 2;
    const halfStemWidth = stemWidth / 2;
    const topY = totalHeight / 2;
    const underTopY = topY - topHeight;
    const bottomY = -totalHeight / 2;

    const shape = new THREE.Shape();

    shape.moveTo(-halfTopWidth, topY);
    shape.lineTo(halfTopWidth, topY);
    shape.lineTo(halfTopWidth, underTopY);
    shape.lineTo(halfStemWidth, underTopY);
    shape.lineTo(halfStemWidth, bottomY);
    shape.lineTo(-halfStemWidth, bottomY);
    shape.lineTo(-halfStemWidth, underTopY);
    shape.lineTo(-halfTopWidth, underTopY);
    shape.lineTo(-halfTopWidth, topY);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: depth,
        bevelEnabled: false,
        steps: 1
    });

    geometry.center();

    return new THREE.Mesh(geometry, tMaterial);
}

const solidT = createSolidT();
letterTGroup.add(solidT);

// --------------------------------------------------
// НАЧАЛЬНЫЕ ПОВОРОТЫ
// --------------------------------------------------
cubeCornersGroup.rotation.x = 0.42;
cubeCornersGroup.rotation.y = 0.58;

letterTGroup.rotation.x = -0.22;
letterTGroup.rotation.y = -0.48;

// --------------------------------------------------
// АНИМАЦИЯ
// --------------------------------------------------
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    mainGroup.rotation.y = Math.sin(t * 0.30) * 0.12;
    mainGroup.rotation.x = Math.cos(t * 0.22) * 0.06;

    cubeCornersGroup.rotation.y += 0.0058;
    cubeCornersGroup.rotation.x += 0.0030;
    cubeCornersGroup.rotation.z += 0.0018;

    letterTGroup.rotation.y -= 0.0095;
    letterTGroup.rotation.x -= 0.0034;
    letterTGroup.rotation.z += 0.0023;

    renderer.render(scene, camera);
}

animate();

// --------------------------------------------------
// RESIZE
// --------------------------------------------------
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', onResize);
onResize();