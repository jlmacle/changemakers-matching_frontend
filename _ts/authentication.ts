let username_is_valid:boolean = false;
let password_is_valid:boolean = false;

/**
 * Function used to check if the username is acceptable.
 *  ➡️ Witnessed a case where the fields were empty (by selecting and suppressing), 
 *      and the submit button was enabled even so.
        ➡️ The issue was solved at HTML level.
 */
function checkUsername() {
    // "Make sure your usernames/user IDs are case-insensitive."
    // AppSecurity: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#user-ids
    let debug = false;

    let username = document.getElementById("username") as HTMLInputElement; 
    let submit_button = document.getElementById("auth-form-creation-submit") as HTMLButtonElement;
    
    // "Input" being the event, typing an invalid character, as a first input, was not detected .
    // "keyup" solved the issue.
    username?.addEventListener("keyup", function(event){
        let username_error = document.getElementById("username_error") as HTMLElement;    
        
        if (username?.value && username_error) {  
            username.value = username.value.toLowerCase(); // "Make sure your usernames/user IDs are case-insensitive."
            if (username.value.search(/\W/) !== -1) { // Equivalent to [^A-Za-z0-9_]
                    if (debug) console.debug("Invalid character. The username can only contain lowercase letters without accents, numbers and underscores.");
                    username_error.innerHTML = "⚠️ Invalid character present. <br>The username can only contain lowercase letters without accents, numbers and underscores.";
                    submit_button.disabled = true;
                    username_is_valid = false;
                }    
                
                else if (username.value.length < 4) {
                    if (debug) console.debug("Username is too short");
                    username_error.innerHTML = "⚠️ The username must be at least 4 characters long, and in lowercase.";
                    submit_button.disabled = true;
                    username_is_valid = false;
                }
                        
                else {
                    if (debug) console.debug("The username is valid:");
                    username_error.innerHTML = "✅ The username is valid.";               
                    username_is_valid = true;
                    // Still need to check if the password is valid before enabling the submit button.
                    if (username_is_valid && password_is_valid) submit_button.disabled = false;
                }
        }
        else if (debug) 
        {
            console.debug("(username?.value && username_error) has false for value.");
            console.debug("username?.value = " + username?.value);
            console.debug("username_error = " + username_error);
            console.debug("End of : (username?.value && username_error) has false for value.");
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

    let password = document.getElementById("password") as HTMLInputElement; 
    let submit_button = document.getElementById("auth-form-creation-submit") as HTMLButtonElement;

    password?.addEventListener("keyup", function(event){                
        let password_error = document.getElementById("password_error");  
        
        // "Minimum length of the passwords should be enforced by the application. 
        // Passwords shorter than 8 characters are considered to be weak (NIST SP800-63B).
        // Maximum password length should not be set too low, as it will prevent users from creating passphrases. 
        // A common maximum length is 64 characters due to limitations in certain hashing algorithms"
        // AppSecurity: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#implement-proper-password-strength-controls 

        if (password?.value && password_error) {
            if (password.value.length < 8) {
                if (debug) console.debug("Password is too short");
                password_error.innerHTML = "⚠️ The password should be at least 8 characters long.";
                submit_button.disabled = true;          
                password_is_valid = false;      
            }        
            else if (password.value.length >=64) {
                if (debug) console.debug("Password is too long");
                password_error.innerHTML = "⚠️ The password should be less than 64 characters long.";
                submit_button.disabled = true;          
                password_is_valid = false;      
            }   
            
            else {
                if (debug) console.debug("The password is valid.");
                // "There should be no password composition rules limiting the type of characters permitted."
                // AppSecurity: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#implement-proper-password-strength-controls
                password_error.innerHTML = "✅ The password is valid.";
                password_is_valid = true;
                // Still need to check if the username is valid before enabling the submit button.
                if (username_is_valid && password_is_valid) submit_button.disabled = false;
            }

        }
        else {
            if (debug) {
                console.debug("(password?.value && password_error) has false for value.");
                console.debug("password?.value = " + password?.value);
                console.debug("password_error = " + password_error);
                console.debug("End of : (password?.value && password_error) has false for value.");
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
function display_project_view(username: string){
    // Toggling the visibility of the authentication form
    let auth_form_elem = document.getElementById("new-account_proj-rep") as HTMLElement;
    auth_form_elem.style.display = "none";
              
    // Welcome message
    let welcome_elem = document.getElementById("welcome-container2") as HTMLElement;
    let html_to_add =`<div aria-hidden="true">Welcome, ${username}</div>
                      <div id="logout"><a id="logout-link" href="javascript:void(0)" onclick="logout()" >Logout</a></div>`
    welcome_elem.innerHTML = html_to_add;

    // Toggling the visibility of the project main content
    let projects_elem = document.getElementById("projects-main-content") as HTMLElement;
    projects_elem.style.display = "block";
}

// TODO: to re-work the cookie part minding the security aspects
document.addEventListener("DOMContentLoaded", function(event){
    console.debug('Entering addEventListener("DOMContentLoaded") function');
    let debug = true;

    let cookie = document.cookie;
    if (cookie) {
        let username_part = cookie.split(";")[0];
        if (debug) console.debug("username_part = " + username_part);
        let username = username_part.split("=")[1];
        if (username !== "") display_project_view(username);
    }
    

});

/**
 * Function used to push the username and password to the backend.
 * @param event The event that triggered the function.
 * @param url The url to send the data to.
 * 
 */
function sign_up_data_processing(event: Event, url: string) 
{   let debug = true;

    event.preventDefault(); // to avoid unexpected network behaviors causing network errors
    let username_elem = document.getElementById("username") as HTMLInputElement;
    let password_elem = document.getElementById("password") as HTMLInputElement; 
    const username = username_elem.value;
    const password = password_elem.value;                           

    if (!username || !password) // if username or password are empty or null
    
    {
        let submit_elem = document.getElementById("auth-form-creation-submit") as HTMLButtonElement;
        submit_elem.disabled = false;
        if (debug) console.debug("Username or password are empty. Treated in HTML page.");
    }
    else{
        if (debug) console.debug("Entering sign_up_data_processing() function");
        fetch (url, {
            method:'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({username: username, password: password})
        })
        .then(response => response.text())
        .then(string_to_sanitize => {          
            // TODO: Setting a session cookie
            // AppSecurity: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html

            // TODO: (when using HTTPS)
            // AppSecurity: https://owasp.org/www-community/controls/SecureCookieAttribute
            // "The purpose of the secure attribute is to prevent cookies from being observed by unauthorized parties 
            // due to the transmission of the cookie in clear text. 
            // To accomplish this goal, browsers which support the secure attribute 
            // will only send cookies with the secure attribute when the request is going to an HTTPS page."

            // temp cookie for testing (to be done better later)
            document.cookie = `username=${username}; path=/; max-age=3600;`;
            if (debug) console.debug("Cookie set: " + document.cookie);

            display_project_view(username);          
            
            })
        .catch(error => console.debug(error));
    }
}

/* Listener that checks if username/password can be sent to the backend */
let auth_form_submit = document.getElementById("auth-form-creation-submit") as HTMLButtonElement;
auth_form_submit?.addEventListener("click", (event) => sign_up_data_processing(event,"http://127.0.0.1:8080/representatives/new-account"));


function logout(){
    let link = document.getElementById("logout-link") as HTMLElement;
    link.style.backgroundColor = "purple";

    // Removing the HTML from the welcome message
    let welcome_container2 = document.getElementById("welcome-container2") as HTMLElement;
    welcome_container2.innerHTML="";

    // Toggling the visibility of the projects main content
    let projects_main_content = document.getElementById("projects-main-content") as HTMLElement;
    projects_main_content.style.display = 'none';

    // Toggling the visibility of the new account area
    let new_account_proj_rep = document.getElementById("new-account_proj-rep") as HTMLElement;
    new_account_proj_rep.style.display = 'block';

    // Removing the usernama data (TODO: to be done better later)
    document.cookie = "username=; path=/;";
    window.location.reload();
}


// Adding the event listeners for the logout link
// TODO: to understand the issues with the event listeners that seem to not work
let logout_link = document.getElementById("logout-link") as HTMLElement;
logout_link?.addEventListener("click",logout);
logout_link?.addEventListener("keydown", function(event){
    console.debug("Entering logout_link?.addEventListener('keydown') function");
    if (event.key == "Enter" || event.key == "") {
        logout();
    }
});