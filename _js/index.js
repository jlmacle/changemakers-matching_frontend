"use strict";
/**
 * Function opening the modal used to differentiate project representatives from contributors.
 */
function openUserTypeOptionsModal() {
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
/* Listener for the opening of the modal */
let newAccountOrLoginAccess = document.getElementById("new-account-or-login-access");
newAccountOrLoginAccess?.addEventListener("click", openUserTypeOptionsModal);
/**
 * Function closing the modal used to differentiate project representatives from contributors.
 */
function closeUserTypeOptionsModal() {
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
/* Listener for the closing of the modal */
let closeModal = document.getElementById("user-type-options-modal-closing");
closeModal?.addEventListener("click", closeUserTypeOptionsModal);
