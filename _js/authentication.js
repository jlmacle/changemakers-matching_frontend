"use strict";
let usernameIsValid = false;
let passwordIsValid = false;
/**
 * Function used to check if the username is acceptable.
 *  ➡️ Witnessed a case where the fields were empty (by selecting and suppressing),
 *      and the submit button was enabled even so.
        ➡️ The issue was solved at HTML level.
 */
function checkUsername() {
    // "Make sure your usernames/user IDs are case-insensitive."
    // AppSecurity: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_CheatSheet.html#user-ids
    let debug = false;
    let username = document.getElementById("username");
    let submitButton = document.getElementById("auth-form-creation-submit");
    // "Input" being the event, typing an invalid character, as a first input, was not detected .
    // "keyup" solved the issue.
    username?.addEventListener("keyup", function (event) {
        let usernameError = document.getElementById("usernameError");
        if (username?.value && usernameError) {
            username.value = username.value.toLowerCase(); // "Make sure your usernames/user IDs are case-insensitive."
            if (username.value.search(/\W/) !== -1) { // Equivalent to [^A-Za-z0-9_]
                if (debug)
                    console.debug("Invalid character. The username can only contain lowercase letters without accents, numbers and underscores.");
                usernameError.innerHTML = "⚠️ Invalid character present. <br>The username can only contain lowercase letters without accents, numbers and underscores.";
                submitButton.disabled = true;
                usernameIsValid = false;
            }
            else if (username.value.length < 4) {
                if (debug)
                    console.debug("Username is too short");
                usernameError.innerHTML = "⚠️ The username must be at least 4 characters long, and in lowercase.";
                submitButton.disabled = true;
                usernameIsValid = false;
            }
            else {
                if (debug)
                    console.debug("The username is valid:");
                usernameError.innerHTML = "✅ The username is valid.";
                usernameIsValid = true;
                // Still need to check if the password is valid before enabling the submit button.
                if (usernameIsValid && passwordIsValid)
                    submitButton.disabled = false;
            }
        }
        else if (debug) {
            console.debug("(username?.value && usernameError) has false for value.");
            console.debug("username?.value = " + username?.value);
            console.debug("usernameError = " + usernameError);
            console.debug("End of : (username?.value && usernameError) has false for value.");
        }
    });
}
/* Listener for checking the username */
checkUsername();
/**
 * Function used to check if the password is acceptable.
 */
function checkPassword() {
    let debug = false;
    let password = document.getElementById("password");
    let submitButton = document.getElementById("auth-form-creation-submit");
    password?.addEventListener("keyup", function (event) {
        let passwordError = document.getElementById("passwordError");
        // "Minimum length of the passwords should be enforced by the application. 
        // Passwords shorter than 8 characters are considered to be weak (NIST SP800-63B).
        // Maximum password length should not be set too low, as it will prevent users from creating passphrases. 
        // A common maximum length is 64 characters due to limitations in certain hashing algorithms"
        // AppSecurity: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_CheatSheet.html#implement-proper-password-strength-controls 
        if (password?.value && passwordError) {
            if (password.value.length < 8) {
                if (debug)
                    console.debug("Password is too short");
                passwordError.innerHTML = "⚠️ The password should be at least 8 characters long.";
                submitButton.disabled = true;
                passwordIsValid = false;
            }
            else if (password.value.length >= 64) {
                if (debug)
                    console.debug("Password is too long");
                passwordError.innerHTML = "⚠️ The password should be less than 64 characters long.";
                submitButton.disabled = true;
                passwordIsValid = false;
            }
            else {
                if (debug)
                    console.debug("The password is valid.");
                // "There should be no password composition rules limiting the type of characters permitted."
                // AppSecurity: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_CheatSheet.html#implement-proper-password-strength-controls
                passwordError.innerHTML = "✅ The password is valid.";
                passwordIsValid = true;
                // Still need to check if the username is valid before enabling the submit button.
                if (usernameIsValid && passwordIsValid)
                    submitButton.disabled = false;
            }
        }
        else {
            if (debug) {
                console.debug("(password?.value && passwordError) has false for value.");
                console.debug("password?.value = " + password?.value);
                console.debug("passwordError = " + passwordError);
                console.debug("End of : (password?.value && passwordError) has false for value.");
            }
        }
    });
}
/* Listener for checking the password */
checkPassword();



