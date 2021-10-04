//Get json files
let models = require("../local_db/model.json");

import {
    scene,
    camera,
    renderer,
    pointLight,
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

//Var declarations
const orbitControls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();
const controls = new TransformControls(camera, renderer.domElement);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let player_model;
let player_height;
let distance;


//debug mode
if(debug_mode){
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
       // SelectModel();
    });
}
camera.position.z = 3;
camera.position.y = 2;
camera.rotation.x = -10*(Math.PI/180);
orbitControls.enablePan = false;
orbitControls.enableRotate = false;
orbitControls.enableZoom = false;

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
            //controls.attach(gltf.scene);
            model.name = element.name;
            model.model_id = element.model_id;
            model.castShadow = true;
            model.receiveShadow = true;
            //Get the mesh from the object
            model.traverse((o) => {
                //Set the object material to the toonshader using the embedded texture
                if(o.isMesh){
                    o.material = new THREE.MeshToonMaterial({map: o.material.map});
                    o.receiveShadow = true;
                    o.castShadow = true;
                }
            });
            scene.add(controls, model);
        });
    }
    else{
        return;
    }
});

//Load the player model
loader.load(player.modelinfo.src, function(gltf){
    //console.log(gltf);
    player_model = gltf.scene;
    //console.log(player_model);
    player_model.position.set(player.modelinfo.x_pos, player.modelinfo.y_pos, player.modelinfo.z_pos);
    player_model.rotation.set(player.modelinfo.x_rot*(Math.PI/180), player.modelinfo.y_rot*(Math.PI/180), player.modelinfo.z_rot*(Math.PI/180));
    player_model.attach(camera);
    player_model.attach(pointLight);
    //Get the mesh from the object
    player_model.traverse((o) => {
        //Set the object material to the toonshader using the embedded texture
        if(o.isMesh){
            o.material = new THREE.MeshToonMaterial({map: o.material.map});
            o.receiveShadow = true;
            o.castShadow = true;
            player_height = o.geometry.boundingBox.max.y;
        }
    });
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
    const clickLocation = raycaster.intersectObjects(scene.children, true);

    //For every object intersected check the type
    clickLocation.forEach(element => {
        //Only if the hit object is a mesh look for the name of the object it is in
        if(element.object.type == "Mesh"){
            //If the object is the ground. Get the x, y, z position
            if(element.object.parent.name == "ground"){
                distance = element.distance;
                const x = element.point.x;
                const y = element.point.y;
                const z = element.point.z;
                player_model.position.set(x, y, z);
                //Lerp position. Use the distance gained and divide that by step/speed size until location is reached
                //player_model.position.lerp(new THREE.Vector3(x,y,z), 0,5);
            }
        }
    });

}

function RenderLoop() {
    //var delta = clock.getDelta();
	requestAnimationFrame(RenderLoop);
	Render();
}
RenderLoop();
