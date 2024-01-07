import { country_data } from "./data/countries-datahub.io.js";
function getCountryList() {
    let country_list = [];
    const array = JSON.parse(country_data);
    array.forEach(data => country_list.push(data.Name));
    let html_options = "";
    country_list.forEach(country => html_options += `<option value=${country}>${country}</option>`);
    return html_options;
}
function add_country_options() {
    let element = document.getElementById("project-country");
    let html_options = getCountryList();
    console.log(html_options);
    element.innerHTML = html_options;
}
add_country_options();
