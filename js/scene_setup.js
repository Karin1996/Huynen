//Imports
import * as THREE from 'three';
import { Light } from 'three';

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa6c8ff);
scene.fog = new THREE.Fog(0xc1dcf7, 30, 80);
//scene.fog = new THREE.FogExp2(0xc1dcf7, 0.01);

//Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 120);
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
renderer.toneMappingExposure = 1.25; 
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
let dirHelper = new THREE.DirectionalLightHelper(dirLight, 5);
const pointLightFire1 =  new THREE.PointLight(0xff3c00, 2, 12);
pointLightFire1.position.set(11.8, 0, -13.5);
const pointLightFire2 =  new THREE.PointLight(0xff3c00, 3, 12);
pointLightFire2.position.set(-35, 1, 14.3);
//scene.add(dirHelper);

//Light settings
dirLight.position.set(6, 15, 0);

//Shadows are to dark, currently this is the lightest method to reduce shadow intensity
let dirLight2 = dirLight.clone();

dirLight.castShadow = true;
dirLight2.castShadow = false;
dirLight.intensity = 0.6;
dirLight2.intensity = 0.8;

dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;

let shadowPlanes = 60;
dirLight.shadow.camera.left = -shadowPlanes;
dirLight.shadow.camera.right = shadowPlanes;
dirLight.shadow.camera.top = shadowPlanes;
dirLight.shadow.camera.bottom = -shadowPlanes;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 250;
dirLight.shadow.bias = 0.15;

scene.add(ambientLight, dirLight, dirLight2, pointLightFire1, pointLightFire2);


export{
    scene,
    camera,
    renderer,
    Render,
    THREE, 
    raycaster, 
    mouse,
    dirLight, 
    dirLight2
};