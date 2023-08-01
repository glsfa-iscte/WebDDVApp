/*
TODO: NOT WORKING YET, AM NOT ABLE TO CALL THESE INSIDE THE CORRESPONDING PLACES
// Function to toggle the sidenav
function toggleSidebar() {
    const sidenav = document.querySelector('.sidenav');
    const sidenavToggle = document.querySelector('.sidenav-toggle');

    // Toggle the 'sidenav-closed' class to hide/show the sidenav
    sidenav.classList.toggle('sidenav-closed');

    // Change the button text to indicate open/close state
    if (sidenav.classList.contains('sidenav-closed')) {
        sidenavToggle.innerHTML = '☰'; // Hamburger icon
    } else {
        sidenavToggle.innerHTML = '✕'; // Close icon
    }
}
*/

// Sign up form validation
/**
 * Function to check if the password matches the confirm password and meets all the aditional requirements, and if it does, enable the submit button
 * @param {*} passwordId id of the password input
 * @param {*} confirmPasswordId id of the confirm password input
 * @param {*} submitInputId  id of the submit input 
 * @param {*} passwordCheckMatchId  id of the password check match element
 * @param {*} passwordCheckHassUppercaseId id of the password check uppercase element
 * @param {*} passwordCheckHasNumberId id of the password check number element
 * @param {*} passwordCheckLengthId id of the password check length element
 */
/*
function checkPasswordRequirements(passwordId, confirmPasswordId, submitInputId, passwordCheckMatchId, passwordCheckHassUppercaseId, passwordCheckHasNumberId, passwordCheckLengthId) {
    const password = document.getElementById(passwordId).value;
    const confirmPassword = document.getElementById(confirmPasswordId).value;
    const submitInput = document.getElementById(submitInputId);

    checkPasswordMatches(password, confirmPassword, submitInput, passwordCheckMatch, passwordCheckMatchId);
    checkPasswordUppercase(password, passwordCheckHassUppercaseId);
    checkPasswordNumber(password, passwordCheckHasNumberId);
    checkPasswordLength(password, passwordCheckLengthId);

}

function checkPasswordMatches(password, confirmPassword, submitInput, passwordCheckMatchId) {
    const passwordCheckMatch = document.getElementById(passwordCheckMatchId);
    if (password !== confirmPassword || password.length != confirmPassword.length) {
        submitInput.disabled = true;
        submitInput.style.opacity = "0.5";
        
        passwordCheckMatch.innerHTML = "Passwords don't match";
        passwordCheckMatch.style.color = "red";
        passwordCheckMatch.style.opacity = "1";
    } else {
        submitInput.disabled = false;
        submitInput.style.opacity = "1";

        passwordCheckMatch.innerHTML = "Passwords match";
        passwordCheckMatch.style.color = "green";
        passwordCheckMatch.style.opacity = "0.5";
    }
}

function checkPasswordLength(password, passwordCheckLengthId) {
    const passwordCheckLength = document.getElementById(passwordCheckLengthId);
    if (password.length >= 8 && password.length <= 32) {
        passwordCheckLength.style.color = "green";
        passwordCheckLength.style.opacity = "0.5";
    } else {
        passwordCheckLength.style.color = "red";
        passwordCheckLength.style.opacity = "1";
    }
}
function checkPasswordNumber(password, passwordCheckHasNumberId) {
    const passwordCheckHasNumber = document.getElementById(passwordCheckHasNumberId);
    if (password.match(/[0-9]/)) {
        passwordCheckHasNumber.style.color = "green";
        passwordCheckHasNumber.style.opacity = "0.5";
    } else {
        passwordCheckHasNumber.style.color = "red";
        passwordCheckHasNumber.style.opacity = "1";
    }
}
function checkPasswordUppercase(password, passwordCheckHassUppercaseId) {
    const passwordCheckHasUppercase = document.getElementById(passwordCheckHassUppercaseId);
    if (password.match(/[A-Z]/)) {
        passwordCheckHasUppercase.style.color = "green";
        passwordCheckHasUppercase.style.opacity = "0.5";
    } else {
        passwordCheckHasUppercase.style.color = "red";
        passwordCheckHasUppercase.style.opacity = "1";
    }
}
*/

// Your code that uses the variables
//const { APP_ID, APP_KEY, LICENSE, MQTT_ADDRESS, USER, PASSWORD } = window.config;


console.log("OPENING SCRIPTS.JS")

function platformVerifyLicense(APP_ID, APP_KEY, LICENSE) {
    let token = window.djiBridge.platformVerifyLicense(
        APP_ID,
        APP_KEY,
        LICENSE
    );
    log("platform is verified: " + window.djiBridge.platformIsVerified());
}

function registerParams(MQTT_ADDRESS, USER, PASSWORD) {
    let register_params = JSON.stringify({
        host: MQTT_ADDRESS,
        connectCallback: "reg_calback",
        username: USER,
        password: PASSWORD,
    });
    return register_params;
}

//Used to load the cloud module
function loadModule(register_params) {
    log("Load Component: thing " +
        window.djiBridge.platformLoadComponent("thing", register_params) +
        "\n State: " +
        window.djiBridge.thingGetConnectState());
}

function establishConnection(USER, PASSWORD) {
    log(
        "Start the connection thingconn: " +
        window.djiBridge.thingConnect(USER, PASSWORD, "reg_calback")
    );
    log("Thing Connect state: " + window.djiBridge.thingGetConnectState());
}

/**
 * @param {string} uuid - the identifier of the workspace Identifier, the id must be uuid grid format. 
 *                        Example: e3dea0f5-37f2-4d79-ae58-490af3228069
 */
function setWorkspaseId(uuid) {
    window.djiBridge.platformSetWorkspaceId(uuid)
}

/** Set platform name
 * @param {string} platformName - platform name
 * @param {string} workspaceName - the name displayed on the Pilot cloud portal
 * @param {string} desc - the description displayed on the Pilot cloud portal
 */
function setPlatformName(platformName, workspaceName, desc) {
    window.djiBridge.platformSetInformation(platformName, workspaceName, desc)
}