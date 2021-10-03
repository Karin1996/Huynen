//Get json files
let models = require("../local_db/model.json");

import {
    scene,
    camera,
    renderer,
    Render,
    THREE,
    OrbitControls,
    GLTFLoader,
    TransformControls
} from "../js/scene_setup";

import {
    player
} from "../js/player";

let debug_mode = true;

const orbitControls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();
const controls = new TransformControls(camera, renderer.domElement);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const toonMaterial = new THREE.MeshToonMaterial({color: 0xff0000});

//debug mode
if(debug_mode){
    camera.position.z = 4;
    camera.position.y = 4;
    let gridHelper = new THREE.GridHelper(10,10);
    const axesHelper = new THREE.AxesHelper( 5 );
    orbitControls.update();
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
        orbitControls.enabled = false;
    });
    controls.addEventListener('mouseUp', function () {
        orbitControls.enabled = true;
    });

    //When a click event is triggered get mouse location
    window.addEventListener("click", function(e){
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        //Execute SelectModel
        SelectModel();
    });
}
//Select the model that is clicked (has a raycast hit)
function SelectModel(){
    raycaster.setFromCamera(mouse, camera);
    const hitObjects = raycaster.intersectObjects(scene.children, true);
    
    hitObjects.forEach(element => {
        //Only if the hit object is a mesh attach the transform controls
        if(element.object.type == "Mesh"){
            controls.attach(element.object.parent);
        }
    });
}

//Loop over the model json file and get all the static models
models.forEach(element => {
    //If the object is static add it to the scene
    if(element.static === true){
        loader.load(element.src, function (gltf){
            const model = gltf.scene;
            model.position.set(element.x_pos, element.y_pos, element.z_pos);
            model.rotation.set(element.x_rot*(Math.PI/180), element.y_rot*(Math.PI/180), element.z_rot*(Math.PI/180));
            controls.attach(gltf.scene);
            model.name = element.name;
            model.model_id = element.model_id;
            model.castShadow = true;
            model.receiveShadow = true;
            //Get the mesh from the object
            model.traverse((o) => {
                //Set the object material to the toonshader using the embedded texture
                if(o.isMesh) o.material = new THREE.MeshToonMaterial({map: o.material.map});
            });
            scene.add(controls, model);
        });
    }
    else{
        return;
    }
});


//Load the player model
let player_model;
loader.load(player.modelinfo.src, function(gltf){
    //console.log(gltf);
    player_model = gltf.scene;
    //console.log(player_model);
    player_model.position.set(player.modelinfo.x_pos, player.modelinfo.y_pos, player.modelinfo.z_pos);
    player_model.rotation.set(player.modelinfo.x_rot*(Math.PI/180), player.modelinfo.y_rot*(Math.PI/180), player.modelinfo.z_rot*(Math.PI/180));
    player_model.attach(camera);
    player_model.castShadow = true;
    player_model.receiveShadow = true;
    //Get the mesh from the object
    player_model.traverse((o) => {
        //Set the object material to the toonshader using the embedded texture
        if(o.isMesh) o.material = new THREE.MeshToonMaterial({map: o.material.map});
    });
    console.log("player", player_model);
    scene.add(player_model);
});
window.addEventListener("click", function(e){
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    //Execute MovePlayer
    MovePlayer();
});
//Move the player to the location that was clicked (has a raycast hit)
function MovePlayer(){
    raycaster.setFromCamera(mouse, camera);
    const clickLocation = raycaster.intersectObject(scene, true);
    const x = clickLocation[0].point.x;
    const y = 0; //TODO: y should be a different value than point click. Probably calculated from a ground model that will be loaded in.
    const z = clickLocation[0].point.z;

    player_model.position.set(x, y, z);
    //return x, y, z;
}
//console.log(player_model);

function RenderLoop() {
    //var delta = clock.getDelta();
	requestAnimationFrame(RenderLoop);
	Render();
}
RenderLoop();
