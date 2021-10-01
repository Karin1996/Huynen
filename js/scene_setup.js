// --IMPORTS--
import * as THREE from 'three';


//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc4c4c4);

//Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0,0,0);

//Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);
/*
update aspect ratio
set renderer size to new window size
render scene and camera
*/
window.addEventListener('resize', OnWindowResize, false);
function OnWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}
//Append the renderer to the div sceneCanvas
sceneCanvas = document.getElementById('sceneCanvas');
document.body.appendChild(sceneCanvas);
sceneCanvas.appendChild(renderer.domElement);

//Lights
const amLight = new THREE.AmbientLight(0x32a852, 1);
const dirLight = new THREE.DirectionalLight(0xFF0000, 1);
dirLight.position.set(2, 4, 1);
dirLight.castShadow = true;

scene.add(amLight, dirLight);
