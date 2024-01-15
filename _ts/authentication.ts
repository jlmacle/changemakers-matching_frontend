let username_is_valid:boolean = false;
let password_is_valid:boolean = false;

/**
 * Function used to check if the username is acceptable.
 *  ➡️ Witnessed a case where the valid fields were empty (by selecting and suppressing), and had an issue with the submit button enabled even so.
    ➡️ Treated at HTML level.
 */
function checkUsername() {
    let debug = false;

    let username = document.getElementById("username") as HTMLInputElement; 
    let submit_button = document.getElementById("auth-form-creation-submit") as HTMLButtonElement;

    
    // Typing an invalid character was not detected when being the first input, when "input" was the event.
    // "keyup" solved the issue.
    username?.addEventListener("keyup", function(event){
        let username_error = document.getElementById("username_error");    
        
        if (username?.value && username_error) {  
           if (username.value.search(/\W/) !== -1) { // Equivalent to [^A-Za-z0-9_]
                if (debug) console.log("Invalid character. The username can only contain letters without accents, numbers and underscores.");
                username_error.innerHTML = "⚠️ Invalid character present. <br>The username can only contain letters without accents, numbers and underscores.";
                submit_button.disabled = true;
                username_is_valid = false;
            }    
            
            else if (username.value.length < 4) {
                if (debug) console.log("Username is too short");
                username_error.innerHTML = "⚠️ The username should be at least 4 characters long.";
                submit_button.disabled = true;
                username_is_valid = false;
            }
                      
            else {
                if (debug) console.log("The username is valid.");
                username_error.innerHTML = "✅ The username is valid.";               
                username_is_valid = true;
                // Still need to check if the password is valid before enabling the submit button.
                if (username_is_valid && password_is_valid) submit_button.disabled = false;
            }
        }
        else if (debug) 
        {
            console.log("(username?.value && username_error) has false for value.");
            console.log("username?.value = " + username?.value);
            console.log("username_error = " + username_error);
            console.log("End of : (username?.value && username_error) has false for value.");
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
    // TODO: thorough testing of the special characters
    // https://owasp.org/www-community/password-special-characters
    const psswd_special_characters : string[] = [];

    password?.addEventListener("keyup", function(event){                
        let password_error = document.getElementById("password_error");  
        
        // "Minimum length of the passwords should be enforced by the application. 
        // Passwords shorter than 8 characters are considered to be weak (NIST SP800-63B).
        // Maximum password length should not be set too low, as it will prevent users from creating passphrases. 
        // A common maximum length is 64 characters due to limitations in certain hashing algorithms"
        // https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html  

        if (password?.value && password_error) {
            if (password.value.length < 8) {
                if (debug) console.log("Password is too short");
                password_error.innerHTML = "⚠️ The password should be at least 8 characters long.";
                submit_button.disabled = true;          
                password_is_valid = false;      
            }        
            else if (password.value.length >=64) {
                if (debug) console.log("Password is too long");
                password_error.innerHTML = "⚠️ The password should be less than 64 characters long.";
                submit_button.disabled = true;          
                password_is_valid = false;      
            }
            //TODO : to limit the special characters to the ones that are allowed
            
            
            else {
                if (debug) console.log("This password is valid for this demo.");
                password_error.innerHTML = "✅ This password is valid for this demo.";
                password_is_valid = true;
                // Still need to check if the username is valid before enabling the submit button.
                if (username_is_valid && password_is_valid) submit_button.disabled = false;
            }

        }
        else {
            if (debug) {
                console.log("(password?.value && password_error) has false for value.");
                console.log("password?.value = " + password?.value);
                console.log("password_error = " + password_error);
                console.log("End of : (password?.value && password_error) has false for value.");
            }
        }
    });   
    
}

/* Listener for checking the password */
checkPassword();


/**
 * Function used to push the username and password to the backend.
 * @param event The event that triggered the function.
 * @param url The url to send the data to.
 * 
 */
function push_sign_up_data(event: Event, url: string) 
{   
    event.preventDefault(); // to avoid unexpected network behaviors causing network errors
    let username_elem = document.getElementById("username") as HTMLInputElement;
    let password_elem = document.getElementById("password") as HTMLInputElement; 
    const username = username_elem.value;
    const password = password_elem.value;                           

    if (!username || !password) // if username or password are empty or null
    
    {
        let submit_elem = document.getElementById("auth-form-creation-submit") as HTMLButtonElement;
        submit_elem.disabled = false;
        console.log("username or password are empty. Treated in HTML page.");
    }
    else{
        console.log("Entering push_sign_up_data() function");
        fetch (url, {
            method:'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({username: username, password: password})
        })
        .then(response => response.text())
        .then(string_to_sanitize => {          
            // Setting a session cookie
            // https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
            
            //Toggling the visibility of the authentication form
            let auth_form_elem = document.getElementById("new-account_proj-rep") as HTMLElement;
            auth_form_elem.style.display = "none";
            
            //TODO: from JSON string data to object to stylizable HTML
            // "you can sanitize strings by executing the following code:"
            // https://www.npmjs.com/package/dompurify
            // string_to_sanitize = string_to_sanitize.replace(',',',<br>'); // to allow a line break for the data
            // const sanitized_string = dompurify.sanitize(string_to_sanitize);                           
            
            // Welcome message
            let welcome_elem = document.getElementById("welcome-container2") as HTMLElement;
            let html_to_add =`<div>Welcome, ${username}</div>
                              <div id="logout"><a href="./" onclick="logout()">Logout</a></div>`
            welcome_elem.innerHTML = html_to_add;

            // Toggling the visibility of the project main content
            let projects_elem = document.getElementById("projects-main-content") as HTMLElement;
            projects_elem.style.display = "block";


            })
        .catch(error => console.log(error));
    }
}

/* Listener that checks if username/password can be sent to the backend */
let auth_form_submit = document.getElementById("auth-form-creation-submit") as HTMLButtonElement;
auth_form_submit?.addEventListener("click", (event) => push_sign_up_data(event,"http://127.0.0.1:8080/representatives/new-account"));


function logout(){
    // Removing the HTML from the welcome message
    let welcome_container2 = document.getElementById("welcome-container2") as HTMLElement;
    welcome_container2.innerHTML="";

    // Toggling the visibility of the project main content
    let projects_main_content = document.getElementById("projects-main-content") as HTMLElement;
    projects_main_content.style.display = 'none';

    // Toggling the visibility of the connection area
    let login_proj_rep = document.getElementById("login_proj-rep") as HTMLElement;
    login_proj_rep.style.display = 'none';
   
}