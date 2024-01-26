
/****************** Generic code for event listeners  ***********************/

let timeSince1970WhenThePreviousEventIsFired:number = 0;
let timeSince1970WhenTheCurrentEventIsFired:number = 1000;


/**
 * Function used to avoid several events fired on a single keystroke.
 * The function passed in parameter is called only if the delay between 2 events is > 500 ms.
 * @param functionToCall The function to call potentially.
 * @param debug A boolean for debug mode.
 * @param ...args The arguments for the function.
 */
function functionCallingAnotherFunctionUsingATimeBuffer<T>
    (
        functionToCall: (...args: any[]) => T , 
        // Function with an unknown number and types of arguments, and an unknown return type
        ...args:any[]
    )
    {
        let debug = false;
        if (debug) console.debug(`timeSince1970WhenThePreviousEventIsFired: ${timeSince1970WhenThePreviousEventIsFired}`+"\n"+
                                `timeSince1970WhenTheCurrentEventIsFired: ${timeSince1970WhenTheCurrentEventIsFired}`);
        let delayBetweenEvents = timeSince1970WhenTheCurrentEventIsFired - timeSince1970WhenThePreviousEventIsFired;
        if (delayBetweenEvents < 500) console.debug(`Event ignored. Delay between the 2 events is < 500 ms (${delayBetweenEvents} ms).`);
        else {functionToCall(...args); console.debug(`Event responded to. Delay between the 2 events is > 500 ms (${delayBetweenEvents} ms).`);}
    }

/**
 * Function used to add an event listener to an element.
 * The event listener responds to clicks, “Enter” keystrokes, and “Space” keystrokes.
 * @param elementId The id of the single element to add an event listener to.
 * @param functionCalledByTheEventListener The function to call when the event is fired. 
 */
export const  addElementEventListenerForClickAndKeyboardNav 
    =  <T>
        (   
            elementId:string, 
            functionToCall: (...args: any[]) => T,
            ...args:any[]

        ) => {
            let element = document.getElementById(elementId) as HTMLElement;
            element.addEventListener("click", (event) => {
                    console.debug("\n"+"Event called with a click.");
                    let date = new Date();  
                    timeSince1970WhenTheCurrentEventIsFired = date.getTime();
                    functionCallingAnotherFunctionUsingATimeBuffer(functionToCall, ...args); 
                    timeSince1970WhenThePreviousEventIsFired =  timeSince1970WhenTheCurrentEventIsFired;   
                });
            element.addEventListener("keydown", function(event){
                if (event.key === "Enter" || event.key === " ") {
                    console.debug("\n"+`Event called with: *${event.key}*`);
                    let date = new Date();  
                    timeSince1970WhenTheCurrentEventIsFired = date.getTime();
                    functionCallingAnotherFunctionUsingATimeBuffer(functionToCall, ...args);
                    timeSince1970WhenThePreviousEventIsFired =  timeSince1970WhenTheCurrentEventIsFired;
                }
            });

        }


/****************** Toggle functions  ***********************/

/**
 * Function used to toggle the visibility of an element.
 * @param elementId the id of the element to toggle.
 * @param debug a boolean for debug mode.
 */
export const toggleElementVisibility = 
    (
        elementId: string, 
        debug:boolean

    ) => {
        if (debug) console.debug("toggleElementVisibility() called");
        let element = document.getElementById(elementId) as HTMLElement;

        if (element.style.display == "block"){
            element.style.display = "none";
        }
        else if (element.style.display == "none"){
            element.style.display = "block";
        }
    };

/**
 * NOT USED AFTER CODE REFACTORING
 * Function used to toggle the font weight of an element from bold to normal and vice-versa.
 * @param elementId the id of the element to toggle
 */
function toggleElementBoldness 
    (
        elementId: string
    ){
        let element = document.getElementById(elementId) as HTMLElement;

        if(element.style.fontWeight == "bold"){
            element.style.fontWeight = "normal";
        }

        else if (element.style.fontWeight ==  "normal"){
            element.style.fontWeight = "bold";
        }
        else{
            console.warn(`Unexpected fontweight value: ${element.style.fontWeight}`);
            
        }
};

/****************** Sign-up/Sign-in data ***********************/

/**
 * Function used to push the username and password to the backend, and to build the user dashboard when logged in.
 * @param event The event that triggered the function.
 * @param url The url to send the data to.
 * @param displayViewFunction The function used to display the view.
 * @param debug A boolean for debug mode.
 * 
 */

// TODO: a generic Sign-up/Sign-in function

/****************** Function used when adding elements/removing elements from a list (sdgs, languages,...) ***********************/

/**
 * Function used to monitor if duplicate selections exist in a list, and used to display an error message in case of duplication.
 * @param className the name of the class the elements belong to.
 * @param errorElementId the id of the element used to display an error message.
 */

export const isDuplicateSelectionPresent = 
    (
        className: string, 
        errorElementId:string, debug:boolean
        
    ) => {
        if (debug) console.debug("isDuplicateSelectionPresent() called.");
        let elems = document.getElementsByClassName(className) as HTMLCollectionOf<HTMLSelectElement>;  
        let selectedValues: number[] = [];
        let selectedValuesSet = new Set(selectedValues);

        for (let elem of elems) {
            selectedValues.push(elem.selectedIndex);
        }

        if (selectedValuesSet.size == selectedValues.length){
            if (debug) console.debug("No duplicated values.")
        }
        else {
            if (debug) {console.debug("Duplicated values exist. Displaying error message.");}            
            let errorElem = document.getElementById(errorElementId) as HTMLElement;
            errorElem.innerHTML="⚠️ Duplicate selection. Please correct your choice.";
        }    
    }

/**
 * Function used to renumber elements in a string (in the context of having removed an element of a list).
 * @param numberRemoved the number of the element to remove from the list.
 * @param totalNumberOfElements the total number of elements present in the list.
 * @param patternStringToRenumber the reference HTML string that will be used when re-adding content in the document. 
 * @param patternToSubstitute the pattern to subtitute when renumbering.
 * @returns the string renumbered
 */
export const renumberString = 
    (
        numberRemoved:number, 
        totalNumberOfElements:number, 
        patternStringToRenumber:string, 
        patternToSubstitute:string
        
    ): string => {
        let debug = false;
        
        let stringToReturn = "";
        for(let i=numberRemoved; i<= totalNumberOfElements-1; i++){
            let patternStringRenumbered = patternStringToRenumber.replaceAll(patternToSubstitute, ""+i);
            stringToReturn += patternStringRenumbered;

            if(debug) console.debug(`for i=${i}, string=${patternStringRenumbered}`);
        }

        return stringToReturn;
    }

/**
 * Function used to renumber the labels of an item list (e.g. "Language 1", "SDG 2"), whiile keeping the previously selected values.
 * @param numberRemoved the number of the element that was removed from the list.
 * @param totalNumberOfElements the total number of elements present in the list.
 * @param idPattern the pattern used in ids (e.g. "project-language-").
 * @param originalMap the map containing the (ids:selectedvalues) pairs, built after an element was removed from the list.
 * @returns a map that contains renumbered ids with kept selected values.
 */

export const renumberKeyValueMap = 
    (
        numberRemoved:number, 
        totalNumberOfElements:number, 
        idPattern:string, 
        originalMap:Map<string,string>
        
    ) => {
        let debug = true;
        if (debug) {
            console.debug("     Content of the original id-value map before renumbering.");
            originalMap.forEach((value,key) => console.debug(`          Key: ${key}, value: ${value}`));
        }

        let mapToReturn:Map<string,string> = new Map<string,string>();
        // Need to renumber the languages that were after the language deleted, before re-displaying their data.
        for(let i=numberRemoved+1; i<=totalNumberOfElements; i++){        
            let renumberedId = idPattern+(i-1);
            //Getting the original data
            let value = originalMap.get(idPattern+i);
            //Adding to the returned map
            mapToReturn.set(renumberedId, ""+value);
        }
        if(debug) {
            console.debug("     Content of the id-value map after renumbering.");
            mapToReturn.forEach((value, key)  => {console.debug(`           Key: ${key}, Value: ${value}`) } );
        }

        return mapToReturn;
    }

/****************** Misc.  ***********************/

/**
 * Function used to get the time elapsed in milliseconds since 1970.
 * @returns 
 */
export const getAbsoluteTime= ():number => {
    console.debug("Entering getAbsoluteTime() function");
    const date = new Date();
    return date.getTime();
}

/**
 * Function used to re-direct toward the home page 
 */
function redirectToHomePage(){
    document.location.href = "../_html/index.html";
}

/*********************** Adding the event listeners *****************************/

addElementEventListenerForClickAndKeyboardNav("header-title-container",redirectToHomePage,true);

/* TODO Event listeners for footer links */

