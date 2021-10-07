//Imports
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls.js';
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls.js';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa6c8ff);
scene.fog = new THREE.Fog(0xd8eaed, 1, 80);

//Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 300);
camera.position.set(0,0,0);

//Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa6c8ff);

/*
Update aspect ratio
Set renderer size to new window size
Render scene and camera
*/
window.addEventListener('resize', OnWindowResize);
function OnWindowResize(){
    Render();
}

function Render(){
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

//Append the renderer to the div sceneCanvas
let sceneCanvas = document.getElementById('sceneCanvas');
sceneCanvas.appendChild(renderer.domElement);

//Lights
let ambientLight = new THREE.AmbientLight(0xcce0ff, 1);
let dirLight = new THREE.DirectionalLight(0xfff5c7, 1);

//Light settings
dirLight.position.set(100, 40, 40);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
const d = 30;
dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d; 
dirLight.shadow.camera.near = 0.2;
dirLight.shadow.camera.far = 300;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMapSoft = true;
//dirLight.radius = 10;


scene.add(ambientLight, dirLight);


export{
    scene,
    camera,
    renderer,
    Render,
    THREE,
    OrbitControls,
    GLTFLoader,
    TransformControls,
    FirstPersonControls,
    PointerLockControls
};
