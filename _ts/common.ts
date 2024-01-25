
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

