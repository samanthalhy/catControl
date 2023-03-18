import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
// import * as dat from 'dat.gui';
import GUI from 'lil-gui'; 
import { Texture } from 'three';
import { TextureLoader } from 'three';
import { ObjectLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import * as CANNON from 'cannon-es';

// Scene and camera setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);

// Renderer setup
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground plane
var groundGeometry = new THREE.PlaneGeometry(100, 100);
var groundMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Red brick
var redBrickGeometry = new THREE.BoxGeometry(1, 0.5, 2);
var redBrickMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
var redBrick = new THREE.Mesh(redBrickGeometry, redBrickMaterial);
redBrick.position.set(0, 0.25, 0);
scene.add(redBrick);

// Green brick
var greenBrickGeometry = new THREE.BoxGeometry(1, 0.5, 2);
var greenBrickMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
var greenBrick = new THREE.Mesh(greenBrickGeometry, greenBrickMaterial);
greenBrick.position.set(0, 1.25, 0);
scene.add(greenBrick);

// Cat
var catGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
var catMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
var cat = new THREE.Mesh(catGeometry, catMaterial);
cat.position.set(0, 2.25, 0);
scene.add(cat);

// Cannon.js setup
var world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
var groundShape = new CANNON.Plane();
var groundBody = new CANNON.Body({ mass: 0 });
groundBody.addShape(groundShape);
world.addBody(groundBody);
var redBrickShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.25, 1));
var redBrickBody = new CANNON.Body({ mass: 1 });
redBrickBody.addShape(redBrickShape);
redBrickBody.position.copy(redBrick.position);
world.addBody(redBrickBody);
var greenBrickShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.25, 1));
var greenBrickBody = new CANNON.Body({ mass: 1 });
greenBrickBody.addShape(greenBrickShape);
greenBrickBody.position.copy(greenBrick.position);
world.addBody(greenBrickBody);
var catShape = new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25));
var catBody = new CANNON.Body({ mass: 1 });
catBody.addShape(catShape);
catBody.position.copy(cat.position);
world.addBody(catBody);

// Vibration function
function applyVibration() {
    // Calculate the force to apply to the red brick
    const t = clock.getElapsedTime();
    const vibrationForce = Math.sin(vibrationFrequency * t) * vibrationAmplitude;
  
    // Apply the force to the red brick
    redBrickBody.applyLocalForce(
      new CANNON.Vec3(0, vibrationForce, 0),
      new CANNON.Vec3(0, 0, 0)
    );
  
    // Wake up all the bodies in the world
    world.bodies.forEach(body => body.wakeUp());
  
    // Request the next frame
    requestAnimationFrame(applyVibration);
  }

