//SCRIPT TO MOVE THE PLAYER TO CLICKED LOCATION//
import {
    scene,
    camera,
    renderer,
    THREE,
    mouse,
    raycaster,
    debug_mode
} from "../js/debug";
import {CheckUI} from '../js/ui copy';
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls';


//Var declarations
const fpcontrols = new FirstPersonControls(camera, renderer.domElement);
fpcontrols.movementSpeed = 0;
fpcontrols.lookSpeed = 0;
fpcontrols.lookVertical = true;
fpcontrols.enableDamping = true;
fpcontrols.noFly = true;
const LOOK_SPEED = 0.12;
const STEP = 0.1;
const DISTANCE_GROUND = 1.5;
let playable = true;
let inMotion = false;

camera.position.z = 0;
camera.position.y = DISTANCE_GROUND;


if(!debug_mode){
    //On mouse click get mouse position and execute MovePlayer
    window.addEventListener("mousedown", function(e){
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        //Execute playable
        if (playable && !inMotion){
            fpcontrols.lookSpeed = 0;
            inMotion = true;
            playable = false;
            MovePlayer();
        }
    });
}

function AnimatePosition(a, b, distance, camera, percentage=0){
    if (percentage >= 0.2) {
        fpcontrols.lookSpeed = LOOK_SPEED;
        inMotion = false;
        playable = true;
        return;
    }
    // Determine the step size (constant)
    let steps = Math.round(distance / STEP);
    let percentage_step = 1 / steps;

    setTimeout(function(){
        camera.position.lerpVectors(a, b, percentage);
        AnimatePosition(a, b, distance, camera, percentage + percentage_step);
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
                const b_pos = new THREE.Vector3(element.point.x, element.point.y + DISTANCE_GROUND, element.point.z);
                AnimatePosition(a_pos, b_pos, distance, camera);
            }
            else{
                return;
            }
        }
        else{
            return;
        }
    });
}

export{
    fpcontrols
};