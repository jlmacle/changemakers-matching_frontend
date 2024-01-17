import { country_data } from "./data/countries-datahub.io.mjs"; 
import { language_data } from "./data/languages-datahub.io.mjs";

let absolute_time_since_last_language_addition:number = 0;
let absolute_time_for_current_language_addition:number = 1000;

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
    let country_list:string[] = [];
    const array = JSON.parse(country_data) as Country[];   
    array.forEach(data => country_list.push(data.Name)); 
    // Should be already sorted. Just in case.
    country_list.sort();
    let  html_options = "";
    country_list.forEach(country => html_options += `<option value=${country}>${country}</option>`)    
    
    return html_options;
}

function add_country_options(){
    let element = document.getElementById("project-country") as HTMLElement;
    let html_options = getCountryList();
    element.innerHTML = html_options;
}
// Adding the options to the page
add_country_options();

function getLanguageList():string{
    let language_list:string[]=[];
    const array = JSON.parse(language_data) as Language[];    
    array.forEach(data => language_list.push(data.English));
    // Should be already sorted. Just in case.
    language_list.sort();
    let language_options = "";
    language_list.forEach(language => language_options += `<option value=${language}> ${language} </option>`)

    return language_options;

}

function add_language_options(){
    let element = document.getElementById("project-language-1") as HTMLElement;
    let html_options = getLanguageList();
    element.innerHTML = html_options;
}

//Adding the options to the page
add_language_options();


declare global {
    interface Window {
      removePreferedLanguage: (languageNumber:number) => void; //Used for the function to be accessible from the HTML (onclick)
    }
  }

  /**
 * Function used to remove one of the prefered languages
 * @param languageId The id of the language to remove
 */
window.removePreferedLanguage = function(languageNumber:number){
    console.log("\n"+"Entering removePreferedLanguage() function");  
    
    let parent_elem = document.getElementById("languages-list");
    let html_elem_to_remove = document.getElementById(`list-${languageNumber}`) as HTMLElement;
    parent_elem?.removeChild(html_elem_to_remove);
    // TODO: to renumber the languages after the removal to avoid id/name duplicates 



};


/**
 * Function used to add another prefered language to the project.
 */
function add_another_language(){
    console.debug("Entering add_another_language() function");    

    //Gettng the number of languages already added
    let languages_elem = document.getElementsByClassName("prefered_language") as HTMLCollectionOf<HTMLElement>;
    let language_number = languages_elem.length;
    console.debug(`Number of languages already added: ${language_number}`);
    let language_number_incremented = language_number + 1;

    let html_to_add = `<li id="list-${language_number_incremented}">
                            <div class="new-project-definition-container">
                                <label class="new-project-definition-label prefered_language" for="project-language-${language_number_incremented}">
                                    Language ${language_number_incremented}
                                </label>
                                <div class="new-project-definition-input" style="padding-top:1px;">
                                    <select id="project-language-${language_number_incremented}" 
                                        name="project-language-${language_number_incremented}">`
                                        + getLanguageList() +
                                    `</select>  
                                    <span  tabindex="0"  id="delete-language-${language_number_incremented}" 
                                        onclick="window.removePreferedLanguage(${language_number_incremented});">&times;
                                    </span>                                   
                                </div>
                            </div>
                        </li>`;    
                        // TODO: the 'X' accessibility to work on
    let new_language_addition_content = document.getElementById("new-language-addition-content") as HTMLElement;
    new_language_addition_content.insertAdjacentHTML('beforebegin',html_to_add);
}

/**
 * Function used to avoid issues with adding several languages on a single key press
 */
function add_another_language_buffered(){
    let debug = true;
    console.debug("\n"+"Entering add_another_language_buffered() function");

    //Saving the previously recorded time and recording the current time
    absolute_time_since_last_language_addition = absolute_time_for_current_language_addition;
    absolute_time_for_current_language_addition = getAbsoluteTime()

    let time_difference = absolute_time_for_current_language_addition - absolute_time_since_last_language_addition ;
    if(time_difference > 500){        
        console.debug(`Sufficient time difference between two language additions: ${time_difference}
                        \n Adding another language.`)
        add_another_language();
    } 
    else if (debug) console.debug(`Time between two language additions too short: ${time_difference}. Not adding another language.`);
    
}


let new_language_addition = document.getElementById("new-language-addition-link") as HTMLElement;
new_language_addition.addEventListener("click", add_another_language_buffered);
new_language_addition.addEventListener("keydown", function(event){
    if (event.key === "Enter" || event.key === " ") {
        add_another_language_buffered();
    }
});


