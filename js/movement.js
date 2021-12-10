//SCRIPT TO MOVE THE PLAYER TO CLICKED LOCATION//
import {
    camera,
    renderer,
    THREE,
    mouse,
    raycaster
} from "../js/scene_setup";
import {uiVisible} from "./ui";
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls';
import {modelsList} from "./loader";
//import {sceneLoaded} from "./gamemanager";
import {DisplayRay} from "./debug";


//Var declarations
const fpcontrols = new FirstPersonControls(camera, renderer.domElement);
fpcontrols.movementSpeed = 0;
fpcontrols.lookSpeed = 0.05;
fpcontrols.noFly = true;
const LOOK_SPEED = 0.12;

const STEP = 0.1;
const DISTANCE_GROUND = 1.5;
//camera.position.x = -25;
//camera.position.z = 30;
camera.position.z = 10;
camera.position.y = DISTANCE_GROUND;

//Player's mouse is in the window and there is no ui visible
document.getElementById("sceneCanvas").addEventListener("mouseenter", function(){
    if(!uiVisible){fpcontrols.lookSpeed = LOOK_SPEED;}
    else{fpcontrols.lookSpeed = 0;}
});
//Player's mouse is not in the window
document.getElementById("sceneCanvas").addEventListener("mouseleave", function(){
    fpcontrols.lookSpeed = 0;
});

//Enable looking 1 second after everything is loaded in
setTimeout(function(){
    fpcontrols.lookSpeed = LOOK_SPEED;
}, 1000)

//Get the clicked location
document.addEventListener("mousedown", function(e){        
    raycaster.setFromCamera(mouse, camera);    
    const hitObjects = raycaster.intersectObjects(modelsList);
    
    //Save the first (closest) object that the player is looking at
    if(hitObjects.length > 0){
        let currentObject = hitObjects[0];

        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        if(currentObject.object.parent.property == "ground" ){
            if(!uiVisible){
                MovePlayer(currentObject);
            }
        }
    }
}, true);


function MovePlayer(location){
    const a_pos = camera.position;
    const distance = location.distance;
    const b_pos = new THREE.Vector3(location.point.x, location.point.y + DISTANCE_GROUND, location.point.z);

    AnimatePosition(a_pos, b_pos, distance, camera);
}

function AnimatePosition(a, b, distance, camera, percentage=0){
    if (percentage >= 0.2) {
        fpcontrols.lookSpeed = LOOK_SPEED;
        return;
    }
    //Determine the amount of steps
    fpcontrols.lookSpeed = 0;
    let steps = Math.round(distance / STEP);
    let percentage_step = 1 / steps;

    setTimeout(function(){
        camera.position.lerpVectors(a, b, percentage);
        AnimatePosition(a, b, distance, camera, percentage + percentage_step);
    }, 30);
}


export{
    fpcontrols, LOOK_SPEED
};