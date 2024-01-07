import {country_data} from "./data/countries-datahub.io.js"; 

interface Country {
    Code: string;
    Name: string;
}


function getCountryList(): string
{
    let country_list:string[] = [];
    const array = JSON.parse(country_data) as Country[];
    array.forEach(data => country_list.push(data.Name)); 
    let  html_options = "";
    country_list.forEach(country => html_options += `<option value=${country}>${country}</option>`)    
    
    return html_options;
}

function add_country_options(){
    let element = document.getElementById("project-country") as HTMLElement;
    let html_options = getCountryList();
    console.log(html_options);
    element.innerHTML = html_options;
}
// Adding the options to the page
add_country_options();
