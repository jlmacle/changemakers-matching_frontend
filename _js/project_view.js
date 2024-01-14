import { country_data } from "./data/countries-datahub.io.mjs";
import { language_data } from "./data/languages-datahub.io.mjs";
//  Leaving the code duplication to avoid cognitive load for code reviewers
function getCountryList() {
    let country_list = [];
    const array = JSON.parse(country_data);
    array.forEach(data => country_list.push(data.Name));
    // Should be already sorted. Just in case.
    country_list.sort();
    let html_options = "";
    country_list.forEach(country => html_options += `<option value=${country}>${country}</option>`);
    return html_options;
}
function add_country_options() {
    let element = document.getElementById("project-country");
    let html_options = getCountryList();
    element.innerHTML = html_options;
}
// Adding the options to the page
add_country_options();
function getLanguageList() {
    let language_list = [];
    const array = JSON.parse(language_data);
    array.forEach(data => language_list.push(data.English));
    // Should be already sorted. Just in case.
    language_list.sort();
    let language_options = "";
    language_list.forEach(language => language_options += `<option value=${language}> ${language} </option>`);
    return language_options;
}
function add_language_options() {
    let element = document.getElementById("project-language-1");
    let html_options = getLanguageList();
    element.innerHTML = html_options;
}
//Adding the options to the page
add_language_options();
/**
 * Function used to add another prefered language to the project.
 */
function add_other_language() {
    console.log("Entering add_other_language() function");
    //Gettng the number of languages already added
    let languages_elem = document.getElementsByClassName("prefered_language");
    let language_number = languages_elem.length;
    console.log(`Number of languages already added: ${language_number}`);
    let language_number_incremented = language_number + 1;
    let html_to_add = `<li><div class="new-project-definition-container">
    <label class="new-project-definition-label prefered_language" for="project-language-${language_number_incremented}">
                           Language ${language_number_incremented}
                            </label>
                            <select class="new-project-definition-input"
                            id="project-language-${language_number_incremented}" name="project-language-${language_number_incremented}">`
        + getLanguageList()
        + `</select></div></li>`;
    let new_language_addition_content = document.getElementById("new-language-addition-content");
    new_language_addition_content.insertAdjacentHTML('beforebegin', html_to_add);
}
// TODO : to add keyboard event listener to add_other_language() function
let new_language_addition = document.getElementById("new-language-addition");
new_language_addition.addEventListener("click", add_other_language);
