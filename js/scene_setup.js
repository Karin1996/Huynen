//Imports
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls.js';

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa6c8ff);

//Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0,0,0);

//Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

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
let hemiLight = new THREE.HemisphereLight(0x71baeb, 0x88bf91, 0.6);
let dirLight = new THREE.DirectionalLight(0xfff7de, 1);
const lightHelper = new THREE.DirectionalLightHelper( dirLight, 5 );

dirLight.position.set(0, 10, 0);
//For daylight to nighttime simulation rotate dir light on z over time
dirLight.rotation.set(0, 0, 40);
dirLight.castShadow = true;
dirLight.position.set(2, 4, 1);

scene.add(lightHelper, hemiLight, dirLight);

//setTimeout(Render, 100);

export{
    scene,
    camera,
    renderer,
    Render,
    THREE,
    OrbitControls,
    GLTFLoader,
    TransformControls
};
