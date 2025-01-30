import { addElementEventListenerForClickAndKeyboardNav } from './common.mjs';

/**
 * Function opening the modal used to differentiate project representatives from contributors.
 * debug A boolean for debug mode.
 */
function openUserTypeOptionsModal(debug: boolean) {
    if (debug) console.debug("openUserTypeOptionsModal() called");
    // Switching the aria-hidden attribute to true to make the content below the modal inaccessible to screen readers
    // The elements to hide from the screen reader have been given the class name "to-ignore-when-modal1"
    let toIgnoreWhenModal1IsOn = document.getElementsByClassName("to-ignore-when-modal1") as HTMLCollectionOf<HTMLElement>;
    for (let elem of toIgnoreWhenModal1IsOn) {
        elem.setAttribute("aria-hidden", "true");
    }

    let modal = document.getElementById("userTypeOptions-modal-container") as HTMLElement;
    modal.setAttribute("aria-hidden", "false");
    modal.style.display = "block";
    modal.focus();
    
}

/**
 * Function closing the modal used to differentiate project representatives from contributors.
 * debug A boolean for debug mode.
 */
function closeUserTypeOptionsModal(debug: boolean) {
    if (debug) console.debug("closeUserTypeOptionsModal() called");
    //Switching the aria-hidden attribute to false to make the content below the modal accessible to screen readers
    let toIgnoreWhenModal1IsOn = document.getElementsByClassName("to-ignore-when-modal1") as HTMLCollectionOf<HTMLElement>;
    for (let elem of toIgnoreWhenModal1IsOn) {
        elem.setAttribute("aria-hidden", "false");
    }

    let modal = document.getElementById("userTypeOptions-modal-container") as HTMLElement;
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";

    // Bringing the focus back to the button that triggered the modal
    let newAccountOrLoginAccess = document.getElementById("newAccountOrLogin-button");
    newAccountOrLoginAccess?.focus();
}

/**
 * Function used to re-direct toward the project representative page 
 */
function redirectToProjRepPage() {
    document.location.href = "./www/_html/new-accountProject-representative.html";
}

/****************************** Adding the event listeners to the index.html page  ********************************/

/* Listener for the opening of the modal. Boolean for debug mode. */
addElementEventListenerForClickAndKeyboardNav("newAccountOrLogin-button", openUserTypeOptionsModal, true);

/* Listener for the closing of the modal. Boolean for debug mode. */
addElementEventListenerForClickAndKeyboardNav("userTypeOptions-modal-closing", closeUserTypeOptionsModal, true);

/* Listener for the re-direction toward the project representative page. Boolean for debug mode. */
addElementEventListenerForClickAndKeyboardNav("link-to-proj-rep-page", redirectToProjRepPage, true);

/* listeners for homepage and footer to be found in common.ts */


