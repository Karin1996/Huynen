//Get json files
let models = require("../local_db/model.json");

import {
    scene,
    camera,
    renderer,
    spotlight,
    Render,
    THREE,
    OrbitControls,
    GLTFLoader,
    TransformControls,
    FirstPersonControls,
    PointerLockControls
} from "../js/scene_setup";

import {
    player
} from "../js/player";
import { Vector3 } from "three";

//Var declarations
let debug_mode = false;
const loader = new GLTFLoader();
//const orbitControls = new OrbitControls(camera, renderer.domElement);
const controls = new TransformControls(camera, renderer.domElement);
const pointerControls = new PointerLockControls(camera, renderer.domElement);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let distance_ground = 1.5;
let clock = new THREE.Clock();
let movePlayer = true;
const fpcontrols = new FirstPersonControls(camera, renderer.domElement);
const look_speed = 0.12;
fpcontrols.movementSpeed = 0;
fpcontrols.lookSpeed = 0;
fpcontrols.lookVertical = true;
fpcontrols.enableDamping = true;
fpcontrols.noFly = true;
let player_model;
let step = 0.1;
let selectedObject;

let inMotion = false;

document.addEventListener('DOMContentLoaded', window.addEventListener("mousemove", function(e){
    //If mouse moves more than x, only then enable look around
}), false); 

//debug mode
if(debug_mode){
    let gridHelper = new THREE.GridHelper(10,10);
    const axesHelper = new THREE.AxesHelper( 5 );
    //orbitControls.update();
    scene.add(gridHelper, axesHelper);
    //When pressing G, R or S change the transform controls mode
    window.addEventListener('keydown', function (event) {
        switch (event.code) {
            case 'KeyG':
                controls.setMode('translate');
                break;
            case 'KeyR':
                controls.setMode('rotate');
                break;
            case 'KeyS':
                controls.setMode('scale');
                break;
        }
    });

    // When clicking disable orbitControls. You cant move object easily otherwise
    controls.addEventListener('mouseDown', function () {
       // orbitControls.enabled = false;
    });
    controls.addEventListener('mouseUp', function () {
        //orbitControls.enabled = true;
    });

    //When a click event is triggered get mouse location
    window.addEventListener("click", function(e){
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        //Execute SelectModel
        SelectModel();
    });
}
camera.position.z = 0;
camera.position.y = distance_ground;


//Select the model that is clicked (has a raycast hit)
function SelectModel(){
    raycaster.setFromCamera(mouse, camera);
    const hitObjects = raycaster.intersectObjects(scene.children, true);
    
    hitObjects.forEach(element => {
        //Only if the hit object is a mesh attach the transform controls
        if(element.object.type == "Mesh" && element.object.parent.name !== "ground"){
            controls.attach(element.object.parent);
            //console.log(element.object.position);
            selectedObject = element.object.parent;
        }
    });
}

//Loop over the model json file and get all the static models
models.forEach(element => {
    //If the object is static add it to the scene
    //if(element.static === true){
        loader.load(element.src, function (gltf){
            const model = gltf.scene;
            model.position.set(element.x_pos, element.y_pos, element.z_pos);
            model.rotation.set(element.x_rot*(Math.PI/180), element.y_rot*(Math.PI/180), element.z_rot*(Math.PI/180));
            model.scale.set(element.x_scale, element.y_scale, element.z_scale);
            model.name = element.name;
            model.model_id = element.model_id;
            //Get the mesh from the object
            model.traverse((o) => {
                if(o.isMesh){
                    //Get the correct textureMaps
                    const texture = new THREE.TextureLoader().load("../textures/"+model.name+"_tex_color.jpg");
                    const ao = new THREE.TextureLoader().load("../textures/"+model.name+"_tex_ao.jpg");
                    const emit = new THREE.TextureLoader().load("../textures/"+model.name+"_tex_emit.jpg");
                    //Set the object material to the toonshader using the textureMaps
                    o.material = new THREE.MeshToonMaterial({map:texture, aoMap:ao, emissiveMap:emit});
                    o.receiveShadow = true;
                    o.castShadow = true;
                }
            });
            scene.add(controls, model);
        });
    //}
    //else{
    //    return;
    //}
});

//Load the player model
/*loader.load(player.modelinfo.src, function(gltf){
    player_model = gltf.scene;
    player_model.position.set(player.modelinfo.x_pos, player.modelinfo.y_pos, player.modelinfo.z_pos);
    player_model.rotation.set(player.modelinfo.x_rot*(Math.PI/180), player.modelinfo.y_rot*(Math.PI/180), player.modelinfo.z_rot*(Math.PI/180));
    //player_model.attach(camera);
    //Get the mesh from the object
    player_model.traverse((o) => {
        //Set the object material to the toonshader using the embedded texture
        if(o.isMesh){
            //Get the correct textureMaps
            const texture = new THREE.TextureLoader().load("../textures/"+player_model.name+"_tex_color.jpg");
            const ao = new THREE.TextureLoader().load("../textures/"+player_model.name+"_tex_ao.jpg");
            const emit = new THREE.TextureLoader().load("../textures/"+player_model.name+"_tex_emit.jpg");
            //Set the object material to the toonshader using the textureMaps
            o.material = new THREE.MeshToonMaterial({map:texture, aoMap:ao, emissiveMap:emit});
            o.receiveShadow = true;
            o.castShadow = true;
        }
    });
    scene.add(player_model);
});*/

window.addEventListener("mousedown", function(e){
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    //Execute MovePlayer
    if(movePlayer && !inMotion){
        fpcontrols.lookSpeed = 0;
        inMotion = true;
        movePlayer = false;
        MovePlayer();
    }
});
// window.addEventListener("mousedown", function(e){
//     //if (!inMotion) {
//         fpcontrols.lookSpeed = 0.2;
//         movePlayer = false;
//     //}
// });
// window.addEventListener("mouseup", function(e){
//     //if (!inMotion) {
//         fpcontrols.lookSpeed = 0;
//         movePlayer = true;
//     //}
// });

function animatePosition(a, b, distance, camera, percentage=0){
    if (percentage >= 0.2) {
        fpcontrols.lookSpeed = look_speed;
        inMotion = false;
        movePlayer = true;
        return;
    }

    // Determine the step size (constant)
    let steps = Math.round(distance / step);
    let percentage_step = 1 / steps;

    setTimeout(function(){
        camera.position.lerpVectors(a, b, percentage);
        animatePosition(a, b, distance, camera, percentage + percentage_step);
    }, 30);
}

//Move the player to the location that was clicked (has a raycast hit)
function MovePlayer(){
    const a_pos = camera.position;
    raycaster.setFromCamera(mouse, camera);
    const clickLocation = raycaster.intersectObjects(scene.children, true);

    //For every object intersected check the type
    clickLocation.forEach(element => {
        //Only if the hit object is a mesh look for the name of the object it is in
        if(element.object.type == "Mesh"){
        //If the object is the ground. Get the x, y, z position
            if(element.object.parent.name == "ground"){
                const distance = element.distance;
                const b_pos = new Vector3(element.point.x, element.point.y + 1.6, element.point.z);

                animatePosition(a_pos, b_pos, distance, camera);
                }
            }
    });
}

function RenderLoop() {
    fpcontrols.update(clock.getDelta()); //To be able to look around
	requestAnimationFrame(RenderLoop);
	Render();
}
RenderLoop();
