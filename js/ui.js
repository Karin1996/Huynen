//SCRIPT TO MAKE AND MUTATE ALL THE UI ELEMENTS

//Create dialogue div
dialogue = document.createElement('div');
dialogue.setAttribute("id", "dialogue");
document.body.appendChild(dialogue);
//Fill dialogue div with correct information
if(document.getElementById("dialogue")){
    let dialogue = document.getElementById("dialogue");
    
    //Create person name element and fill with the correct information
    dialoguePerson = document.createElement('h1');
    dialoguePerson.innerHTML = "HALLLOOO";
    dialoguePerson.setAttribute("id", "dialoguePerson");

    //Create dialogue description element and fill with the correct information
    dialogueDescription = document.createElement('p');
    dialogueDescription.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel ex luctus, tincidunt mi non, tincidunt mi. Aenean porttitor nisl vulputate eros viverra, aliquam scelerisque augue vestibulum. Phasellus velit dolor, cursus quis tincidunt in, venenatis quis justo. Proin gravida orci est, sit amet suscipit est gravida eget. Curabitur consequat semper mattis. Morbi pellentesque dolor sit amet nibh dapibus, et accumsan ipsum ornare. Cras tristique, turpis a efficitur congue, velit arcu pellentesque diam, vitae aliquet lectus tellus sit amet augue. ";
    dialogueDescription.setAttribute("id", "dialogueDescription");
    
    dialogue.appendChild(dialoguePerson);
    dialogue.appendChild(dialogueDescription);
}