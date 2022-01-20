import {THREE, scene,} from "./scene_setup";
import {camera, fpcontrols, DISTANCE_GROUND} from "./movement";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {audioMuted} from "./gamemanager";
let festivalModels = require("../local_db/festivalList.json");
let animationDone = false;
let festival = false;
let blinkingDone = false;
let festivalList = [];

let bgAudio = new Audio("../audio/bg.ogg");
let LinneAudio = new Audio("../audio/Linne_festival.ogg");;
let IdaAudio = new Audio("../audio/Ida_festival.ogg");;
let RolfeAudio = new Audio("../audio/Rolfe_festival.ogg");;
let LejoAudio = new Audio("../audio/Lejo_festival.ogg");;
let KalieAudio = new Audio("../audio/Kalie_festival.ogg");;       

const animationTime = 3000;
const festivalTime = 15000;

function Blinking(phase){
    document.getElementById("blink").style.display = "flex";
    document.documentElement.style.setProperty('--duration', animationTime/1000+"s");
    document.getElementById("blink").children[0].classList.add("blink");
    document.getElementById("blink").children[1].classList.add("blink");
    document.documentElement.style.setProperty('--opacity', "1");

    if(phase == "end"){
        document.documentElement.style.setProperty('--direction', "reverse");
    }
    else{
        document.documentElement.style.setProperty('--direction', "normal");
    }

    setTimeout(function() {        
        if(phase == "end"){
            document.documentElement.style.setProperty('--opacity', "1");
            blinkingDone = true;
        }
        else{
            document.documentElement.style.setProperty('--opacity', "0");
            setTimeout(function(){
                document.getElementById("blink").style.display = "none";
            }, 100)
        }
    }, animationTime - 50);

}


function AnimationController(object, to, loop=true){
    animationDone = false;
    object.action.stop();

    const previousClip = object.clip;
    object.clip = THREE.AnimationClip.findByName(object.clips, to);
    object.action = object.mixer.clipAction(object.clip);

    object.action.play();

    if(loop == false){
        //Only do the animation once and leave it on the last keyframe
        object.action.setLoop(THREE.LoopOnce);
        object.action.clampWhenFinished = true;
        object.mixer.addEventListener('finished', function(e) {
            animationDone = true;
        });
    }
}


function AudioController(object, playAudio, loop=true){
    if(loop){
        object.audio.loop = true;
    }
    else{
        object.audio.loop = false;
    }

    if(playAudio){
        object.audio.play();
    }
    else{
        object.audio.pause();
        object.audio.currentTime = 0;
    }

    if(audioMuted){
        object.audio.muted = true;
    }
    else{
        object.audio.muted = false;
    }
}

function StartFestival(){
    //Blinking
    Blinking("end");

    //Hide UI elements
    document.getElementById("quest_ui").style.opacity = 0;
    document.getElementById("dn_slider").style.opacity = 0;
    document.getElementById("help").style.opacity = 0;

    if(document.getElementById("dialogue")){
        document.getElementById("dialogue").style.opacity = 0;
    }
    if(document.getElementById("interaction")){
        document.getElementById("interaction").style.opacity = 0;
    }
    

    //Check every s seconds if Blinking() is done
    let interval = setInterval(function(){
        if(blinkingDone){
            clearInterval(interval);
            
            //Disables being able to click in movement js
            festival = true;

            //Change camera position and rotation
            camera.position.set(-23,DISTANCE_GROUND,23);
            fpcontrols.lookAt(-26, 0, 20);

            //Remove all npc 1 from scene
            let tempList = [];
            scene.traverse(function(child){
                if(child.type == "Group"){
                    if(child.property == "npc"){
                        tempList.push(child);
                    }
                }
            });
            tempList.forEach(element => {
                scene.remove(element);
            });

            //Add festival items from json list (also npc 2)
            const loader = new GLTFLoader();
            //Loop over the model json file
            festivalModels.forEach(element => {
            //If the object has property show, add it to the scene
                loader.load(element.src, function (gltf){
                    const model = gltf.scene;
                    model.position.set(element.x_pos, element.y_pos, element.z_pos);
                    model.rotation.set(element.x_rot*(Math.PI/180), element.y_rot*(Math.PI/180), element.z_rot*(Math.PI/180));
                    model.scale.set(element.x_scale, element.y_scale, element.z_scale);
                    model.name = element.name;
                    model.model_id = element.model_id;
        
                    model.property = element.property;
                    model.npc = element.npc;
                    if(model.property == "show"){
                        if(model.npc == "true"){
                            model.mixer = new THREE.AnimationMixer(model);
                            model.clips = gltf.animations;
                            model.clip = THREE.AnimationClip.findByName(model.clips, "Idle");
                            model.action = model.mixer.clipAction(model.clip);
                            model.mixer.timeScale = 1.2;
                            model.action.play();
                        }
                        festivalList.push(model);
                        scene.add(model);
                    }
                });
            }); 
            
            //Change audio
            bgAudio.src = "../audio/bg2.ogg";
            bgAudio.play();

            //Festival npc's sounds
            LinneAudio.loop = true; LinneAudio.play(); LinneAudio.volume = 0.6;
            IdaAudio.loop = true; IdaAudio.play();
            RolfeAudio.loop = true; RolfeAudio.play(); RolfeAudio.volume = 0.5;
            LejoAudio.loop = true; LejoAudio.play(); LejoAudio.volume = 1;
            KalieAudio.loop = true; KalieAudio.play();            

            //Disable black screen
            setTimeout(function(){
                document.documentElement.style.setProperty('--opacity', "0");
                document.getElementById("blink").style.display = "none";
            }, 1500)

            //After x seconds end application
            setTimeout(function(){
                EndApplication();
            }, festivalTime)
        }           
    }, 1000); //50 seconds
}

function EndApplication(){
    localStorage.setItem("festival", JSON.stringify(festivalModels));
    window.location.href = "end.html";
}

window.EndApplication = EndApplication;

export{
    Blinking,
    AnimationController, 
    animationDone,
    AudioController,
    StartFestival, 
    festival,
    festivalList,
    bgAudio, LinneAudio, IdaAudio, RolfeAudio, LejoAudio, KalieAudio 
}