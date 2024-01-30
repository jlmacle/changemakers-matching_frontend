import { countryData } from "./data/countries-datahub.io.mjs"; 
import { languageData } from "./data/languages-datahub.io.mjs";
import {sdgLabels} from "./data/sdg-labels.mjs";

import { addElementEventListenerForChange, addElementEventListenerForClickAndKeyboardNav, decrementRelatedElementId, getAbsoluteTime, toggleElementVisibility,  removeElement, renumberKeyValueMap, renumberString, isDuplicateSelectionPresent } from "./common.js";

let absoluteTimeSinceLastLanguageAddition:number = 0;
let absoluteTimeForCurrentLanguageAddition:number = 1000;
let absoluteTimeSinceLastSdgAddition: number = 0;
let absoluteTimeForCurrentSdgAddition:number = 1000;

let addedLanguagesSelectedOptions: Map<string,string> = new Map<string, string>();
let htmlToAdd4NewLanguage = "";
let addedSdgsSelectedOptions: Map<string,string> = new Map<string, string>();
let htmlToAdd4NewSdg = "";

let sdgImageNames: string[] = [];
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
        fetch (url, {                                                          // 📖 AppSecurity: Use of Fetch over XMLHttpRequest, Anssi: R44
            method:'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({username: username, password: password})
        })
        .then(response => response.text())
        .then(stringToSanitize => {     
            // temp cookie for testing (to be done better later)
            document.cookie = `username=${username}; path=/; max-age=360000;`; // 📖 AppSecurity: Setting a session cookie https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_CheatSheet.html
            if (debug) console.debug("Cookie set: " + document.cookie);        // 📖 AppSecurity: (when using HTTPS) "The purpose of the secure attribute is to prevent cookies from being observed by unauthorized parties due to the transmission of the cookie in clear text. To accomplish this goal, browsers which support the secure attribute will only send cookies with the secure attribute when the request is going to an HTTPS page." https://owasp.org/www-community/controls/SecureCookieAttribute 
  
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
    let authFormElem = document.getElementById("new-accountProj-rep-title") as HTMLElement;
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

interface SDG {
    Label: string,
    Image: string
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


function getSDGList():string{
    let sdgList: string[] = [];
    const array = JSON.parse(sdgLabels) as SDG[];
    array.forEach(data => sdgList.push(data.Label));
    array.forEach(data => sdgImageNames.push(data.Image));
    // Should be already sorted. Just in case.
    sdgList.sort();
    let sdgOptions = "";
    sdgList.forEach(label => sdgOptions+= `<option value=${label}> ${label} </option>`);

    return sdgOptions;
}

function addSDGOptions(){
    let element = document.getElementById("project-sdg-1") as HTMLElement;
    let sdgOptions = getSDGList();
    element.innerHTML = sdgOptions;
}

addSDGOptions(); /* Will also build the list of sdg images names */

/******************  sdgs-related methods ***********************/

/**
 * Function thats adds an sdg icon to the left sidebar when adding a sdg to the project profile.
 * @param selectId the id of the select element
 * @param debug A boolean for debug mode.
 */

function addOrModifySDGImage(selectId:string, debug:boolean){
    if (debug) {
        console.debug("addOrModifySDGImage() called");
        console.debug(`selectId: ${selectId}`);
    }
    let elem = document.getElementById(selectId) as HTMLSelectElement;
    let sdgNumber = elem.selectedIndex + 1;
        // Getting the image name:
    let sdgImageName =  sdgImageNames[sdgNumber-1];
    if (debug) {
        console.debug(`sdgNumber: ${sdgNumber}`);
        console.debug(`sdgImageName: ${sdgImageName}`);
    }
    let filePath = fileDir+sdgImageName;
    // Building/Updating the sidebar HTML
    let imgId = `img-${selectId}`;
    let potentialElem = document.getElementById(imgId);
    if (potentialElem)
    {
        console.debug(`Element with id ${imgId} exists, and is being updated.`);
        potentialElem.setAttribute("src",`${filePath}`);
    }
    else {
        console.debug(`Element with id ${imgId} doesn't exist, and is being created.`);        
        let htmlToAdd = `<img id="img-${selectId}" aria-label="" src=${filePath}>`;
        let parentElem = document.getElementById("sidebar-sticky-wrapper");
        parentElem?.insertAdjacentHTML("beforeend", htmlToAdd);
    }
}

/** Function used to avoid code redundancy when working with strings related to adding a new sdg
* @param value_to_insert The value to substitute inside the string
* @returns The string to add to the HTML 
*/
function getSdgToAddHTMLString(value_to_insert:string): string{
   let html_to_return = 
   `<li id="li-sdg-${value_to_insert}" class="added-sdg-li">
       <div class="new-project-definition-container">
           <label class="new-project-definition-label declaredSdg" for="project-sdg-${value_to_insert}">
               SDG ${value_to_insert}
           </label>
           <div id="project-sdg-${value_to_insert}-error"></div>
           <div class="new-project-definition-input" style="padding-top:1px;">
               <select id="project-sdg-${value_to_insert}" class="added-sdg-select"
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
function addAnotherSdgUsingATimeBuffer(debug:boolean){
    if (debug) console.debug("addAnotherSdgUsingATimeBuffer() called");

    //Saving the previously recorded time and recording the current time
    absoluteTimeSinceLastSdgAddition = absoluteTimeForCurrentSdgAddition;
    absoluteTimeForCurrentSdgAddition = getAbsoluteTime();

    let timeDifference = absoluteTimeForCurrentSdgAddition - absoluteTimeSinceLastSdgAddition ;
    if(timeDifference > 500){        
        console.debug(`Sufficient time difference between two sdg additions: ${timeDifference}
                        \n Adding another sdg.`)
        addAnotherSdg();
    } 
    else if (debug) console.debug(`Time between two sdg additions too short: ${timeDifference}. Not adding another sdg.`);
    
}

/**
 * Function used to remove one of the declared sdgs.
 * @param number4SdgToRemove The number of the sdg to remove
 */
function removeDeclaredSDG(number4SdgToRemove:number){
    let debug = true;  
    
    // Getting the added sdgs elements
    console.debug("\n"+`removeDeclaredSDG() called on sdg number ${number4SdgToRemove}.`);  
    let sdgsAddedElems = document.getElementsByClassName("added-sdg-li") as HTMLCollectionOf<HTMLElement>;
    let totalNumberOfSdgs = sdgsAddedElems.length + 1;

    // Removing the image
    removeElement(`img-project-sdg-${number4SdgToRemove}`, "sidebar-sticky-wrapper");
    
    // Removing the language element
    let parentElem = document.getElementById("sdgs-list");
    let htmlElemToRemove = document.getElementById(`li-sdg-${number4SdgToRemove}`) as HTMLElement;
    parentElem?.removeChild(htmlElemToRemove);    
 
    // Before removing the next languages, storing the current id-value pairs:
    if (debug) console.debug("  Storing the current id-value pairs before removing following sdgs.");
    let addedSdgSelectElems = document.getElementsByClassName("added-sdg-select") as HTMLCollectionOf<HTMLSelectElement>;
    for (let elem of addedSdgSelectElems){        
        addedSdgsSelectedOptions.set(elem.id,""+ elem.selectedIndex);
        if (debug) console.debug(`      Added to map: Index selected: ${addedSdgsSelectedOptions.get(elem.id)} for key ${elem.id}`);
    }

    // Building the renumbered language strings to add later
    let patternToSubstitute: string = "**number4TheSdgToAdd**";
        // Building a string similar to the one to insert when adding a new language 
    let referenceString: string = getSdgToAddHTMLString("**number4TheSdgToAdd**");   
    let renumberedStrings = renumberString(number4SdgToRemove, totalNumberOfSdgs, referenceString, patternToSubstitute);

    // Removing the languages added after the one removed (the numbers need to be updated), 
    // before adding the strings with updated numbers.
    for(let i=number4SdgToRemove+1; i<= totalNumberOfSdgs; i++){
        let sdgToRemoveId = `li-sdg-${i}`;
        if (debug) console.debug(`  Removing sdg of id: ${sdgToRemoveId}`);
        let htmlToRemove = document.getElementById(sdgToRemoveId) as HTMLElement;
        parentElem?.removeChild(htmlToRemove);

        // Renaming the ids in the pictures
        decrementRelatedElementId("img-project-sdg-", `img-project-sdg-${i}`);
    }    

    // Adding the renumbered strings
    let numberBeforeSdgToRemove = number4SdgToRemove - 1;
    let previousSdgItem = document.getElementById(`li-sdg-${numberBeforeSdgToRemove}`) as HTMLElement;
    // TODO: AppSecurity: use of insertAdjacentHTML ?
    previousSdgItem.insertAdjacentHTML("afterend",renumberedStrings);    

    // Renumbering the ids (only the languages after the one removed are taken into account in the returned map.)          
    let renumberedMap = renumberKeyValueMap(number4SdgToRemove, totalNumberOfSdgs, "project-sdg-", addedSdgsSelectedOptions);
       // Setting the recorded values for the options
    if (debug) console.debug(`  Setting the recorded values for the options. Size of map: ${renumberedMap.size}`);     
    renumberedMap.forEach((value,key) => { 
        let elem = document.getElementById(key) as HTMLSelectElement;        
        elem.selectedIndex = parseInt(value);       
    });        

    // Adding the event listeners that have been deleted
    sdgsAddedElems = document.getElementsByClassName("added-sdg-li") as HTMLCollectionOf<HTMLElement>;
    totalNumberOfSdgs = sdgsAddedElems.length + 1;
    for(let i=number4SdgToRemove; i<= totalNumberOfSdgs; i++){
        addElementEventListenerForClickAndKeyboardNav(`delete-sdg-${i}`, removeDeclaredSDG, i, true);
    }

    // Clearing the selected options map 
    addedSdgsSelectedOptions.clear();   

};

/**
 * TODO: to prevent duplicated entries
 * Function used to add another sdg to the project.
 */
function addAnotherSdg(){
    console.debug("addAnotherSDG() called");    

    //Gettng the number of languages already added
    let sdgElems = document.getElementsByClassName("declaredSdg") as HTMLCollectionOf<HTMLElement>;
    let totalNumberOfSdgs = sdgElems.length;
    console.debug(`Number of sdgs already added: ${totalNumberOfSdgs}`);
    let number4TheSDGToAdd = totalNumberOfSdgs + 1;

    htmlToAdd4NewSdg = getSdgToAddHTMLString(""+number4TheSDGToAdd);    
 
    // TODO: the 'X' accessibility to check on
    let newSdgAdditionContentElem = document.getElementById("new-sdg-addition-content") as HTMLElement;
    newSdgAdditionContentElem.insertAdjacentHTML('beforebegin',htmlToAdd4NewSdg);


    addElementEventListenerForChange(`project-sdg-${number4TheSDGToAdd}`, addOrModifySDGImage, `project-sdg-${number4TheSDGToAdd}`, true);
  
    //Adding an event listener to remove the language later
    addElementEventListenerForClickAndKeyboardNav(`delete-sdg-${number4TheSDGToAdd}`, removeDeclaredSDG, number4TheSDGToAdd, true);
}

/******************  Addition/removal of prefered language options ***********************/


/**
 * Function used to avoid code redundancy when working with strings related to adding a new language
 * @param value_to_insert The value to substitute inside the string
 * @returns The string to add to the HTML 
 */
function getLanguageToAddHTMLString(value_to_insert:string): string{
    let html_to_return = 
    `<li id="li-language-${value_to_insert}" class="added-language-li">
        <div class="new-project-definition-container">
            <label class="new-project-definition-label preferedLanguage" for="project-language-${value_to_insert}">
                Language ${value_to_insert}
            </label>
            <div id="project-language-${value_to_insert}-error"></div>
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
 * TODO: to prevent duplicated entries
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
    if (debug) console.debug("addAnotherLanguageUsingATimeBuffer() called");

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
    let htmlElemToRemove = document.getElementById(`li-language-${number4LanguageToRemove}`) as HTMLElement;
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
        let languageToRemoveId = `li-language-${i}`;
        if (debug) console.debug(`  Removing language of id: ${languageToRemoveId}`);
        let htmlToRemove = document.getElementById(languageToRemoveId) as HTMLElement;
        parentElem?.removeChild(htmlToRemove);
    }    

    // Adding the renumbered strings
    let numberBeforeLanguageToRemove = number4LanguageToRemove - 1;
    let previousLanguageItem = document.getElementById(`li-language-${numberBeforeLanguageToRemove}`) as HTMLElement;
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
    let newAccountProjRep = document.getElementById("new-accountProj-rep-title") as HTMLElement;
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
addElementEventListenerForClickAndKeyboardNav("new-project-definition-invite-button", toggleElementVisibility, "new-project-definition-form", true);

/* Listener for the addition of sdgs : for the declaration by default */
addElementEventListenerForChange("project-sdg-1", addOrModifySDGImage, "project-sdg-1", true);

/* Listener for adding a new sdg */
addElementEventListenerForClickAndKeyboardNav("new-sdg-addition-link", addAnotherSdgUsingATimeBuffer, true);

/* Listener for adding a new language */ 
addElementEventListenerForClickAndKeyboardNav("new-language-addition-link", addAnotherLanguageUsingATimeBuffer, true);



