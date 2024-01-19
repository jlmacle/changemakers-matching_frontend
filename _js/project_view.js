import { countryData } from "./data/countries-datahub.io.mjs";
import { languageData } from "./data/languages-datahub.io.mjs";
let absoluteTimeSinceLastLanguageAddition = 0;
let absoluteTimeForCurrentLanguageAddition = 1000;
let addedLanguagesSelectedOptions = new Map();
/****************** Signup toward project view  ***********************/
/* Listener that checks if username/password can be sent to the backend */
let authFormSubmit = document.getElementById("auth-form-creation-submit");
authFormSubmit?.addEventListener("click", (event) => signUpDataProcessing(event, "http://127.0.0.1:8080/representatives/new-account"));
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
                      <div id="logout"><a id="logout-link" href="javascript:void(0)" onclick="window.logout()" >Logout</a></div>`;
    welcomeElem.innerHTML = htmlToAdd;
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
    let mapToReturn = new Map();
    for (let i = numberRemoved + 1; i <= totalNumberOfElements; i++) {
        //Getting the original data
        let renumberedKey = keyPattern + (i - 1);
        let value = originalMap.get(keyPattern + i);
        mapToReturn.set(renumberedKey, "" + value);
    }
    if (debug) {
        mapToReturn.forEach((value, key) => { console.debug(`Key: ${key}, Value: ${value}`); });
    }
    return mapToReturn;
}
/**
* Function used to remove one of the prefered languages
* @param languageId The id of the language to remove
*/
window.removePreferedLanguage = function (number4LanguageToRemove) {
    let debug = true;
    console.debug("\n" + "Entering removePreferedLanguage() function");
    let languagesAdded = document.getElementsByClassName("added-language-li");
    let numberOfLanguages = languagesAdded.length + 1;
    let parentElem = document.getElementById("languages-list");
    let htmlElemToRemove = document.getElementById(`list-language-${number4LanguageToRemove}`);
    parentElem?.removeChild(htmlElemToRemove);
    // E.g.: 3 languages added:  L1, L2, L3, L4
    // Removing L2:              L1,     L3, L4
    let patternToSubstitute = "**languageNumberIncremented**";
    let referenceString = `<li id="list-language-**languageNumberIncremented**" class="added-language-li">
        <div class="new-project-definition-container">
            <label class="new-project-definition-label preferedLanguage" for="project-language-**languageNumberIncremented**">
                Language **languageNumberIncremented**
            </label>
            <div class="new-project-definition-input" style="padding-top:1px;">
                <select id="project-language-**languageNumberIncremented**" class="added-language-select"
                    name="project-language-**languageNumberIncremented**">`
        + getLanguageList() +
        `</select>  
                <span  tabindex="0"  id="delete-language-**languageNumberIncremented**" class="added-language-delete"
                    onclick="window.removePreferedLanguage(**languageNumberIncremented**);">&times;
                </span>                                   
            </div>
        </div>
    </li>`;
    let renumberedString = renumberString(number4LanguageToRemove, numberOfLanguages, referenceString, patternToSubstitute);
    // Removing the languages added after the one removed, before adding the renumbered string
    for (let i = number4LanguageToRemove + 1; i <= numberOfLanguages; i++) {
        let htmlToRemove = document.getElementById(`list-language-${i}`);
        parentElem?.removeChild(htmlToRemove);
    }
    // Adding the renumbered string
    let numberBeforeLanguageToRemove = number4LanguageToRemove - 1;
    let previousLanguageItem = document.getElementById(`list-language-${numberBeforeLanguageToRemove}`);
    previousLanguageItem.insertAdjacentHTML("afterend", renumberedString);
    // Renumbering the ids
    let renumberedMap = renumberKeyValueMap(number4LanguageToRemove, numberOfLanguages, "project-language-", addedLanguagesSelectedOptions);
    // Setting the recorded values for the options
    if (debug)
        console.debug(`About to set the recorded values for the options. Size of map: ${renumberedMap.size}`);
    renumberedMap.forEach((value, key) => {
        let elem = document.getElementById(key);
        elem.selectedIndex = parseInt(value);
    });
};
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
    let htmlToAdd = `<li id="list-language-${languageNumberIncremented}" class="added-language-li">
                            <div class="new-project-definition-container">
                                <label class="new-project-definition-label preferedLanguage" for="project-language-${languageNumberIncremented}">
                                    Language ${languageNumberIncremented}
                                </label>
                                <div class="new-project-definition-input">
                                    <select id="project-language-${languageNumberIncremented}" 
                                        name="project-language-${languageNumberIncremented}" class="added-language-select">`
        + getLanguageList() +
        `</select>  
                                    <span  tabindex="0"  id="delete-language-${languageNumberIncremented}" class="added-language-delete"
                                        onclick="removePreferedLanguage(${languageNumberIncremented});">&times;
                                    </span>                                   
                                </div>
                            </div>
                        </li>`;
    // TODO: the 'X' accessibility to work on
    let newLanguageAdditionContentElem = document.getElementById("new-language-addition-content");
    newLanguageAdditionContentElem.insertAdjacentHTML('beforebegin', htmlToAdd);
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
 */
function addAnotherLanguageUsingATimeBuffer() {
    let debug = true;
    console.debug("\n" + "Entering addAnotherLanguageUsingATimeBuffer() function");
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
let newLanguageAddition = document.getElementById("new-language-addition-link");
newLanguageAddition.addEventListener("click", addAnotherLanguageUsingATimeBuffer);
newLanguageAddition.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
        addAnotherLanguageUsingATimeBuffer();
    }
});
// Adding an event listener to monitor the values of the prefered languages
document.addEventListener("change", function (event) {
    let debug = true;
    if (debug)
        console.debug("\n" + "Entering change event listener for language selection");
    let addedLanguageSelectElems = document.getElementsByClassName("added-language-select");
    if (debug)
        console.debug(`Number of added languages: ${addedLanguageSelectElems.length}`);
    for (let elem of addedLanguageSelectElems) {
        addedLanguagesSelectedOptions.set(elem.id, "" + elem.selectedIndex);
        if (debug)
            console.debug(`Index selected: ${addedLanguagesSelectedOptions.get(elem.id)} in ${elem.id}`);
    }
});
/****************** Logout (to move eventually)  ***********************/
window.logout = function () {
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
};
// Adding the event listeners for the logout link
// TODO: to understand the issues with the event listeners that seem to not work
let logoutLink = document.getElementById("logout-link");
logoutLink?.addEventListener("click", window.logout);
logoutLink?.addEventListener("keydown", function (event) {
    console.debug("Entering logoutLink?.addEventListener('keydown') function");
    if (event.key === "Enter" || event.key === "") {
        window.logout();
    }
});
/******************  Event listeners (incl. for keyboard navigation) ***********************/
