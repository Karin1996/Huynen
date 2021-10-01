//Imports
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls.js';

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc4c4c4);

//Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0,0,0);

//Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

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
    renderer.render(scene, camera);
}

//Append the renderer to the div sceneCanvas
let sceneCanvas = document.getElementById('sceneCanvas');
sceneCanvas.appendChild(renderer.domElement);

//Lights
const amLight = new THREE.AmbientLight(0x32a852, 1);
const dirLight = new THREE.DirectionalLight(0xFF0000, 1);
dirLight.position.set(2, 4, 1);
dirLight.castShadow = true;

scene.add(amLight, dirLight);

setTimeout(Render, 100);

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
