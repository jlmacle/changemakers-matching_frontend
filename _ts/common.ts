// https://code.visualstudio.com/docs/typescript/typescript-compiling
// Ctrl+Shift+B

var username_is_valid:boolean = false;
var password_is_valid:boolean = false;

/**
 * Function used to check if the username is acceptable.
 */
function checkUsername() {
    let debug = true;

    let username = document.getElementById("username") as HTMLFormElement; // To be able to access the value property
    let submit_button = document.getElementById("contributor-auth-form-submit") as HTMLButtonElement;
    username?.addEventListener("input", function(event){
        let username_error = document.getElementById("username_error");     
        

        if (username?.value && username_error) {            
            if (username.value.includes("@")) {
                if (debug) console.log("Username contains @");
                username_error.innerHTML = "Username cannot contain @";
                submit_button.disabled = true;
                username_is_valid = false;
            }              
            else if (username.value.includes(" ")) {
                if (debug) console.log("Username contains an empty space");
                username.value = username.value.trim(); //Suppressing the empty space
                submit_button.disabled = true;
                username_is_valid = false;
            }
            else if (username.value.trim().length == 0) {
                if (debug) console.log("Username is empty");
                username_error.innerHTML = "Username cannot be empty";
                submit_button.disabled = true;
                username_is_valid = false;
            }           
            else {
                if (debug) console.log("Username is valid");
                username_error.innerHTML = "The username is valid for this demo.";
                // TODO: alphanumeric characters and underscore only. Min 3 characters, max 20 characters.                
                username_is_valid = true;
                // Still need to check if the password is valid before enabling the submit button.
                if (username_is_valid && password_is_valid) submit_button.disabled = false;
            }


        }
        else {
            if (debug) console.log("(username?.value && username_error) has false for value.");
        }
    });      
}



/**
 * Function used to check if the password is acceptable.
 */
function checkPassword() {
    let debug = true;

    let password = document.getElementById("password") as HTMLInputElement; // To be able to access the value property
    let submit_button = document.getElementById("contributor-auth-form-submit") as HTMLButtonElement;
    password?.addEventListener("input", function(event){                
        let password_error = document.getElementById("password_error");        

        if (password?.value && password_error) {
            if (password.value.trim().length <=8) {
                if (debug) console.log("Password is too short");
                password_error.innerHTML = "Password should be at least 8 characters long";
                submit_button.disabled = true;          
                password_is_valid = false;      
            }
            else {
                if (debug) console.log("Password is valid");
                password_error.innerHTML = "This password is valid for this demo.";
                password_is_valid = true;
                // Still need to check if the username is valid before enabling the submit button.
                if (username_is_valid && password_is_valid) submit_button.disabled = false;
            }

        }
        else {
            if (debug) console.log("(password?.value && password_error) has false for value.");
        }
    });
   
    
}




