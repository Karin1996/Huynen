//SCRIPT FOR DAY AND NIGHT CYCLE
import {
    dirLight, 
    dirLight2,
    THREE,
} from "../js/scene_setup";

let slider = document.getElementById("slider");
let fill = document.getElementById("fill");
let bar = document.getElementById("bar");

let timer = 5000; //time in milliseconds
let increase = slider.width / timer; //the stepsize that needs to be taken to get to the endposition in x time
let widthAndMargin = 0; //save the width and margin that the elements need to have in this var (css doesnt read small int values)
let granularity = 30; //Smoothness of slider movement / delay

let percentage = 0; //For the lerping of lights
let percentage_step = 1 / (timer / granularity); //1 is full 100 percent
let dirLight_step = percentage_step / dirLight.intensity; //Amount of steps the light intensity needs to decrease per cycle
let dirLight2_step = percentage_step / dirLight2.intensity; 

let startColor = new THREE.Color(0xa6c8ff);
let endColor = new THREE.Color(0xFF0000);



function Cycle(){
    //Show the slider UI
    document.getElementById("dn_slider").style.opacity = 1;
    
    //Every x seconds execute
    let interval = setInterval(function(){
        //Change slider
        widthAndMargin += increase * granularity;
        fill.style.width = widthAndMargin + "px";
        bar.style.marginLeft = widthAndMargin + "px";

        //Change lights, intensity
        dirLight.intensity -= dirLight_step;
        dirLight2.intensity -= dirLight2_step;

        //intensity cannot go under 0
        dirLight.intensity = Math.max(0, dirLight.intensity);
        dirLight2.intensity = Math.max(0, dirLight2.intensity);

        //Change lights, color
        percentage += percentage_step;
        if(percentage < 1){
            dirLight.color.lerpColors(startColor, endColor, percentage);
            dirLight2.color.lerpColors(startColor, endColor, percentage);
        }
        else{
            //not lerping anymore, make sure it has correct colors
            dirLight.color.setHex(endColor);
            dirLight2.color.setHex(endColor);
        }
       
        //Change lights, position
        //dirLight.position.x = dirLight.position.x -= increase;
        //dirLight2.position.x = dirLight.position.x -= increase;

        //Cycle is done, end interval
        if (widthAndMargin >= slider.width) {
            clearInterval(interval);
        }
    }, granularity);
}

export{
    Cycle
}