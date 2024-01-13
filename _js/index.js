"use strict";
/**
 * Function opening the modal used to differentiate project representatives from contributors.
 */
function openUserTypeOptionsModal() {
    //Switching the aria-hidden attribute to true to make the main content inaccessible to screen readers
    let to_ignore_when_modal1_elems = document.getElementsByClassName("to-ignore-when-modal1");
    for (let elem of to_ignore_when_modal1_elems) {
        elem.setAttribute("aria-hidden", "true");
    }
    let modal = document.getElementById("user-type-options-modal");
    modal.setAttribute("aria-hidden", "false");
    modal.style.visibility = "visible";
    modal.focus();
}
/* Listener for the opening of the modal */
let new_account_or_login_access = document.getElementById("new-account-or-login-access");
new_account_or_login_access === null || new_account_or_login_access === void 0 ? void 0 : new_account_or_login_access.addEventListener("click", openUserTypeOptionsModal);
/**
 * Function closing the modal used to differentiate project representatives from contributors.
 */
function closeUserTypeOptionsModal() {
    //Switching the aria-hidden attribute to false to make the main content inaccessible to screen readers
    let to_ignore_when_modal1_elems = document.getElementsByClassName("to-ignore-when-modal1");
    for (let elem of to_ignore_when_modal1_elems) {
        elem.setAttribute("aria-hidden", "false");
    }
    // Run into an unsolved issue using display ="none". Chose visibility="hidden" instead.
    let modal = document.getElementById("user-type-options-modal");
    modal.style.visibility = "hidden";
    modal.setAttribute("aria-hidden", "true");
    // Bringing the focus back the the button that triggered the modal
    let new_account_or_login_access = document.getElementById("new-account-or-login-access");
    new_account_or_login_access === null || new_account_or_login_access === void 0 ? void 0 : new_account_or_login_access.focus();
}
/* Listener for the closing of the modal */
let close_modal = document.getElementById("user-type-options_modal-closing");
close_modal === null || close_modal === void 0 ? void 0 : close_modal.addEventListener("click", closeUserTypeOptionsModal);
