/**
 * Function used to toggle the visibility of an element.
 * @param elementId the id of the element to toggle
 */
function toggleElementVisibility(elementId: string){
    let element = document.getElementById(elementId) as HTMLElement;

    if (element.style.display == "block"){
        element.style.display = "none";
    }
    else if (element.style.display == "none"){
        element.style.display = "block";
    }
}

/**
 * Function used to toggle the font weigth of an element from bold to normal and vice-versa.
 * @param elementId the id of the element to toggle
 */
function toggleElementBoldness(elementId: string){
    let element = document.getElementById(elementId) as HTMLElement;

    if(element.style.fontWeight == "bold"){
        console.log("bold to normal");
        element.style.fontWeight = "normal";
    }

    else if (element.style.fontWeight ==  "normal"){
        console.log("normal to bold");
        element.style.fontWeight = "bold";
    }
    else{
        console.log(`Fontweight value: ${element.style.fontWeight}`);
    }

}



