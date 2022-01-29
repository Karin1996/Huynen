window.addEventListener('load', function(){

    //Add click event to button
    document.getElementById("btn").addEventListener("click", function(){
        window.location.href = "index.html";
    });


    let festivalModels = localStorage.getItem("festival");
    if (festivalModels == null) {
        // invalid state
        window.location.href = "index.html";
        return;
    }
    festivalModels = JSON.parse(festivalModels);

    //Get the properties of the quest items 
    festivalModels.forEach(item => {
        if(item.quest_id){
            if(item.property == "hide"){
                document.getElementById(item.quest_id).classList.add("not_sacrified");
                document.getElementById(item.quest_id).getElementsByTagName("span")[0].innerHTML = "niet af";
            }
            else{
                document.getElementById(item.quest_id).classList.add("sacrified");
                document.getElementById(item.quest_id).getElementsByTagName("span")[0].innerHTML = "opgeofferd";
            }   
        }
    });

    //Remove the item from the local storage
    localStorage.removeItem("festival");
})

