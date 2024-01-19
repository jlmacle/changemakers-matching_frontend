
/**
 * Function opening the modal used to differentiate project representatives from contributors.
 */
function openUserTypeOptionsModal(){      
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

/* Listener for the opening of the modal */
let newAccountOrLoginAccess = document.getElementById("new-account-or-login-access") as HTMLButtonElement;
newAccountOrLoginAccess?.addEventListener("click", openUserTypeOptionsModal);


/**
 * Function closing the modal used to differentiate project representatives from contributors.
 */
function closeUserTypeOptionsModal(){
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

/* Listener for the closing of the modal */
let closeModal = document.getElementById("user-type-options-modal-closing") as HTMLElement;
closeModal?.addEventListener("click", closeUserTypeOptionsModal);

// Adding an event listener to help with keyboard navigation 
// (a spacebar issue with a firefox version. Adding enter key in provision of another issue on another browser)
let linkToProjRepPage = document.getElementById("link-to-proj-rep-page") as HTMLElement;
linkToProjRepPage.addEventListener("keydown", function(event){
    if (event.key === "Enter" || event.key === " "){
        document.location.href = "../_html/new-accountProject-representative.html";
    }
})
