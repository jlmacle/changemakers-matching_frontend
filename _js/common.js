"use strict";
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
        console.log(`Unexpected fontweight value: ${element.style.fontWeight}`);
    }
}
