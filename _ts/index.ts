
/**
 * Function opening the modal used to differentiate project representatives from contributors.
 */
function openUserTypeOptionsModal(){  
    //Switching the aria-hidden attribute to true to make the main content inaccessible to screen readers
    let body_element = document.getElementById("body") as HTMLElement;
    body_element.setAttribute("aria-hidden", "true"); 
    // TODO : to set to false and link list to check on Narrator

    let modal = document.getElementById("user-type-options-modal") as HTMLElement;
    modal.setAttribute("aria-hidden", "false");
    modal.style.visibility = "visible"; 
    modal.focus();     
}

/* Listener for the opening of the modal */
let new_account_or_login_access = document.getElementById("new-account-or-login-access") as HTMLButtonElement;
new_account_or_login_access?.addEventListener("click", openUserTypeOptionsModal);


/**
 * Function closing the modal used to differentiate project representatives from contributors.
 */
function closeUserTypeOptionsModal(){
    // Run into an unsolved issue using display ="none". Chose visibility="hidden" instead.
    let modal = document.getElementById("user-type-options-modal") as HTMLElement;
    modal.style.visibility = "hidden";    
    modal.setAttribute("aria-hidden", "true");

    //Switching the aria-hidden attribute back to false
    let body_element = document.getElementById("body") as HTMLElement;
    body_element.setAttribute("aria-hidden", "false"); 

    // Bringing the focus back the the button that triggered the modal
    let new_account_or_login_access = document.getElementById("new-account-or-login-access");
    new_account_or_login_access?.focus();
}

/* Listener for the closing of the modal */
let close_modal = document.getElementById("user-type-options_modal-closing") as HTMLElement;
close_modal?.addEventListener("click", closeUserTypeOptionsModal);