//Imports
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls.js';

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa6c8ff);
scene.fog = new THREE.Fog(0xd8eaed, 1, 80);

//Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 500);
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

//Append the renderer to the div sceneCanvas
let sceneCanvas = document.getElementById('sceneCanvas');
sceneCanvas.appendChild(renderer.domElement);

//Lights
let ambientLight = new THREE.AmbientLight(0xbaeaf7, 1);
let spotlight = new THREE.SpotLight(0xfff5c7, 0.8);

const lightHelper = new THREE.SpotLightHelper(spotlight, 0xff0000);

spotlight.castShadow = true;
spotlight.position.set(80, 55, 0);
spotlight.shadow.mapSize.width = 2048;
spotlight.shadow.mapSize.height = 2048;
spotlight.shadow.radius = 10;
const d = 30;
spotlight.shadow.camera.left = - d;
spotlight.shadow.camera.right = d;
spotlight.shadow.camera.top = d;
spotlight.shadow.camera.bottom = - d; 
spotlight.shadow.camera.near = 1; 
spotlight.shadow.camera.far = 500;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMapSoft = true;

scene.add(ambientLight, spotlight, lightHelper);


export{
    scene,
    camera,
    renderer,
    Render,
    spotlight,
    THREE,
    OrbitControls,
    GLTFLoader,
    TransformControls
};
