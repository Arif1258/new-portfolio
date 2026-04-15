const container = document.getElementById("canvas-container");

// SCENE
const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(
70,
window.innerWidth / window.innerHeight,
0.1,
1000
);
camera.position.z = 8;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// ===== CENTRAL OBJECT =====
const geometry = new THREE.IcosahedronGeometry(2, 1);
const material = new THREE.MeshStandardMaterial({
color: 0x00ffff,
emissive: 0x002222,
wireframe: true
});
const core = new THREE.Mesh(geometry, material);
scene.add(core);

// ===== PARTICLE FIELD =====
const starGeo = new THREE.BufferGeometry();
const starCount = 1500;
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i++) {
starPositions[i] = (Math.random() - 0.5) * 80;
}

starGeo.setAttribute(
"position",
new THREE.BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
color: 0xffffff,
size: 0.05
});

const stars = new THREE.Points(starGeo, starMaterial);
scene.add(stars);

// LIGHT
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

// ===== SCROLL EFFECT =====
window.addEventListener("scroll", () => {
const scrollY = window.scrollY;

core.rotation.y = scrollY * 0.001;
core.rotation.x = scrollY * 0.0005;

camera.position.z = 8 + scrollY * 0.002;
});

// ANIMATION LOOP
function animate() {
requestAnimationFrame(animate);

core.rotation.y += 0.002;
stars.rotation.y += 0.0002;

renderer.render(scene, camera);
}

animate();

// RESPONSIVE
window.addEventListener("resize", () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});
