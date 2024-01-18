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
/**
 * Function used to display the project view
 * @param username The username of the user
 */
function displayProjectView(username) {
    // Toggling the visibility of the authentication form
    let authFormElem = document.getElementById("new-accountProj-rep");
    authFormElem.style.display = "none";
    // Welcome message
    let welcomeElem = document.getElementById("welcome-container2");
    let htmlToAdd = `<div aria-hidden="true">Welcome, ${username}</div>
                      <div id="logout"><a id="logout-link" href="javascript:void(0)" onclick="logout()" >Logout</a></div>`;
    welcomeElem.innerHTML = htmlToAdd;
    // Toggling the visibility of the project main content
    let projectsElem = document.getElementById("projects-main-content");
    projectsElem.style.display = "block";
}
// TODO: to re-work the cookie part minding the security aspects
document.addEventListener("DOMContentLoaded", function (event) {
    console.debug('Entering addEventListener("DOMContentLoaded") function');
    let debug = true;
    let cookie = document.cookie;
    if (cookie) {
        let usernamePart = cookie.split(";")[0];
        if (debug)
            console.debug("usernamePart = " + usernamePart);
        let username = usernamePart.split("=")[1];
        if (username !== "")
            displayProjectView(username);
    }
});
/**
 * Function used to push the username and password to the backend.
 * @param event The event that triggered the function.
 * @param url The url to send the data to.
 *
 */
function signUpDataProcessing(event, url) {
    let debug = true;
    event.preventDefault(); // to avoid unexpected network behaviors causing network errors
    let usernameElem = document.getElementById("username");
    let passwordElem = document.getElementById("password");
    const username = usernameElem.value;
    const password = passwordElem.value;
    if (!username || !password) // if username or password are empty or null
     {
        let submitElem = document.getElementById("auth-form-creation-submit");
        submitElem.disabled = false;
        if (debug)
            console.debug("Username or password are empty. Treated in HTML page.");
    }
    else {
        if (debug)
            console.debug("Entering signUpDataProcessing() function");
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        })
            .then(response => response.text())
            .then(stringToSanitize => {
            // TODO: Setting a session cookie
            // AppSecurity: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_CheatSheet.html
            // TODO: (when using HTTPS)
            // AppSecurity: https://owasp.org/www-community/controls/SecureCookieAttribute
            // "The purpose of the secure attribute is to prevent cookies from being observed by unauthorized parties 
            // due to the transmission of the cookie in clear text. 
            // To accomplish this goal, browsers which support the secure attribute 
            // will only send cookies with the secure attribute when the request is going to an HTTPS page."
            // temp cookie for testing (to be done better later)
            document.cookie = `username=${username}; path=/; max-age=3600;`;
            if (debug)
                console.debug("Cookie set: " + document.cookie);
            displayProjectView(username);
        })
            .catch(error => console.debug(error));
    }
}
/* Listener that checks if username/password can be sent to the backend */
let authFormSubmit = document.getElementById("auth-form-creation-submit");
authFormSubmit?.addEventListener("click", (event) => signUpDataProcessing(event, "http://127.0.0.1:8080/representatives/new-account"));
function logout() {
    let link = document.getElementById("logout-link");
    link.style.backgroundColor = "purple";
    // Removing the HTML from the welcome message
    let welcomeContainer2 = document.getElementById("welcome-container2");
    welcomeContainer2.innerHTML = "";
    // Toggling the visibility of the projects main content
    let projectsMainContent = document.getElementById("projects-main-content");
    projectsMainContent.style.display = 'none';
    // Toggling the visibility of the new account area
    let newAccountProjRep = document.getElementById("new-accountProj-rep");
    newAccountProjRep.style.display = 'block';
    // Removing the usernama data (TODO: to be done better later)
    document.cookie = "username=; path=/;";
    window.location.reload();
}
// Adding the event listeners for the logout link
// TODO: to understand the issues with the event listeners that seem to not work
let logoutLink = document.getElementById("logout-link");
logoutLink?.addEventListener("click", logout);
logoutLink?.addEventListener("keydown", function (event) {
    console.debug("Entering logoutLink?.addEventListener('keydown') function");
    if (event.key == "Enter" || event.key == "") {
        logout();
    }
});
