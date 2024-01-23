import { addElementEventListenerForClickAndKeyboardNav } from './common.js';
/**
 * Function opening the modal used to differentiate project representatives from contributors.
 * debug A boolean for debug mode.
 */
function openUserTypeOptionsModal(debug) {
    if (debug)
        console.debug("openUserTypeOptionsModal() called");
    //Switching the aria-hidden attribute to true to make the main content inaccessible to screen readers
    let toIgnoreWhenModal1IsOn = document.getElementsByClassName("to-ignore-when-modal1");
    for (let elem of toIgnoreWhenModal1IsOn) {
        elem.setAttribute("aria-hidden", "true");
    }
    let modal = document.getElementById("user-type-options-modal");
    modal.setAttribute("aria-hidden", "false");
    modal.style.display = "block";
    modal.focus();
}
/**
 * Function closing the modal used to differentiate project representatives from contributors.
 * debug A boolean for debug mode.
 */
function closeUserTypeOptionsModal(debug) {
    if (debug)
        console.debug("closeUserTypeOptionsModal() called");
    //Switching the aria-hidden attribute to false to make the main content accessible to screen readers
    let toIgnoreWhenModal1IsOn = document.getElementsByClassName("to-ignore-when-modal1");
    for (let elem of toIgnoreWhenModal1IsOn) {
        elem.setAttribute("aria-hidden", "false");
    }
    let modal = document.getElementById("user-type-options-modal");
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";
    // Bringing the focus back the the button that triggered the modal
    let newAccountOrLoginAccess = document.getElementById("new-account-or-login-access");
    newAccountOrLoginAccess?.focus();
}
/**
 * Function used to re-direct toward the project representative page
 */
function redirectToProjRepPage() {
    document.location.href = "../_html/new-accountProject-representative.html";
}
/****************************** Adding the event listeners to the index.html page  ********************************/
/* Listener for the opening of the modal. Boolean for debug mode. */
addElementEventListenerForClickAndKeyboardNav("new-account-or-login-access", openUserTypeOptionsModal, true);
/* Listener for the closing of the modal. Boolean for debug mode. */
addElementEventListenerForClickAndKeyboardNav("user-type-options-modal-closing", closeUserTypeOptionsModal, true);
/* Listener for being re-directed toward the project representative page. Boolean for debug mode. */
addElementEventListenerForClickAndKeyboardNav("link-to-proj-rep-page", redirectToProjRepPage, true);
/* listeners for homepage and footer to be found in common.ts */
