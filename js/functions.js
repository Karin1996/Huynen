import {THREE, Render,} from "./scene_setup";
let animationDone = false;

function Blinking(phase){
    let animationTime = 3000;

    document.getElementById("blink").style.display = "flex";
    document.documentElement.style.setProperty('--duration', animationTime/1000+"s");

    document.getElementById("blink").children[0].classList.add("blink");
    document.getElementById("blink").children[1].classList.add("blink");

    if(phase == "end"){
        document.documentElement.style.setProperty('--direction', "reverse");
    }
    else{
        document.documentElement.style.setProperty('--direction', "normal");
    }
        
      
    setTimeout(function() {
        if(phase == "end"){
            document.documentElement.style.setProperty('--opacity', "1");
            document.documentElement.style.setProperty('--height', "50%")
        }
        else{
        document.documentElement.style.setProperty('--opacity', "0");
        document.documentElement.style.setProperty('--height', "0%")
        }
            setTimeout(function() {
                if(phase == "end"){
                    document.getElementById("blink").style.display = "flex";
                }
                else{
                    document.getElementById("blink").style.display = "none";
                }
            }, animationTime - 100);
    }, animationTime - 100);

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
}

export{
    Blinking,
    AnimationController, 
    animationDone,
    AudioController
}