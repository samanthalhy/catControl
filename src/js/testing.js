import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import catImg from '../img/cat.png'
import { Texture } from 'three';
import { TextureLoader } from 'three';
import { ObjectLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import * as CANNON from 'cannon-es';



const renderer = new THREE.WebGL1Renderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(0, 5, 15);
orbit.update();


/////////////////////// LIGHT SETTING BELOW ///////////////////////

// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
scene.add(directionalLight2);
directionalLight2.position.set(30, 50, 10);
directionalLight2.castShadow = true;
directionalLight2.shadow.camera.bottom = -12;
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(directionalLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

const spotLight2 = new THREE.SpotLight(0xffffff);
scene.add(spotLight2);
spotLight2.position.set(30, 0, 100);
spotLight2.castShadow = true;
spotLight2.angle = 0.2;


const spotLight3 = new THREE.SpotLight(0xffffff);
scene.add(spotLight3);
spotLight3.position.set(-30, 0, 100);

const spotLight4 = new THREE.SpotLight(0xffffff);
scene.add(spotLight4);
spotLight4.position.set(30, 0, -100);

// scene.fog = new THREE.Fog(0xffffff, 0, 200);
scene.fog = new THREE.FogExp2(0xffffff, 0.01);

renderer.setClearColor(0xffea00);   // blackground color
// renderer.setClearColor(0xffffff);   // blackground color


/////////////////////// GROUND  ///////////////////////

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81,0)
});

const groundGeometry = new THREE.PlaneGeometry(30, 30);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(ground);
// ground.rotation.x = -0.5 * Math.PI;
ground.receiveShadow = true;

const groundPhysMat = new CANNON.Material();
const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    // mass:10
    type: CANNON.Body.STATIC,
    material: groundPhysMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI/2,0,0);


const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

/////////////////////// BUILDING BELOW ///////////////////////

const boxGeometry = new THREE.BoxGeometry(2,2,2);
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);
// box.position.set(5,5,5);

const boxPhysMat = new CANNON.Material();
const boxBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(2,2,2)),
    mass: 1,
    position: new CANNON.Vec3(1,20,0),
    material: boxPhysMat
});
world.addBody(boxBody);

boxBody.angularDamping = 0.5;

const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    boxPhysMat,
    {friction: 0}
);

world.addContactMaterial(groundBoxContactMat);


/////////////////////// OBJECTS INSTANCES BELOW ///////////////////////

const ballGeometry = new THREE.SphereGeometry(2);
const ballMaterial = new THREE.MeshStandardMaterial({
    color: 0x00a0FF,
    wireframe: false
});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

const ballBody = new CANNON.Body({
    shape: new CANNON.Sphere(2),
    mass: 1,
    position: new CANNON.Vec3(0,15,0)
});
world.addBody(ballBody);

ballBody.linearDamping = 0.31;


const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    wireframe: false
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

const textureLoader = new THREE.TextureLoader();
const catGeometry = new THREE.BoxGeometry(5,5,2);
const catMaterial = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    map: textureLoader.load(catImg)
});
const cat = new THREE.Mesh(catGeometry, catMaterial);
scene.add(cat);
cat.position.set(10, 5, 0);

const plane2Geometry = new THREE.PlaneGeometry(10,10,10,10);
const plane2Material = new THREE.MeshBasicMaterial({
    color: 0xffffff
    // wireframe: true
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10,10,15);

const gltfLoader = new GLTFLoader();

let cat3d;
gltfLoader.load('./assets/cat.gltf', function(gltf){
    const model = gltf.scene;
    
    scene.add(model);
    cat3d = model;
    cat3d.scale.multiplyScalar(40);
    cat3d.position.set(0,0,5);
    cat3d.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    });
});



/////////////////////// CONTROL PANEL BELOW ///////////////////////

const gui = new dat.GUI();
const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1
};

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0, 0.1);

gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);

/////////////////////// LOOP BELOW ///////////////////////


const timeStep = 1/60;


let step = 0;

const mousePosition = new THREE.Vector2();


window.addEventListener('mousemove', function(e){
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1
});

const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;
cat.name = 'theCat';

function animate(time) {
    world.step(timeStep);

    ground.position.copy(groundBody.position);
    ground.quaternion.copy(groundBody.quaternion);

    box.position.copy(boxBody.position);
    box.quaternion.copy(boxBody.quaternion);

    ball.position.copy(ballBody.position);
    ball.quaternion.copy(ballBody.quaternion);

	// box.rotation.x = time / 1000;
	// box.rotation.y = time / 1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    // console.log(intersects);

    for(let i = 0; i < intersects.length; i++){
        if (intersects[i].object.id === sphereId){
            intersects[i].object.material.color.set(0xFF0000);
        }
        if (intersects[i].object.name === 'theCat'){
            intersects[i].object.rotation.x = time / 1000;
            intersects[i].object.rotation.y = time / 1000;
        }

    }

    if (cat3d)
        cat3d.rotation.y = -time / 3000;

	renderer.render(scene, camera);
}

renderer.gammaOutput = true
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});