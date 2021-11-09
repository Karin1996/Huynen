//SCRIPT TO LOAD AND MUTATE ALL THE 3D MODELS
//Get json files
let models = require("../local_db/model.json");
//let shaders = require("../js/shaders.js");

import {
    scene,
    THREE,
} from "./debug";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from "three/examples/jsm/loaders/dracoloader";


//Var declarations
const loader = new GLTFLoader();
//const loader = new DRACOLoader();
//loader.setDecoderPath("three/examples/js/libs/draco");
//loader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
//loader.preload();

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
        if(element.information_id > 0){
            model.information_id = element.information_id;
        } 
        //Get the mesh from the object
        model.traverse((o) => {
            if(o.isMesh){
                //Check the extra properties for certain values that determine how it will be displayed
                element.properties.forEach(e => {
                    o.material = new THREE.MeshToonMaterial({map: o.material.map, side: THREE.DoubleSide});
                    o.receiveShadow = true;
                    o.castShadow = true;

                    switch(e){
                        case "ground":
                            o.material.side = THREE.FrontSide;
                            o.castShadow = false;
                            break;
                        case "transparent":
                            o.material.transparent = true;
                            o.material.opacity = 0.2;
                            break;
                        case "interactable":
                            if(o.name == "Outline"){
                                o.material = new THREE.MeshBasicMaterial({color: 0x00ba54});
                            }
                            else{
                                o.material = new THREE.MeshToonMaterial({map: o.material.map, side: THREE.DoubleSide});
                            }
                            break;
                        case "static":
                            //Make a bounding box for the collision detection around the object. Will later generate matrix
                            //o.geometry.computeBoundingBox();
                            //const box = new THREE.BoxHelper(model, 0xffff00 );
                            //scene.add(box);
                    }
                });
            }
        });
        scene.add(model);
    });
});



