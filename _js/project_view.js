import { countryData } from "./data/countries-datahub.io.mjs";
import { languageData } from "./data/languages-datahub.io.mjs";
import { sdgLabels } from "./data/sdg-labels.mjs";
import { addElementEventListenerForChangeEvent, addElementEventListenerForClickAndKeyboardNav, decrementRelatedElementId, getAbsoluteTime, toggleElementVisibility, removeElement, renumberKeyValueMap, renumberString, isDuplicateSelectionPresent } from "./common.js";
let absoluteTimeSinceLastLanguageAddition = 0;
let absoluteTimeForCurrentLanguageAddition = 1000;
let absoluteTimeSinceLastSdgAddition = 0;
let absoluteTimeForCurrentSdgAddition = 1000;
let addedLanguagesSelectedOptions = new Map();
let htmlToAdd4NewLanguage = "";
let addedSdgsSelectedOptions = new Map();
let htmlToAdd4NewSdg = "";
let htmlToAdd4NewSdgImg = "";
let sdgImageNames = [];
let fileDir = "../_media/UN-graphics/";
// TODO: to use HTML <template> instead of Template Strings ES6 (Anssi - R6)
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
            // temp cookie for testing (to be done better later)
            document.cookie = `username=${username}; path=/; max-age=360000;`; // 📖 AppSecurity: Setting a session cookie https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_CheatSheet.html
            if (debug)
                console.debug("Cookie set: " + document.cookie); // 📖 AppSecurity: (when using HTTPS) "The purpose of the secure attribute is to prevent cookies from being observed by unauthorized parties due to the transmission of the cookie in clear text. To accomplish this goal, browsers which support the secure attribute will only send cookies with the secure attribute when the request is going to an HTTPS page." https://owasp.org/www-community/controls/SecureCookieAttribute 
            displayProjectView(username);
        })
            .catch(error => console.debug(error));
    }
}
// TODO: to re-work the cookie part minding the security aspects
document.addEventListener("DOMContentLoaded", function (event) {
    console.debug('Entering addEventListener("DOMContentLoaded") function');
    let debug = false;
    let cookie = document.cookie;
    if (cookie) {
        let usernamePart = cookie.split(";")[0];
        if (debug)
            console.debug("usernamePart = " + usernamePart);
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
function displayProjectView(username) {
    // Toggling the visibility of the authentication form
    let authFormElem = document.getElementById("new-accountProj-rep-title");
    authFormElem.style.display = "none";
    // Welcome message
    let welcomeElem = document.getElementById("welcome-container2");
    let htmlToAdd = `<div aria-hidden="true">Welcome, ${username}</div>
                      <div id="logout"><a id="logout-link" href="javascript:void(0)">Logout</a></div>`;
    welcomeElem.innerHTML = htmlToAdd;
    // Adding the event listener
    addElementEventListenerForClickAndKeyboardNav("logout-link", logout, true);
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
function getSDGList() {
    let sdgList = [];
    const array = JSON.parse(sdgLabels);
    array.forEach(data => sdgList.push(data.Label));
    array.forEach(data => sdgImageNames.push(data.Image));
    // Should be already sorted. Just in case.
    sdgList.sort();
    let sdgOptions = "";
    sdgList.forEach(label => sdgOptions += `<option value='${label}'> ${label} </option>`);
    return sdgOptions;
}
function addSDGOptions() {
    let element = document.getElementById("project-sdg-1");
    let sdgOptions = getSDGList();
    element.innerHTML = sdgOptions;
}
addSDGOptions(); /* Will also build the list of sdg images names */
/******************  sdgs-related methods ***********************/
/** Function used to avoid code redundancy when working with strings related to adding a new sdg image
* @param id The first value to substitute inside the string
* @param filePath The second value to substitute inside the string
* @returns The string to add to the HTML
*/
function getSdgImgToAddHTMLString(id, filePath) {
    let html_to_return = `<img id='${id}' aria-label='' src='${filePath}' class='sdgImg'>`;
    return html_to_return;
}
/**
 * Function thats adds or modifies an sdg icon in the left sidebar when selecting a sdg for the project profile.
 * The function sorts the sdg images by ascending order of sdg number.
 * @param selectId the id of the select that fired the event
 * @param debug A boolean for debug mode.
 */
function addOrModifySDGImage(selectId, debug) {
    // new selection in element.
    // if selected already, replacement and sorting
    // if not selected already, addition and sorting
    let htmlImgStringsMap = new Map();
    let arrayToSort = [];
    let selectedElement = document.getElementById(selectId);
    // Building from the images already displayed.
    let displayedImgsElems = document.getElementsByClassName("sdgImg");
    for (let elem of displayedImgsElems) {
        // Adding to the map using img-project-sdg-* as key, and the HTML string as value
        // Key: img-project-sdg-2, value:<img id='img-project-sdg-2' aria-label='' src='../_media/UN-graphics/G5.png' class='sdgImg'>
        let imgId = elem.getAttribute("Id");
        let filePath = elem.getAttribute("src");
        htmlImgStringsMap.set(imgId + "", getSdgImgToAddHTMLString(imgId + "", filePath + ""));
        // Expected output: <img id='img-project-sdg-1' aria-label='' src='../_media/UN-graphics/G1.png' class='sdgImg'> 
        // Building the strings to add to the array
        // let sdgRoot = elem.getAttribute("src")?.replace("../_media/UN-graphics/","").replace(".png","");
        // console.debug(sdgRoot);
        // let stringToAdd = elem.
    }
    // At this point, the hashmap might be empty
    // Adding the selected data to the hashmap; The value is updated in case of duplicated key.
    let builtId = "img-" + selectedElement.getAttribute("id");
    let selectedSDGNumber = selectedElement.selectedIndex + 1;
    let builtFilePath = fileDir + "G" + selectedSDGNumber + ".png";
    htmlImgStringsMap.set(builtId, getSdgImgToAddHTMLString(builtId, builtFilePath));
    if (debug) {
        console.debug("hashmap: begin");
        htmlImgStringsMap.forEach((value, key) => console.debug(`Key: ${key}, value:${value}`));
        console.debug("hashmap: end");
    }
    // Adding the hashmap data to the array
    htmlImgStringsMap.forEach((value, key) => {
        //Getting the SDGNumber
        let gSdgNumber = (value.split("UN-graphics/")[1]).split(".png")[0];
        //Building the data to add
        // Pattern used: G1*<img id='img-project-sdg-1' aria-label='' src='../_media/UN-graphics/G1.png' class='sdgImg'>
        let dataToAdd = gSdgNumber + "*" + value;
        arrayToSort.push(dataToAdd);
    });
    //G1*<img id='img-project-sdg-1' aria-label='' src='../_media/UN-graphics/G1.png' class='sdgImg'>
    // Sorting the array (TODO)
    let sortedArray = arrayToSort.sort(function (a, b) {
        let extractedValueFromA = (a.split("*")[0]).replace("G", "");
        let extractedValueFromB = (b.split("*")[0]).replace("G", "");
        return parseInt(extractedValueFromA) - parseInt(extractedValueFromB);
    });
    // Going through the sorted array and building the HTML
    let htmlToAddToWrapper = "";
    let arrayLength = sortedArray.length;
    for (let i = 0; i < arrayLength; i++) {
        let arrayData = sortedArray[i];
        let builtstring = arrayData.split("*")[1];
        htmlToAddToWrapper += builtstring;
    }
    ;
    // if (debug) console.debug(htmlToAddToWrapper);
    // Removing the current child element if any to add the generated HTML
    let parentElem = document.getElementById("sidebar-sticky-wrapper");
    parentElem.innerHTML = "";
    parentElem?.insertAdjacentHTML("beforeend", htmlToAddToWrapper);
}
/**
 * Function thats adds or modifies an sdg icon to the left sidebar when selecting a sdg for the project profile.
 * The function sorts the sdg images by ascending order of sdg number.
 * @param selectId the id of the select element
 * @param debug A boolean for debug mode.
 */
// function addOrModifySDGImage(selectId:string, debug:boolean){
//     if (debug) {
//         console.debug("addOrModifySDGImage() called");
//         console.debug(`selectId: ${selectId}`);
//     }
//     let elem = document.getElementById(selectId) as HTMLSelectElement;
//     let sdgNumber = elem.selectedIndex + 1;
//         // Getting the image name:
//     let sdgImageName =  sdgImageNames[sdgNumber-1];
//     if (debug) {
//         console.debug(`sdgNumber: ${sdgNumber}`);
//         console.debug(`sdgImageName: ${sdgImageName}`);
//     }
//     let filePath = fileDir+sdgImageName;
//     // Building/Updating the sidebar HTML
//     let imgId = `img-${selectId}`;
//     let potentialElem = document.getElementById(imgId);
//     if (potentialElem)
//     {
//         console.debug(`Element with id ${imgId} exists, and is being updated.`);
//         // TODO: updating and sorting
//         potentialElem.setAttribute("src",`${filePath}`);
//     }
//     else {
//         console.debug(`Element with id ${imgId} doesn't exist, and is being created.`);        
//         let htmlToAdd = getSdgImgToAddHTMLString(selectId, filePath);
//         let parentElem = document.getElementById("sidebar-sticky-wrapper");
//         // TODO: sorting
//         parentElem?.insertAdjacentHTML("beforeend", htmlToAdd);
//     }
// }
/** Function used to avoid code redundancy when working with strings related to adding a new sdg
* @param value_to_insert The value to substitute inside the string
* @returns The string to add to the HTML
*/
function getSdgToAddHTMLString(value_to_insert) {
    let html_to_return = `<li id="li-sdg-${value_to_insert}" class="added-sdg-li">
       <div class="new-project-definition-container">
           <label class="new-project-definition-label" for="project-sdg-${value_to_insert}">
               SDG ${value_to_insert}
           </label>
           <div id="project-sdg-${value_to_insert}-error"></div>
           <div class="new-project-definition-input" style="padding-top:1px;">
               <select id="project-sdg-${value_to_insert}" class="added-sdg-select declaredSdg"
                   name="project-sdg-${value_to_insert}">`
        + getSDGList() +
        `</select>  
               <span  tabindex="0"  id="delete-sdg-${value_to_insert}" class="added-sdg-delete">&times;
               </span>                                   
           </div>
       </div>
   </li>`;
    return html_to_return;
}
/**
 * Function used to avoid issues with adding several languages on a single key press
 * @param debug A boolean for debug mode.
 */
function addAnotherSdgUsingATimeBuffer(debug) {
    if (debug)
        console.debug("addAnotherSdgUsingATimeBuffer() called");
    //Saving the previously recorded time and recording the current time
    absoluteTimeSinceLastSdgAddition = absoluteTimeForCurrentSdgAddition;
    absoluteTimeForCurrentSdgAddition = getAbsoluteTime();
    let timeDifference = absoluteTimeForCurrentSdgAddition - absoluteTimeSinceLastSdgAddition;
    if (timeDifference > 500) {
        console.debug(`Sufficient time difference between two sdg additions: ${timeDifference}
                        \n Adding another sdg.`);
        addAnotherSdg();
    }
    else if (debug)
        console.debug(`Time between two sdg additions too short: ${timeDifference}. Not adding another sdg.`);
}
/**
 * Function used to remove one of the declared sdgs.
 * @param number4SdgToRemove The number of the sdg to remove
 */
function removeDeclaredSDG(number4SdgToRemove) {
    let debug = false;
    // Getting the added sdgs elements
    console.debug("\n" + `removeDeclaredSDG() called on sdg number ${number4SdgToRemove}.`);
    let sdgsAddedElems = document.getElementsByClassName("added-sdg-li");
    let totalNumberOfSdgs = sdgsAddedElems.length + 1;
    // Removing the image
    removeElement(`img-project-sdg-${number4SdgToRemove}`, "sidebar-sticky-wrapper");
    // Removing the language element
    let parentElem = document.getElementById("sdgs-list");
    let htmlElemToRemove = document.getElementById(`li-sdg-${number4SdgToRemove}`);
    parentElem?.removeChild(htmlElemToRemove);
    // Before removing the next languages, storing the current id-value pairs:
    if (debug)
        console.debug("  Storing the current id-value pairs before removing following sdgs.");
    let addedSdgSelectElems = document.getElementsByClassName("added-sdg-select");
    for (let elem of addedSdgSelectElems) {
        addedSdgsSelectedOptions.set(elem.id, "" + elem.selectedIndex);
        if (debug)
            console.debug(`      Added to map: Index selected: ${addedSdgsSelectedOptions.get(elem.id)} for key ${elem.id}`);
    }
    // Building the renumbered language strings to add later
    let patternToSubstitute = "**number4TheSdgToAdd**";
    // Building a string similar to the one to insert when adding a new language 
    let referenceString = getSdgToAddHTMLString("**number4TheSdgToAdd**");
    let renumberedStrings = renumberString(number4SdgToRemove, totalNumberOfSdgs, referenceString, patternToSubstitute);
    // Removing the languages added after the one removed (the numbers need to be updated), 
    // before adding the strings with updated numbers.
    for (let i = number4SdgToRemove + 1; i <= totalNumberOfSdgs; i++) {
        let sdgToRemoveId = `li-sdg-${i}`;
        if (debug)
            console.debug(`  Removing sdg of id: ${sdgToRemoveId}`);
        let htmlToRemove = document.getElementById(sdgToRemoveId);
        parentElem?.removeChild(htmlToRemove);
        // Renaming the ids in the pictures
        decrementRelatedElementId("img-project-sdg-", `img-project-sdg-${i}`);
    }
    // Adding the renumbered strings
    let numberBeforeSdgToRemove = number4SdgToRemove - 1;
    let previousSdgItem = document.getElementById(`li-sdg-${numberBeforeSdgToRemove}`);
    // TODO: AppSecurity: use of insertAdjacentHTML ?
    previousSdgItem.insertAdjacentHTML("afterend", renumberedStrings);
    // Renumbering the ids (only the languages after the one removed are taken into account in the returned map.)          
    let renumberedMap = renumberKeyValueMap(number4SdgToRemove, totalNumberOfSdgs, "project-sdg-", addedSdgsSelectedOptions);
    // Setting the recorded values for the options
    if (debug)
        console.debug(`  Setting the recorded values for the options. Size of map: ${renumberedMap.size}`);
    renumberedMap.forEach((value, key) => {
        let elem = document.getElementById(key);
        elem.selectedIndex = parseInt(value);
    });
    // Adding the event listeners that have been deleted
    sdgsAddedElems = document.getElementsByClassName("added-sdg-li");
    totalNumberOfSdgs = sdgsAddedElems.length + 1;
    for (let i = number4SdgToRemove; i <= totalNumberOfSdgs; i++) {
        addElementEventListenerForClickAndKeyboardNav(`delete-sdg-${i}`, removeDeclaredSDG, i, true);
    }
    // Clearing the selected options map 
    addedSdgsSelectedOptions.clear();
}
;
/**
 * TODO: to prevent duplicated entries + sorted by numbers.
 * Function used to add another sdg to the project.
 */
function addAnotherSdg() {
    console.debug("addAnotherSDG() called");
    //Gettng the number of languages already added
    let sdgElems = document.getElementsByClassName("declaredSdg");
    let totalNumberOfSdgs = sdgElems.length;
    console.debug(`Number of sdgs already added: ${totalNumberOfSdgs}`);
    let number4TheSDGToAdd = totalNumberOfSdgs + 1;
    htmlToAdd4NewSdg = getSdgToAddHTMLString("" + number4TheSDGToAdd);
    // TODO: the 'X' accessibility to check on
    let newSdgAdditionContentElem = document.getElementById("new-sdg-addition-content");
    newSdgAdditionContentElem.insertAdjacentHTML('beforebegin', htmlToAdd4NewSdg);
    addElementEventListenerForChangeEvent(`project-sdg-${number4TheSDGToAdd}`, addOrModifySDGImage, `project-sdg-${number4TheSDGToAdd}`, true);
    //Adding an event listener to remove the language later
    addElementEventListenerForClickAndKeyboardNav(`delete-sdg-${number4TheSDGToAdd}`, removeDeclaredSDG, number4TheSDGToAdd, true);
}
/******************  Addition/removal of prefered language options ***********************/
/**
 * Function used to avoid code redundancy when working with strings related to adding a new language
 * @param value_to_insert The value to substitute inside the string
 * @returns The string to add to the HTML
 */
function getLanguageToAddHTMLString(value_to_insert) {
    let html_to_return = `<li id="li-language-${value_to_insert}" class="added-language-li">
        <div class="new-project-definition-container">
            <label class="new-project-definition-label" for="project-language-${value_to_insert}">
                Language ${value_to_insert}
            </label>
            <div id="project-language-${value_to_insert}-error"></div>
            <div class="new-project-definition-input" style="padding-top:1px;">
                <select id="project-language-${value_to_insert}" class="added-language-select preferedLanguage"
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
function addAnotherLanguage() {
    console.debug("Entering addAnotherLanguage() function");
    //Gettng the number of languages already added
    let languagesElems = document.getElementsByClassName("preferedLanguage");
    let totalNumberOfLanguages = languagesElems.length;
    console.debug(`Number of languages already added: ${totalNumberOfLanguages}`);
    let number4TheLanguageToAdd = totalNumberOfLanguages + 1;
    htmlToAdd4NewLanguage = getLanguageToAddHTMLString("" + number4TheLanguageToAdd);
    // TODO: the 'X' accessibility to check on
    let newLanguageAdditionContentElem = document.getElementById("new-language-addition-content");
    newLanguageAdditionContentElem.insertAdjacentHTML('beforebegin', htmlToAdd4NewLanguage);
    //Adding an event listener to remove the language later
    addElementEventListenerForClickAndKeyboardNav(`delete-language-${number4TheLanguageToAdd}`, removePreferedLanguage, number4TheLanguageToAdd, true);
    //Adding an event listener for duplicated selections (change event)
    addElementEventListenerForChangeEvent(`project-language-${number4TheLanguageToAdd}`, isDuplicateSelectionPresent, "preferedLanguage", "error-in-language-selection", true);
    // The case of non-selection at start-up is ignored. The feature is only informative. A malicious actor could bypass any front-end input validation. Treatment planned on the back-end side.  
}
/**
 * Function used to avoid issues with adding several languages on a single key press
 * @param debug A boolean for debug mode.
 */
function addAnotherLanguageUsingATimeBuffer(debug) {
    if (debug)
        console.debug("addAnotherLanguageUsingATimeBuffer() called");
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
function removePreferedLanguage(number4LanguageToRemove) {
    let debug = false;
    // Getting the added languages elements
    console.debug("\n" + `removePreferedLanguage() called on language number ${number4LanguageToRemove}.`);
    let languagesAddedElems = document.getElementsByClassName("added-language-li");
    let totalNumberOfLanguages = languagesAddedElems.length + 1;
    // Removing the language element
    let parentElem = document.getElementById("languages-list");
    let htmlElemToRemove = document.getElementById(`li-language-${number4LanguageToRemove}`);
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
    let patternToSubstitute = "**number4TheLanguageToAdd**";
    // Building a string similar to the one to insert when adding a new language 
    let referenceString = getLanguageToAddHTMLString("**number4TheLanguageToAdd**");
    let renumberedStrings = renumberString(number4LanguageToRemove, totalNumberOfLanguages, referenceString, patternToSubstitute);
    // Removing the languages added after the one removed (the numbers need to be updated), 
    // before adding the strings with updated numbers.
    for (let i = number4LanguageToRemove + 1; i <= totalNumberOfLanguages; i++) {
        let languageToRemoveId = `li-language-${i}`;
        if (debug)
            console.debug(`  Removing language of id: ${languageToRemoveId}`);
        let htmlToRemove = document.getElementById(languageToRemoveId);
        parentElem?.removeChild(htmlToRemove);
    }
    // Adding the renumbered strings
    let numberBeforeLanguageToRemove = number4LanguageToRemove - 1;
    let previousLanguageItem = document.getElementById(`li-language-${numberBeforeLanguageToRemove}`);
    // TODO: AppSecurity: use of insertAdjacentHTML ?
    previousLanguageItem.insertAdjacentHTML("afterend", renumberedStrings);
    // Renumbering the ids (only the languages after the one removed are taken into account in the returned map.)          
    let renumberedMap = renumberKeyValueMap(number4LanguageToRemove, totalNumberOfLanguages, "project-language-", addedLanguagesSelectedOptions);
    // Setting the recorded values for the options
    if (debug)
        console.debug(`  Setting the recorded values for the options. Size of map: ${renumberedMap.size}`);
    renumberedMap.forEach((value, key) => {
        let elem = document.getElementById(key);
        elem.selectedIndex = parseInt(value);
    });
    // Adding the event listeners that have been deleted
    languagesAddedElems = document.getElementsByClassName("added-language-li");
    totalNumberOfLanguages = languagesAddedElems.length + 1;
    for (let i = number4LanguageToRemove; i <= totalNumberOfLanguages; i++) {
        addElementEventListenerForClickAndKeyboardNav(`delete-language-${i}`, removePreferedLanguage, i, true);
    }
    // Clearing the selected options map 
    addedLanguagesSelectedOptions.clear();
}
;
/****************** Logout (to move eventually; common to the contributor page as well)  ***********************/
function logout() {
    let debug = false;
    if (debug)
        console.debug("logout() called");
    // Removing the HTML from the welcome message
    let welcomeContainer2 = document.getElementById("welcome-container2");
    welcomeContainer2.innerHTML = "";
    // Toggling the visibility of the projects main content
    let projectsMainContent = document.getElementById("projects-main-content");
    projectsMainContent.style.display = 'none';
    // Toggling the visibility of the new account area
    let newAccountProjRep = document.getElementById("new-accountProj-rep-title");
    newAccountProjRep.style.display = 'block';
    // Removing the username data (TODO: to be done better later)
    document.cookie = "username=; path=/;";
    window.location.reload();
}
/******************  Event listeners (incl. for keyboard navigation) ***********************/
/* Listener for the logout link: added after the logout link addition */
/* Listener for the submit button: Listener that checks if username/password can be sent to the backend */
// TDOD: use of the generic code if possible
let authFormSubmit = document.getElementById("auth-form-creation-submit");
authFormSubmit?.addEventListener("click", (event) => signUpDataProcessing(event, "http://127.0.0.1:8080/representatives/new-account", true));
/* Listener for the toggling of visibility in the project dashboard view */
addElementEventListenerForClickAndKeyboardNav("new-project-definition-invite-button", toggleElementVisibility, "new-project-definition-form", true);
/* Listener for the addition of sdgs : for the declaration by default */
addElementEventListenerForChangeEvent("project-sdg-1", addOrModifySDGImage, "project-sdg-1", true);
/* Listener for adding a new sdg */
addElementEventListenerForClickAndKeyboardNav("new-sdg-addition-link", addAnotherSdgUsingATimeBuffer, true);
/* Listener for adding a new language */
addElementEventListenerForClickAndKeyboardNav("new-language-addition-link", addAnotherLanguageUsingATimeBuffer, true);
/* Listener for dupilcated selection of language (other listeners at code generation) */
addElementEventListenerForChangeEvent("project-language-1", isDuplicateSelectionPresent, "preferedLanguage", "error-in-language-selection", true);
/* No listener for dupilcated selection of sdgs. Deciding to consider that the visual clues will be sufficient */
