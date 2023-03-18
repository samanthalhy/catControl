import { World } from 'cannon-es';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0xFEFEFE);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    5,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(6, 8, 14);
orbit.update();

// // Sets a 12 by 12 gird helper
// const gridHelper = new THREE.GridHelper(12, 12);
// scene.add(gridHelper);

// // Sets the x, y, and z axes with each having a length of 4
// const axesHelper = new THREE.AxesHelper(4);
// scene.add(axesHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI/8, 1);
spotLight.position.set(-30, 40, 30);
spotLight.target.position.set(0,0,0);
scene.add(spotLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-30, 40, 30);
directionalLight.target.position.set(0,0,0);
scene.add(directionalLight);

const world = new CANNON.World({
    graviy: new CANNON.Vec3(0, -9.81, 0)
});

const size = 0.5;
const space = size * 0.1;
const mass = 1;
const N=10;
const shape = new CANNON.Box(new CANNON.Vec3(size, size, size));

const geo = new THREE.BoxBufferGeometry();
const mat = new THREE.MeshPhongMaterial({color: 0xFFEA00});

const meshesArray = [];
const bodiesArray = [];

for (let i =0; i<N; i++){
    const boxBody = new CANNON.Body({
        shape,
        mass,
        position: new CANNON.Vec3(-(N-i-N/2), 3, 0)
    });
    world.addBody(boxBody);
    bodiesArray.push(boxBody);

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    meshesArray.push(mesh);
}

const leftBody = new CANNON.Body({
    mass: 0,
    shape,
    position: new CANNON.Vec3(-(-N/2+1), 0, 0)
});
world.addBody(leftBody);
bodiesArray.push(leftBody);

const leftMesh = new THREE.Mesh(geo, mat);
scene.add(leftMesh);
meshesArray.push(leftMesh);

const timeStep = 1/60;
function animate() {
    world.step(timeStep);
    
    for (let i=0; i<meshesArray.length; i++){
        meshesArray[i].position.copy(bodiesArray[i].position);
        meshesArray[i].quaternion.copy(bodiesArray[i].quaternion);
    }
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});