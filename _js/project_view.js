import { countryData } from "./data/countries-datahub.io.mjs";
import { languageData } from "./data/languages-datahub.io.mjs";
import { addNewElementEventListenerForClickAndKeyboardNav, toggleElementVisibility, getAbsoluteTime } from "./common.js";
let absoluteTimeSinceLastLanguageAddition = 0;
let absoluteTimeForCurrentLanguageAddition = 1000;
let addedLanguagesSelectedOptions = new Map();
let htmlToAdd4NewLanguage = "";
/****************** Signup toward project view  ***********************/
/**
 * Function used to push the username and password to the backend.
 * @param event The event that triggered the function.
 * @param url The url to send the data to.
 * @param debug A boolean for debug mode.
 *
 */
function signUpDataProcessing(event, url, debug) {
    if (debug)
        console.debug("signUpDataProcessing() called");
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
            document.cookie = `username=${username}; path=/; max-age=360000;`;
            if (debug)
                console.debug("Cookie set: " + document.cookie);
            displayProjectView(username);
        })
            .catch(error => console.debug(error));
    }
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
        if (username !== "") {
            displayProjectView(username);
            console.debug("Valid cookie found: project view dispalyed.");
        }
    }
});
/****************** Project view display ***********************/
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
                      <div id="logout"><a id="logout-link" href="javascript:void(0)">Logout</a></div>`;
    welcomeElem.innerHTML = htmlToAdd;
    // Adding the event listener
    addNewElementEventListenerForClickAndKeyboardNav("logout-link", logout, true);
    // Toggling the visibility of the project main content
    let projectsElem = document.getElementById("projects-main-content");
    projectsElem.style.display = "block";
}
//  Leaving the code duplication to avoid cognitive load for code reviewers
function getCountryList() {
    let countryList = [];
    const array = JSON.parse(countryData);
    array.forEach(data => countryList.push(data.Name));
    // Should be already sorted. Just in case.
    countryList.sort();
    let htmlOptions = "";
    countryList.forEach(country => htmlOptions += `<option value=${country}>${country}</option>`);
    return htmlOptions;
}
function addCountryOptions() {
    let element = document.getElementById("project-country");
    let htmlOptions = getCountryList();
    element.innerHTML = htmlOptions;
}
// Adding the options to the page
addCountryOptions();
function getLanguageList() {
    let languageList = [];
    const array = JSON.parse(languageData);
    array.forEach(data => languageList.push(data.English));
    // Should be already sorted. Just in case.
    languageList.sort();
    let languageOptions = "";
    languageList.forEach(language => languageOptions += `<option value=${language}> ${language} </option>`);
    return languageOptions;
}
function addLanguageOptions() {
    let element = document.getElementById("project-language-1");
    let htmlOptions = getLanguageList();
    element.innerHTML = htmlOptions;
}
//Adding the options to the page
addLanguageOptions();
/******************  Addition/removal of prefered language options ***********************/
function renumberString(numberRemoved, totalNumberOfElements, patternStringToRenumber, patternToSubstitute) {
    let debug = false;
    let stringToReturn = "";
    for (let i = numberRemoved; i <= totalNumberOfElements - 1; i++) {
        let patternStringRenumbered = patternStringToRenumber.replaceAll(patternToSubstitute, "" + i);
        stringToReturn += patternStringRenumbered;
        if (debug)
            console.debug(`for i=${i}, string=${patternStringRenumbered}`);
    }
    return stringToReturn;
}
function renumberKeyValueMap(numberRemoved, totalNumberOfElements, keyPattern, originalMap) {
    let debug = true;
    if (debug) {
        console.debug("     Content of the original id-value map before renumbering.");
        originalMap.forEach((value, key) => console.debug(`          Key: ${key}, value: ${value}`));
    }
    let mapToReturn = new Map();
    for (let i = numberRemoved + 1; i <= totalNumberOfElements; i++) {
        //Getting the original data
        let renumberedKey = keyPattern + (i - 1);
        let value = originalMap.get(keyPattern + i);
        mapToReturn.set(renumberedKey, "" + value);
    }
    if (debug) {
        console.debug("     Content of the id-value map after renumbering.");
        mapToReturn.forEach((value, key) => { console.debug(`           Key: ${key}, Value: ${value}`); });
    }
    return mapToReturn;
}
/**
 * Functions used to avoid code redundancy when working with strings related to adding a new language
 * @param value_to_insert The value to substitute inside the string
 * @returns The string to add to the HTML
 */
function getLanguageToAddString(value_to_insert) {
    let html_to_return = `<li id="list-language-${value_to_insert}" class="added-language-li">
        <div class="new-project-definition-container">
            <label class="new-project-definition-label preferedLanguage" for="project-language-${value_to_insert}">
                Language ${value_to_insert}
            </label>
            <div class="new-project-definition-input" style="padding-top:1px;">
                <select id="project-language-${value_to_insert}" class="added-language-select"
                    name="project-language-${value_to_insert}">`
        + getLanguageList() +
        `</select>  
                <span  tabindex="0"  id="delete-language-${value_to_insert}" class="added-language-delete"
                    onclick="window.removePreferedLanguage(${value_to_insert});">&times;
                </span>                                   
            </div>
        </div>
    </li>`;
    return html_to_return;
}
/**
 * Function used to add another prefered language to the project.
 */
function addAnotherLanguage() {
    console.debug("Entering addAnotherLanguage() function");
    //Gettng the number of languages already added
    let languagesElems = document.getElementsByClassName("preferedLanguage");
    let languageNumber = languagesElems.length;
    console.debug(`Number of languages already added: ${languageNumber}`);
    let languageNumberIncremented = languageNumber + 1;
    htmlToAdd4NewLanguage = getLanguageToAddString("" + languageNumberIncremented);
    // TODO: the 'X' accessibility to work on
    let newLanguageAdditionContentElem = document.getElementById("new-language-addition-content");
    newLanguageAdditionContentElem.insertAdjacentHTML('beforebegin', htmlToAdd4NewLanguage);
    //Adding an event listener to remove the language later
    // TODO: to extract the code into a method to avoid code duplication
    let deleteLanguageElem = document.getElementById(`delete-language-${languageNumberIncremented}`);
    deleteLanguageElem?.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            window.removePreferedLanguage(languageNumberIncremented);
        }
    });
}
/**
 * Function used to avoid issues with adding several languages on a single key press
 * @param debug A boolean for debug mode.
 */
function addAnotherLanguageUsingATimeBuffer(debug) {
    if (debug)
        console.debug("addAnotherLanguageUsingATimeBuffer() () called");
    //Saving the previously recorded time and recording the current time
    absoluteTimeSinceLastLanguageAddition = absoluteTimeForCurrentLanguageAddition;
    absoluteTimeForCurrentLanguageAddition = getAbsoluteTime();
    let timeDifference = absoluteTimeForCurrentLanguageAddition - absoluteTimeSinceLastLanguageAddition;
    if (timeDifference > 500) {
        console.debug(`Sufficient time difference between two language additions: ${timeDifference}
                        \n Adding another language.`);
        addAnotherLanguage();
    }
    else if (debug)
        console.debug(`Time between two language additions too short: ${timeDifference}. Not adding another language.`);
}
/**
* Function used to remove one of the prefered languages
* @param number4LanguageToRemove The number of the language to remove
*/
window.removePreferedLanguage = function (number4LanguageToRemove) {
    let debug = true;
    // Getting the added languages elements
    console.debug("\n" + `removePreferedLanguage() called on language number ${number4LanguageToRemove}.`);
    let languagesAdded = document.getElementsByClassName("added-language-li");
    let numberOfLanguages = languagesAdded.length + 1;
    // Removing the language element
    let parentElem = document.getElementById("languages-list");
    let htmlElemToRemove = document.getElementById(`list-language-${number4LanguageToRemove}`);
    parentElem?.removeChild(htmlElemToRemove);
    // Before removing the next languages, storing the current id-value pairs:
    if (debug)
        console.debug("  Storing the current id-value pairs before removing following languages.");
    let addedLanguageSelectElems = document.getElementsByClassName("added-language-select");
    for (let elem of addedLanguageSelectElems) {
        addedLanguagesSelectedOptions.set(elem.id, "" + elem.selectedIndex);
        if (debug)
            console.debug(`      Added to map: Index selected: ${addedLanguagesSelectedOptions.get(elem.id)} for key ${elem.id}`);
    }
    // Building the renumbered language strings to add later
    let patternToSubstitute = "**languageNumberIncremented**";
    // Building a string similar to the one to insert when adding a new language 
    let referenceString = getLanguageToAddString("**languageNumberIncremented**");
    let renumberedStrings = renumberString(number4LanguageToRemove, numberOfLanguages, referenceString, patternToSubstitute);
    // Removing the languages added after the one removed (the numbers need to be updated), 
    // before adding the strings with updated numbers.
    for (let i = number4LanguageToRemove + 1; i <= numberOfLanguages; i++) {
        let languageToRemoveId = `list-language-${i}`;
        if (debug)
            console.debug(`  Removing language of id: ${languageToRemoveId}`);
        let htmlToRemove = document.getElementById(languageToRemoveId);
        parentElem?.removeChild(htmlToRemove);
    }
    // Adding the renumbered strings
    let numberBeforeLanguageToRemove = number4LanguageToRemove - 1;
    let previousLanguageItem = document.getElementById(`list-language-${numberBeforeLanguageToRemove}`);
    // TODO: AppSecurity: use of insertAdjacentHTML ?
    previousLanguageItem.insertAdjacentHTML("afterend", renumberedStrings);
    // Renumbering the ids (only the languages after the one removed are taken into account in the returned map.)          
    let renumberedMap = renumberKeyValueMap(number4LanguageToRemove, numberOfLanguages, "project-language-", addedLanguagesSelectedOptions);
    // Setting the recorded values for the options
    if (debug)
        console.debug(`  Setting the recorded values for the options. Size of map: ${renumberedMap.size}`);
    renumberedMap.forEach((value, key) => {
        let elem = document.getElementById(key);
        elem.selectedIndex = parseInt(value);
    });
    // Clearing the selected optons map 
    addedLanguagesSelectedOptions.clear();
};
/****************** Logout (to move eventually; common to the contributor page as well)  ***********************/
function logout() {
    let debug = true;
    if (debug)
        console.debug("logout() called");
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
    // Removing the username data (TODO: to be done better later)
    document.cookie = "username=; path=/;";
    window.location.reload();
}
/******************  Event listeners (incl. for keyboard navigation) ***********************/
/* Listener for the logout link: added after the logout link addition */
/* Listener for the submit button */
/* Listener that checks if username/password can be sent to the backend */
// TDOD: use of the generic code if possible
let authFormSubmit = document.getElementById("auth-form-creation-submit");
authFormSubmit?.addEventListener("click", (event) => signUpDataProcessing(event, "http://127.0.0.1:8080/representatives/new-account", true));
/* Listener for the toggling of visibility in the project dashboard view */
addNewElementEventListenerForClickAndKeyboardNav("new-project-definition-invite-button", toggleElementVisibility, "new-project-definition", true);
/* Listener for adding a new language */
addNewElementEventListenerForClickAndKeyboardNav("new-language-addition-link", addAnotherLanguageUsingATimeBuffer, true);
/* Listener for the logout link */
// let logoutLink = document.getElementById("logout-link") as HTMLElement;
// logoutLink?.addEventListener("click",window.logout);
// logoutLink?.addEventListener("keydown", function(event){
//     console.debug("Entering logoutLink?.addEventListener('keydown') function");
//     if (event.key === "Enter" || event.key === "") {
//         window.logout();
//     }
// });
// TODO: to add the logout event listener when the element is available in the dom
if (document.getElementById("logout-link") !== null) {
    console.debug('document.getElementById("logout-link") !== null');
}
else {
    console.debug('document.getEl  ementById("logout-link") is null');
    console.debug("** The event listener wasn't added. **");
}
