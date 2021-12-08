//Imports
import * as THREE from 'three';

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa6c8ff);
scene.fog = new THREE.Fog(0xc1dcf7, 4, 80);

//Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 100);
camera.position.set(0,0,0);

//Renderer
const renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa6c8ff);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMapSoft = true;
renderer.physicallyCorrectLights = true;
renderer.physicallyBasedShading = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2; 
renderer.outputEncoding = THREE.sRGBEncoding;

//Ray and mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
//Set the length of the raycaster ray
raycaster.near = 0;
raycaster.far = 30;

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
let ambientLight = new THREE.AmbientLight(0xcce0ff, 0.4);
let dirLight = new THREE.DirectionalLight(0xfff5c7);
//let dirHelper = new THREE.DirectionalLightHelper(dirLight, 5);
//scene.add(dirHelper);

//Light settings
dirLight.position.set(100, 40, 40);

//Shadows are to dark, currently this is the lightest method to reduce shadow intensity
let dirLight2 = dirLight.clone();
dirLight.castShadow = true;
dirLight2.castShadow = false;
dirLight.intensity = 0.5;
dirLight2.intensity = 0.9;

dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;

dirLight.shadow.camera.left = -30;
dirLight.shadow.camera.right = 30;
dirLight.shadow.camera.top = 30;
dirLight.shadow.camera.bottom = -30;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 250;
dirLight.shadow.bias = 0.15;

scene.add(ambientLight, dirLight, dirLight2);


export{
    scene,
    camera,
    renderer,
    Render,
    THREE, 
    raycaster, 
    mouse
};