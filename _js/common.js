"use strict";
/****************** Generic code for event listeners  ***********************/
// TODO: use of generic event listeners
function addNewEventListnerForClickAndKeyboardNav(elementId, functionCalledByTheEventListener) {
    let element = document.getElementById(elementId);
    element.addEventListener("click", functionCalledByTheEventListener);
    element.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            functionCalledByTheEventListener();
        }
    });
}
/****************** Toggle functions  ***********************/
/**
 * Function used to toggle the visibility of an element.
 * @param elementId the id of the element to toggle
 */
function toggleElementVisibility(elementId) {
    let element = document.getElementById(elementId);
    if (element.style.display == "block") {
        element.style.display = "none";
    }
    else if (element.style.display == "none") {
        element.style.display = "block";
    }
}
/**
 * Function used to toggle the font weight of an element from bold to normal and vice-versa.
 * @param elementId the id of the element to toggle
 */
function toggleElementBoldness(elementId) {
    let element = document.getElementById(elementId);
    if (element.style.fontWeight == "bold") {
        element.style.fontWeight = "normal";
    }
    else if (element.style.fontWeight == "normal") {
        element.style.fontWeight = "bold";
    }
    else {
        console.warn(`Unexpected fontweight value: ${element.style.fontWeight}`);
    }
}
/****************** Misc.  ***********************/
/**
 * Function used to get the time elapsed in milliseconds since 1970.
 * @returns
 */
function getAbsoluteTime() {
    console.debug("Entering getAbsoluteTime() function");
    const date = new Date();
    return date.getTime();
}
