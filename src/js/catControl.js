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

// renderer.setClearColor(0xffea00);   // blackground color
renderer.setClearColor(0xededed);   // blackground color


/////////////////////// GROUND  ///////////////////////

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81,0)
});

const groundGeometry = new THREE.BoxGeometry(20, 0.5, 5);
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
    shape: new CANNON.Box(new CANNON.Vec3(18,0.5,5)),
    // mass:10
    type: CANNON.Body.STATIC,
    material: groundPhysMat
});
world.addBody(groundBody);
// groundBody.quaternion.setFromEuler(-Math.PI/2,0,0);


const gridHelper = new THREE.GridHelper(20);
scene.add(gridHelper);


/////////////////////// Vibrator BELOW ///////////////////////

const vibratorGeometry = new THREE.BoxGeometry(10, 0.5, 4);
const vibratorMaterial = new THREE.MeshStandardMaterial({color: 0xFF0000});
const vibrator = new THREE.Mesh(vibratorGeometry, vibratorMaterial);
scene.add(vibrator);
// box.position.set(5,5,5);

const vibratorPhysMat = new CANNON.Material();
const vibratorBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1, 0.2, 4)),
    mass: 1,
    position: new CANNON.Vec3(0,5,0),
    material: vibratorPhysMat
});
world.addBody(vibratorBody);

vibratorBody.angularDamping = 0.5;
vibrator.receiveShadow = true;


/////////////////////// BUILDING BELOW ///////////////////////

const buildingGeometry = new THREE.BoxGeometry(5, 0.5, 4.5);
const buildingMaterial = new THREE.MeshStandardMaterial({color: 0x00FF00});
const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
scene.add(building);
// box.position.set(5,5,5);

const buildingPhysMat = new CANNON.Material();
const buildingBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(5, 0.3, 4.3)),
    mass: 5,
    position: new CANNON.Vec3(0,15,0),
    material: buildingPhysMat
});
world.addBody(buildingBody);

buildingBody.angularDamping = 0.5;

building.receiveShadow = true;


/////////////////////// CAT INSTANCES BELOW ///////////////////////
const gltfLoader = new GLTFLoader();

// const catMeshes = new THREE.Object3D;
// const catBodies = new CANNON.Body;

let cat3d = new THREE.Object3D();
gltfLoader.load('./assets/cat.gltf', function(gltf){
    const model = gltf.scene;
    
    scene.add(model);
    cat3d = model;
    cat3d.scale.multiplyScalar(30);
    // cat3d.position.set(0,0,0);
    cat3d.traverse(function(node){
        if (node.isMesh)
            node.castShadow = true;
    });

});


const catPhysMat = new CANNON.Material();
const catBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(3, 3.5, 2.8)),
    mass: 0.5,
    position: new CANNON.Vec3(0, 25, -1),
    material: catPhysMat
});
world.addBody(catBody);


const BuildingCatContactMat = new CANNON.ContactMaterial(
    buildingPhysMat,
    catPhysMat,
    {friction: 0.001}
);

world.addContactMaterial(BuildingCatContactMat);

const VibratorCatContactMat = new CANNON.ContactMaterial(
    vibratorPhysMat,
    catPhysMat,
    {friction: 0}
);

world.addContactMaterial(VibratorCatContactMat);


/////////////////////// OBJECTS INSTANCES BELOW ///////////////////////


/////////////////////// CONTROL PANEL BELOW ///////////////////////

const gui = new dat.GUI();
const options = {
    blackgroundColor: '#ffea00',
    speed: 0.01,
    friction: 0.001,
    amplitude: 5,
    catMass: 0.5
    // lightAngle: 0.2,
    // penumbra: 0,
    // intensity: 1
};

gui.addColor(options, 'blackgroundColor').onChange(function(e){
    renderer.setClearColor(e);
});



gui.add(options, 'speed', 0, 1);
gui.add(options, 'friction', 0, 1);
gui.add(options, 'amplitude', 0, 15);
gui.add(options, 'catMass', 0, 10);
// gui.add(options, 'lightAngle', 0, 1);
// gui.add(options, 'penumbra', 0, 1);
// gui.add(options, 'intensity', 0, 1);

/////////////////////// LOOP BELOW ///////////////////////


const timeStep = 1/60;


let step = 0;

const mousePosition = new THREE.Vector2();


window.addEventListener('mousemove', function(e){
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1
});

const rayCaster = new THREE.Raycaster();

// const sphereId = sphere.id;
// cat.name = 'theCat';

function animate(time) {
    world.step(timeStep);

    ground.position.copy(groundBody.position);
    ground.quaternion.copy(groundBody.quaternion);

    vibrator.position.copy(vibratorBody.position);
    vibrator.quaternion.copy(vibratorBody.quaternion);

    building.position.copy(buildingBody.position);
    building.quaternion.copy(buildingBody.quaternion);

    cat3d.position.copy(catBody.position);
    cat3d.position.y -= 3.5;
    // catBody.position.y +=4.5;
    cat3d.quaternion.copy(catBody.quaternion);

    // ball.position.copy(ballBody.position);
    // ball.quaternion.copy(ballBody.quaternion);

	// box.rotation.x = time / 1000;
	// box.rotation.y = time / 1000;

    step += options.speed;
    // buildingBody.position.x = 5 * (Math.sin(step));
    vibratorBody.position.x = options.amplitude * (Math.sin(step));

    BuildingCatContactMat.friction = options.friction;

    catBody.mass = options.catMass;

    // spotLight.angle = options.lightAngle;
    // spotLight.penumbra = options.penumbra;
    // spotLight.intensity = options.intensity;
    // sLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    // console.log(intersects);

    // for(let i = 0; i < intersects.length; i++){
    //     if (intersects[i].object.id === sphereId){
    //         intersects[i].object.material.color.set(0xFF0000);
    //     }
    //     if (intersects[i].object.name === 'theCat'){
    //         intersects[i].object.rotation.x = time / 1000;
    //         intersects[i].object.rotation.y = time / 1000;
    //     }

    // }

    // if (cat3d)
    //     cat3d.rotation.y = -time / 3000;

	renderer.render(scene, camera);
}

renderer.gammaOutput = true
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});