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
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
let pointLight = new THREE.PointLight(0xfff6cf, 1, 100);
pointLight.castShadow = true;
const lightHelper = new THREE.PointLightHelper(pointLight, 5);
pointLight.position.set(10,10,1);
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
pointLight.shadow.camera.near = 1; // default
pointLight.shadow.camera.far = 500; // default
pointLight.shadow.radius= 4;

renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;


scene.add(ambientLight, pointLight, lightHelper);

//setTimeout(Render, 100);

export{
    scene,
    camera,
    renderer,
    Render,
    pointLight,
    THREE,
    OrbitControls,
    GLTFLoader,
    TransformControls
};
