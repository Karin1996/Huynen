function Blinking(phase){
    console.log("blinking");
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

export{
    Blinking
}