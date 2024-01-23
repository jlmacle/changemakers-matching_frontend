import { countryData } from "./data/countries-datahub.io.mjs"; 
import { languageData } from "./data/languages-datahub.io.mjs";

import { addElementEventListenerForClickAndKeyboardNav, toggleElementVisibility, getAbsoluteTime } from "./common.js";

let absoluteTimeSinceLastLanguageAddition:number = 0;
let absoluteTimeForCurrentLanguageAddition:number = 1000;

let addedLanguagesSelectedOptions: Map<string,string> = new Map<string, string>();
let htmlToAdd4NewLanguage = "";

/****************** Signup toward project view  ***********************/


/**
 * Function used to push the username and password to the backend.
 * @param event The event that triggered the function.
 * @param url The url to send the data to.
 * @param debug A boolean for debug mode.
 * 
 */
function signUpDataProcessing(event: Event, url: string, debug:boolean) {
    if (debug) console.debug("signUpDataProcessing() called");

    event.preventDefault(); // to avoid unexpected network behaviors causing network errors
    let usernameElem = document.getElementById("username") as HTMLInputElement;
    let passwordElem = document.getElementById("password") as HTMLInputElement; 
    const username = usernameElem.value;
    const password = passwordElem.value;                           

    if (!username || !password) // if username or password are empty or null
    
    {
        let submitElem = document.getElementById("auth-form-creation-submit") as HTMLButtonElement;
        submitElem.disabled = false;
        if (debug) console.debug("Username or password are empty. Treated in HTML page.");
    }
    else{
        if (debug) console.debug("Entering signUpDataProcessing() function");
        fetch (url, {
            method:'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({username: username, password: password})
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
            document.cookie = `username=${username}; path=/; max-age=360000;`;
            if (debug) console.debug("Cookie set: " + document.cookie);

            displayProjectView(username);          
            
            })
        .catch(error => console.debug(error));
    }
}


// TODO: to re-work the cookie part minding the security aspects
document.addEventListener("DOMContentLoaded", function(event){
    console.debug('Entering addEventListener("DOMContentLoaded") function');
    let debug = true;

    let cookie = document.cookie;
    if (cookie) {
        let usernamePart = cookie.split(";")[0];
        if (debug) console.debug("usernamePart = " + usernamePart);
        let username = usernamePart.split("=")[1];
        if (username !== "") {
            displayProjectView(username);
            console.debug("Valid cookie found: project view displayed.");
        }
    }
});


/****************** Project view display ***********************/

/**
 * Function used to display the project view
 * @param username The username of the user
 */
function displayProjectView(username: string){
    // Toggling the visibility of the authentication form
    let authFormElem = document.getElementById("new-accountProj-rep") as HTMLElement;
    authFormElem.style.display = "none";
              
    // Welcome message
    let welcomeElem = document.getElementById("welcome-container2") as HTMLElement;
    let htmlToAdd =`<div aria-hidden="true">Welcome, ${username}</div>
                      <div id="logout"><a id="logout-link" href="javascript:void(0)">Logout</a></div>`
    welcomeElem.innerHTML = htmlToAdd;
        // Adding the event listener
    addElementEventListenerForClickAndKeyboardNav("logout-link", logout, true);

    // Toggling the visibility of the project main content
    let projectsElem = document.getElementById("projects-main-content") as HTMLElement;
    projectsElem.style.display = "block";
}



/****************** Dynamic list building ***********************/

interface Country {
    Code: string;
    Name: string;
}

interface Language {
    English: string;
    alpha2: string
}

//  Leaving the code duplication to avoid cognitive load for code reviewers

function getCountryList(): string{
    let countryList:string[] = [];
    const array = JSON.parse(countryData) as Country[];   
    array.forEach(data => countryList.push(data.Name)); 
    // Should be already sorted. Just in case.
    countryList.sort();
    let  htmlOptions = "";
    countryList.forEach(country => htmlOptions += `<option value=${country}>${country}</option>`)    
    
    return htmlOptions;
}

function addCountryOptions(){
    let element = document.getElementById("project-country") as HTMLElement;
    let htmlOptions = getCountryList();
    element.innerHTML = htmlOptions;
}
// Adding the options to the page
addCountryOptions();

function getLanguageList():string{
    let languageList:string[]=[];
    const array = JSON.parse(languageData) as Language[];    
    array.forEach(data => languageList.push(data.English));
    // Should be already sorted. Just in case.
    languageList.sort();
    let languageOptions = "";
    languageList.forEach(language => languageOptions += `<option value=${language}> ${language} </option>`)

    return languageOptions;

}

function addLanguageOptions(){
    let element = document.getElementById("project-language-1") as HTMLElement;
    let htmlOptions = getLanguageList();
    element.innerHTML = htmlOptions;
}
//Adding the options to the page
addLanguageOptions();

/******************  Addition/removal of prefered language options ***********************/
function renumberString(numberRemoved:number, totalNumberOfElements:number, patternStringToRenumber:string, patternToSubstitute:string): string{
    let debug = false;
    
    let stringToReturn = "";
    for(let i=numberRemoved; i<= totalNumberOfElements-1; i++){
        let patternStringRenumbered = patternStringToRenumber.replaceAll(patternToSubstitute, ""+i);
        stringToReturn += patternStringRenumbered;

        if(debug) console.debug(`for i=${i}, string=${patternStringRenumbered}`);
    }

    return stringToReturn;
}

function renumberKeyValueMap(numberRemoved:number, totalNumberOfElements:number, keyPattern:string, originalMap:Map<string,string>){
    let debug = true;
    if (debug) {
        console.debug("     Content of the original id-value map before renumbering.");
        originalMap.forEach((value,key) => console.debug(`          Key: ${key}, value: ${value}`));
    }

    let mapToReturn:Map<string,string> = new Map<string,string>();
    // Need to renumber the languages that were after the language deleted, before re-displaying their data.
    for(let i=numberRemoved+1; i<=totalNumberOfElements; i++){
        //Getting the original data
        let renumberedKey = keyPattern+(i-1);
        let value = originalMap.get(keyPattern+i);
        mapToReturn.set(renumberedKey, ""+value);
    }
    if(debug) {
        console.debug("     Content of the id-value map after renumbering.");
        mapToReturn.forEach((value, key)  => {console.debug(`           Key: ${key}, Value: ${value}`) } );
    }

    return mapToReturn;
}

/**
 * Function used to avoid code redundancy when working with strings related to adding a new language
 * @param value_to_insert The value to substitute inside the string
 * @returns The string to add to the HTML 
 */
function getLanguageToAddHTMLString(value_to_insert:string): string{
    let html_to_return = 
    `<li id="list-language-${value_to_insert}" class="added-language-li">
        <div class="new-project-definition-container">
            <label class="new-project-definition-label preferedLanguage" for="project-language-${value_to_insert}">
                Language ${value_to_insert}
            </label>
            <div class="new-project-definition-input" style="padding-top:1px;">
                <select id="project-language-${value_to_insert}" class="added-language-select"
                    name="project-language-${value_to_insert}">`
                    + getLanguageList() +
                `</select>  
                <span  tabindex="0"  id="delete-language-${value_to_insert}" class="added-language-delete">&times;
                </span>                                   
            </div>
        </div>
    </li>`;
    return html_to_return;

}

 
/**
 * Function used to add another prefered language to the project.
 */
function addAnotherLanguage(){
    console.debug("Entering addAnotherLanguage() function");    

    //Gettng the number of languages already added
    let languagesElems = document.getElementsByClassName("preferedLanguage") as HTMLCollectionOf<HTMLElement>;
    let totalNumberOfLanguages = languagesElems.length;
    console.debug(`Number of languages already added: ${totalNumberOfLanguages}`);
    let number4TheLanguageToAdd = totalNumberOfLanguages + 1;

    htmlToAdd4NewLanguage = getLanguageToAddHTMLString(""+number4TheLanguageToAdd);    
 
    // TODO: the 'X' accessibility to check on
    let newLanguageAdditionContentElem = document.getElementById("new-language-addition-content") as HTMLElement;
    newLanguageAdditionContentElem.insertAdjacentHTML('beforebegin',htmlToAdd4NewLanguage);

    //Adding an event listener to remove the language later
    addElementEventListenerForClickAndKeyboardNav(`delete-language-${number4TheLanguageToAdd}`, removePreferedLanguage, number4TheLanguageToAdd, true);
}

/**
 * Function used to avoid issues with adding several languages on a single key press
 * @param debug A boolean for debug mode.
 */
function addAnotherLanguageUsingATimeBuffer(debug:boolean){
    if (debug) console.debug("addAnotherLanguageUsingATimeBuffer() () called");

    //Saving the previously recorded time and recording the current time
    absoluteTimeSinceLastLanguageAddition = absoluteTimeForCurrentLanguageAddition;
    absoluteTimeForCurrentLanguageAddition = getAbsoluteTime()

    let timeDifference = absoluteTimeForCurrentLanguageAddition - absoluteTimeSinceLastLanguageAddition ;
    if(timeDifference > 500){        
        console.debug(`Sufficient time difference between two language additions: ${timeDifference}
                        \n Adding another language.`)
        addAnotherLanguage();
    } 
    else if (debug) console.debug(`Time between two language additions too short: ${timeDifference}. Not adding another language.`);
    
}

 /**
 * Function used to remove one of the prefered languages
 * @param number4LanguageToRemove The number of the language to remove
 */

function removePreferedLanguage(number4LanguageToRemove:number){
    let debug = true;  
    
    // Getting the added languages elements
    console.debug("\n"+`removePreferedLanguage() called on language number ${number4LanguageToRemove}.`);  
    let languagesAddedElems = document.getElementsByClassName("added-language-li") as HTMLCollectionOf<HTMLElement>;
    let totalNumberOfLanguages = languagesAddedElems.length + 1;
    
    // Removing the language element
    let parentElem = document.getElementById("languages-list");
    let htmlElemToRemove = document.getElementById(`list-language-${number4LanguageToRemove}`) as HTMLElement;
    parentElem?.removeChild(htmlElemToRemove);    

    // Before removing the next languages, storing the current id-value pairs:
    if (debug) console.debug("  Storing the current id-value pairs before removing following languages.");
    let addedLanguageSelectElems = document.getElementsByClassName("added-language-select") as HTMLCollectionOf<HTMLSelectElement>;
    for (let elem of addedLanguageSelectElems){        
        addedLanguagesSelectedOptions.set(elem.id,""+ elem.selectedIndex);
        if (debug) console.debug(`      Added to map: Index selected: ${addedLanguagesSelectedOptions.get(elem.id)} for key ${elem.id}`);
    }

    // Building the renumbered language strings to add later
    let patternToSubstitute: string = "**number4TheLanguageToAdd**";
        // Building a string similar to the one to insert when adding a new language 
    let referenceString: string = getLanguageToAddHTMLString("**number4TheLanguageToAdd**");   
    let renumberedStrings = renumberString(number4LanguageToRemove, totalNumberOfLanguages, referenceString, patternToSubstitute);

    // Removing the languages added after the one removed (the numbers need to be updated), 
    // before adding the strings with updated numbers.
    for(let i=number4LanguageToRemove+1; i<= totalNumberOfLanguages; i++){
        let languageToRemoveId = `list-language-${i}`;
        if (debug) console.debug(`  Removing language of id: ${languageToRemoveId}`);
        let htmlToRemove = document.getElementById(languageToRemoveId) as HTMLElement;
        parentElem?.removeChild(htmlToRemove);
    }    

    // Adding the renumbered strings
    let numberBeforeLanguageToRemove = number4LanguageToRemove - 1;
    let previousLanguageItem = document.getElementById(`list-language-${numberBeforeLanguageToRemove}`) as HTMLElement;
    // TODO: AppSecurity: use of insertAdjacentHTML ?
    previousLanguageItem.insertAdjacentHTML("afterend",renumberedStrings);    

    // Renumbering the ids (only the languages after the one removed are taken into account in the returned map.)          
    let renumberedMap = renumberKeyValueMap(number4LanguageToRemove, totalNumberOfLanguages, "project-language-", addedLanguagesSelectedOptions);
       // Setting the recorded values for the options
    if (debug) console.debug(`  Setting the recorded values for the options. Size of map: ${renumberedMap.size}`);     
    renumberedMap.forEach((value,key) => { 
        let elem = document.getElementById(key) as HTMLSelectElement;        
        elem.selectedIndex = parseInt(value);       
    });        

    // Adding the event listeners that have been deleted
    languagesAddedElems = document.getElementsByClassName("added-language-li") as HTMLCollectionOf<HTMLElement>;
    totalNumberOfLanguages = languagesAddedElems.length + 1;
    for(let i=number4LanguageToRemove; i<= totalNumberOfLanguages; i++){
        addElementEventListenerForClickAndKeyboardNav(`delete-language-${i}`, removePreferedLanguage, i, true);
    }

    // Clearing the selected options map 
    addedLanguagesSelectedOptions.clear();   

};


/****************** Logout (to move eventually; common to the contributor page as well)  ***********************/

function logout (){  
    let debug = true;
    if (debug) console.debug("logout() called");

    // Removing the HTML from the welcome message
    let welcomeContainer2 = document.getElementById("welcome-container2") as HTMLElement;
    welcomeContainer2.innerHTML="";

    // Toggling the visibility of the projects main content
    let projectsMainContent = document.getElementById("projects-main-content") as HTMLElement;
    projectsMainContent.style.display = 'none';

    // Toggling the visibility of the new account area
    let newAccountProjRep = document.getElementById("new-accountProj-rep") as HTMLElement;
    newAccountProjRep.style.display = 'block';

    // Removing the username data (TODO: to be done better later)
    document.cookie = "username=; path=/;";
    window.location.reload();
}

/******************  Event listeners (incl. for keyboard navigation) ***********************/

/* Listener for the logout link: added after the logout link addition */

/* Listener for the submit button: Listener that checks if username/password can be sent to the backend */
// TDOD: use of the generic code if possible
let authFormSubmit = document.getElementById("auth-form-creation-submit") as HTMLButtonElement;
authFormSubmit?.addEventListener("click", (event) => signUpDataProcessing(event,"http://127.0.0.1:8080/representatives/new-account",true));

/* Listener for the toggling of visibility in the project dashboard view */
addElementEventListenerForClickAndKeyboardNav("new-project-definition-invite-button", toggleElementVisibility, "new-project-definition", true);

/* Listener for adding a new language */ 
addElementEventListenerForClickAndKeyboardNav("new-language-addition-link", addAnotherLanguageUsingATimeBuffer, true);


