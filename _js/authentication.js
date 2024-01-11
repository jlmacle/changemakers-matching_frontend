"use strict";
/**
 * Function opening the modal useful for differentiating project representatives from contributors.
 */
function openUserTypeOptionsModal() {
    //Switching the aria-hidden attribute to true to make the main content inaccessible to screen readers
    let body_element = document.getElementById("body");
    body_element.setAttribute("aria-hidden", "true");
    // TODO : to set to false and link list to check on Narrator
    // Switching the modal aria-hidden attribute to false 
    let modal_content = document.getElementById("user-type-options_modal-content");
    modal_content.setAttribute("aria-hidden", "false");
    modal_content.focus();
    // TODO: to test after focus
    let modal = document.getElementById("user-type-options-modal");
    modal.style.visibility = "visible";
    let body = document.getElementById("body");
    console.log('modal_content.getAttribute("aria-hidden")', modal_content.getAttribute("aria-hidden"));
    console.log('body.getAttribute("aria-hidden")', body.getAttribute("aria-hidden"));
    //Giving focus to the closing button of the modal
    modal_content.focus();
}
/**
 * Function closing the modal useful for differentiating project representatives from contributors.
 */
function closeUserTypeOptionsModal() {
    // Run into an unsolved issue using display ="none". Chose visibility="hidden" instead.
    let modal = document.getElementById("user-type-options-modal");
    modal.setAttribute("visibility", "hidden");
    // document.getElementById("user-type-options-modal").style.visibility = "hidden";
    //Switching the aria-hidden attribute back to false
    let body_element = document.getElementById("body");
    body_element.setAttribute("aria-hidden", "false");
}
/* **************** Username / Password ************** */
let username_is_valid = false;
let password_is_valid = false;
/**
 * Function used to check if the username is acceptable.
 *  ➡️ Witnessed a case where the valid fields were empty (by selecting and suppressing), and had an issue with the submit button enabled even so.
    ➡️ Treated at HTML level.
 */
function checkUsername() {
    let debug = true;
    let username = document.getElementById("username");
    let submit_button = document.getElementById("auth-form-submit");
    // Typing an invalid character was not detected when being the first input, when "input" was the event.
    // "keyup" solved the issue.
    username === null || username === void 0 ? void 0 : username.addEventListener("keyup", function (event) {
        let username_error = document.getElementById("username_error");
        console.log("username?.value = " + (username === null || username === void 0 ? void 0 : username.value));
        if ((username === null || username === void 0 ? void 0 : username.value) && username_error) {
            if (username.value.search(/\W/) !== -1) { // Equivalent to [^A-Za-z0-9_]
                if (debug)
                    console.log("Invalid character. The username can only contain unaccentuated letters, numbers and underscores.");
                username_error.innerHTML = "⚠️ Invalid character present. <br>The username can only contain unaccentuated letters, numbers and underscores.";
                submit_button.disabled = true;
                username_is_valid = false;
            }
            else if (username.value.length < 4) {
                if (debug)
                    console.log("Username is too short");
                username_error.innerHTML = "⚠️ The username should be at least 4 characters long.";
                submit_button.disabled = true;
                username_is_valid = false;
            }
            else {
                if (debug)
                    console.log("The username is valid.");
                username_error.innerHTML = "✅ The username is valid.";
                username_is_valid = true;
                // Still need to check if the password is valid before enabling the submit button.
                if (username_is_valid && password_is_valid)
                    submit_button.disabled = false;
            }
        }
        else {
            if (debug) {
                console.log("(username?.value && username_error) has false for value.");
                console.log("username?.value = " + (username === null || username === void 0 ? void 0 : username.value));
                console.log("username_error = " + username_error);
                console.log("End of : (username?.value && username_error) has false for value.");
            }
        }
    });
}
/**
 * Function used to check if the password is acceptable.
 */
function checkPassword() {
    let debug = true;
    let password = document.getElementById("password");
    let submit_button = document.getElementById("auth-form-submit");
    // TODO: thorough testing of the special characters
    // https://owasp.org/www-community/password-special-characters
    const psswd_special_characters = [];
    password === null || password === void 0 ? void 0 : password.addEventListener("keyup", function (event) {
        let password_error = document.getElementById("password_error");
        // "Minimum length of the passwords should be enforced by the application. 
        // Passwords shorter than 8 characters are considered to be weak (NIST SP800-63B).
        // Maximum password length should not be set too low, as it will prevent users from creating passphrases. 
        // A common maximum length is 64 characters due to limitations in certain hashing algorithms"
        // https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html  
        if ((password === null || password === void 0 ? void 0 : password.value) && password_error) {
            if (password.value.length < 8) {
                if (debug)
                    console.log("Password is too short");
                password_error.innerHTML = "⚠️ The password should be at least 8 characters long.";
                submit_button.disabled = true;
                password_is_valid = false;
            }
            else if (password.value.length >= 64) {
                if (debug)
                    console.log("Password is too long");
                password_error.innerHTML = "⚠️ The password should be less than 64 characters long.";
                submit_button.disabled = true;
                password_is_valid = false;
            }
            //TODO : to limit the special characters to the ones that are allowed
            else {
                if (debug)
                    console.log("This password is valid for this demo.");
                password_error.innerHTML = "✅ This password is valid for this demo.";
                password_is_valid = true;
                // Still need to check if the username is valid before enabling the submit button.
                if (username_is_valid && password_is_valid)
                    submit_button.disabled = false;
            }
        }
        else {
            if (debug) {
                console.log("(password?.value && password_error) has false for value.");
                console.log("password?.value = " + (password === null || password === void 0 ? void 0 : password.value));
                console.log("password_error = " + password_error);
                console.log("End of : (password?.value && password_error) has false for value.");
            }
        }
    });
}