import {addNewEventListnerForClickAndKeyboardNav } from './common.js';

/**
 * Function opening the modal used to differentiate project representatives from contributors.
 */
function openUserTypeOptionsModal(debug:boolean){      
    if (debug) console.debug("openUserTypeOptionsModal() called");
    //Switching the aria-hidden attribute to true to make the main content inaccessible to screen readers
    let toIgnoreWhenModal1IsOn = document.getElementsByClassName("to-ignore-when-modal1") as HTMLCollectionOf<HTMLElement>;   
    for(let elem of toIgnoreWhenModal1IsOn){
        elem.setAttribute("aria-hidden", "true");
    }

    let modal = document.getElementById("user-type-options-modal") as HTMLElement;
    modal.setAttribute("aria-hidden", "false");
    modal.style.display = "block";
    modal.focus();     
}
/* Listener for the opening of the modal Boolean for debug mode.  */
addNewEventListnerForClickAndKeyboardNav("new-account-or-login-access",openUserTypeOptionsModal, true);


/**
 * Function closing the modal used to differentiate project representatives from contributors.
 */
function closeUserTypeOptionsModal(debug:boolean){
    if (debug) console.debug("closeUserTypeOptionsModal() called");
    //Switching the aria-hidden attribute to false to make the main content accessible to screen readers
    let toIgnoreWhenModal1IsOn = document.getElementsByClassName("to-ignore-when-modal1") as HTMLCollectionOf<HTMLElement>;   
    for(let elem of toIgnoreWhenModal1IsOn){
        elem.setAttribute("aria-hidden", "false");
    }

    let modal = document.getElementById("user-type-options-modal") as HTMLElement;   
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";

    // Bringing the focus back the the button that triggered the modal
    let newAccountOrLoginAccess = document.getElementById("new-account-or-login-access");
    newAccountOrLoginAccess?.focus();
}

/* Listener for the closing of the modal. Boolean for debug */
addNewEventListnerForClickAndKeyboardNav("user-type-options-modal-closing", closeUserTypeOptionsModal, true);
// TODO: to solve the generic issue of firing several events in one keystroke for example.
// Current issue: closing and opening the modal with one keystroke.



// Adding an event listener to help with keyboard navigation 
// (a spacebar issue with a firefox version. Adding enter key in provision of another issue on another browser)
let linkToProjRepPage = document.getElementById("link-to-proj-rep-page") as HTMLElement;
linkToProjRepPage.addEventListener("keydown", function(event){
    if (event.key === "Enter" || event.key === " "){
        document.location.href = "../_html/new-accountProject-representative.html";
    }
})


