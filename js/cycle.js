//SCRIPT FOR DAY AND NIGHT CYCLE
import {
    dirLight, 
    dirLight2,
    scene,
    THREE,
} from "../js/scene_setup";

import {
    skyboxes
} from "../js/loader"

let slider = document.getElementById("slider");
let fill = document.getElementById("fill");
let bar = document.getElementById("bar");

let timer = 3000; //time in milliseconds
let increase = slider.width / timer; //the stepsize that needs to be taken to get to the endposition in x time
let widthAndMargin = 0; //save the width and margin that the elements need to have in this var (css doesnt read small int values)
let granularity = 30; //Smoothness of slider movement / delay

let percentage = 0; //For the lerping of lights
let percentage_step = 1 / (timer / granularity); //1 is full 100 percent
let dirLight_step = percentage_step / dirLight.intensity; //Amount of steps the light intensity needs to decrease per cycle
let dirLight2_step = percentage_step / dirLight2.intensity; 

let startColor = new THREE.Color(0xa6c8ff);
let endColor = new THREE.Color(0x191680);

let startColorFog = new THREE.Color(0xc1dcf7);
let endColorFog = new THREE.Color(0x32546e);

let skybox1;
let skybox2;


function Cycle(){  
    //Show the slider UI
    document.getElementById("dn_slider").style.opacity = 1;
    
    //Every x seconds execute
    let interval = setInterval(function(){
        //Change slider
        widthAndMargin += increase * granularity;
        fill.style.width = widthAndMargin + "px";
        bar.style.marginLeft = widthAndMargin + "px";
        
        //Change skybox, fog and lights
        if(skyboxes[0].parent.name.toLowerCase() == "skybox1"){
            skybox1 = skyboxes[0]
            skybox2 = skyboxes[1]
        }
        else{
            skybox1 = skyboxes[1]
            skybox2 = skyboxes[0]
        }
        
        //Change lights, intensity
        dirLight.intensity -= dirLight_step;
        dirLight2.intensity -= dirLight2_step;
        //intensity cannot go under 0
        dirLight.intensity = Math.max(0, dirLight.intensity);
        dirLight2.intensity = Math.max(0, dirLight2.intensity);

        percentage += percentage_step;
        if(percentage < 1){
            //Change skyboxes opacity
            skybox1.material.opacity = skybox1.material.opacity - percentage_step;
            skybox2.material.opacity = skybox2.material.opacity + percentage_step;
            
            //Change fog, make more dense as the day progresses
            //scene.fog.density = scene.fog.density + (increase/1000);
            scene.fog.color.lerpColors(startColorFog, endColorFog, percentage);

            //Change color of the lights
            dirLight.color.lerpColors(startColor, endColor, percentage);
            dirLight2.color.lerpColors(startColor, endColor, percentage);
        }

        //Change lights, position
        dirLight.position.x = dirLight.position.x -= increase;
        dirLight2.position.x = dirLight.position.x -= increase;

        //Cycle is done, end interval
        if (widthAndMargin >= slider.width) {
            clearInterval(interval);
        }
    }, granularity);

    //WHEN CYCLE END START SACRIFICIAL FESTIVAL
}

export{
    Cycle
}