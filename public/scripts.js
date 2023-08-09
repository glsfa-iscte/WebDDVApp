//SIGN UP FORM CONTROL FUNCTIONS, USED BY SIGNUP.EJS
/**
 * Function to check if the password matches the confirm password and meets all the aditional requirements, and if it does, enable the submit button
 * @param {*} passwordId id of the password input
 * @param {*} confirmPasswordId id of the confirm password input
 * @param {*} submitInputId  id of the submit input 
 * @param {*} passwordCheckMatchId  id of the password check match element
 * @param {*} passwordCheckHasUppercaseId id of the password check uppercase element
 * @param {*} passwordCheckHasNumberId id of the password check number element
 * @param {*} passwordCheckLengthId id of the password check length element
 */

function checkPasswordRequirements(passwordId, confirmPasswordId, submitInputId, passwordCheckMatchId, passwordCheckHasUppercaseId, passwordCheckHasNumberId, passwordCheckLengthId) {
    const password = document.getElementById(passwordId).value;
    const confirmPassword = document.getElementById(confirmPasswordId).value;
    const submitInput = document.getElementById(submitInputId);

    checkPasswordMatches(password, confirmPassword, submitInput, passwordCheckMatchId);
    checkPasswordUppercase(password, passwordCheckHasUppercaseId);
    checkPasswordNumber(password, passwordCheckHasNumberId);
    checkPasswordLength(password, passwordCheckLengthId);

}

/**
 * Check if the password matches the confirm password and change the style and text of the password check match element accordingly
 * @param {*} password the password input
 * @param {*} confirmPassword the confirm password input
 * @param {*} submitInput the submit input
 * @param {*} passwordCheckMatchId the id of the password check match element
 */
function checkPasswordMatches(password, confirmPassword, submitInput, passwordCheckMatchId) {
    const passwordCheckMatch = document.getElementById(passwordCheckMatchId);
    if (password == "" || password !== confirmPassword || password.length != confirmPassword.length) {
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

/**
 * Check if the password meets the length requirement and change the style of the password check length element accordingly
 * @param {*} password the password input
 * @param {*} passwordCheckLengthId the id of the password check length element
 */
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

/**
 * Check if the password has at least one number and change the style of the password check number element accordingly
 * @param {*} password the password input
 * @param {*} passwordCheckHasNumberId the id of the password check number element
 */
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

/**
 * Check if the password has at least one uppercase letter and change the style of the password check uppercase element accordingly
 * @param {*} password 
 * @param {*} passwordCheckHassUppercaseId 
 */
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

//SIDENAV CONTROL FUNCTIONS, USED BY HEADER.EJS
/**
 * Open the side navigation by setting the width of the side navigation to 250px
 */
function openNav() {
    document.getElementById("sideNav").style.width = "250px";
}

/**
 * Close the side navigation by setting the width of the side navigation to 0
 */
function closeNav() {
    document.getElementById("sideNav").style.width = "0";
}

//ACCESS TO THE CLOUD API, USED BY ACCESSCLOUDAPI.EJS
/**
 * The appId and appKey and license need to be requested on the developer website.
 * @param {*} APP_ID the dji developer app id
 * @param {*} APP_KEY the dji developer app key
 * @param {*} LICENSE the dji developer license
 */
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

/**
 * The process of loading the cloud module will initiate an MQTT login request, so the server needs to pre-configure the login password for the MQTT gateway
 * @param {*} register_params the mqtt connection parameters
 */
function loadModule(register_params) {
    log("Load Component: thing " +
        window.djiBridge.platformLoadComponent("thing", register_params) +
        "\n State: " +
        window.djiBridge.thingGetConnectState());
}

/**
 * Start the connection to the thing model
 * @param {*} USER the mqtt username
 * @param {*} PASSWORD the mqtt password
 */
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