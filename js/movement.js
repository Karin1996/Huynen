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
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls';


//Var declarations
const fpcontrols = new FirstPersonControls(camera, renderer.domElement);
fpcontrols.movementSpeed = 0;
fpcontrols.lookSpeed = 0;
fpcontrols.lookVertical = true;
fpcontrols.enableDamping = true;
fpcontrols.noFly = true;
const look_speed = 0.12;
let step = 0.1;
let distance_ground = 1.5;
let movePlayer = true;
let inMotion = false;

camera.position.z = 0;
camera.position.y = distance_ground;


if(!debug_mode){
    //On mouse click get mouse position and execute MovePlayer
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
}

function AnimatePosition(a, b, distance, camera, percentage=0){
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
                const b_pos = new THREE.Vector3(element.point.x, element.point.y + 1.6, element.point.z);
                AnimatePosition(a_pos, b_pos, distance, camera);
            }
        }
    });
}

export{
    fpcontrols
};