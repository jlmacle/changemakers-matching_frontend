"use strict";
// https://code.visualstudio.com/docs/typescript/typescript-compiling
// Ctrl+Shift+B
/**
 * Function used to check if the username contains @
 */
function checkUsername() {
    let debug = true;
    let form = document.getElementById("contributor_auth_form");
    let submit_button = document.getElementById("contributor_auth_form_submit");
    form === null || form === void 0 ? void 0 : form.addEventListener("input", function (event) {
        let username = document.getElementById("username"); // To be able to access the value property
        let username_error = document.getElementById("username_error");
        submit_button.disabled = true;
        if ((username === null || username === void 0 ? void 0 : username.value) && username_error) {
            if (username.value.includes("@")) {
                if (debug)
                    console.log("Username contains @");
                username_error.innerHTML = "Username cannot contain @";
                submit_button.disabled = true;
            }
            else if (username.value.includes(" ")) {
                if (debug)
                    console.log("Username contains an empty space");
                username.value = username.value.trim();
                submit_button.disabled = true;
            }
            else if (username.value.trim().length == 0) {
                if (debug)
                    console.log("Username is empty");
                username_error.innerHTML = "Username cannot be empty";
                submit_button.disabled = true;
            }
            else {
                if (debug)
                    console.log("Username is valid");
                username_error.innerHTML = "A valid username has no @ and no empty spaces";
                // TODO: alphanumeric characters and underscore only. Min 3 characters, max 20 characters.
                submit_button.disabled = false;
            }
        }
        else {
            if (debug)
                console.log("username or username_error not found.");
        }
    });
}
//TODO: function trim field values
