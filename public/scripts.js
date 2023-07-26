/*
TODO: NOT WORKING YET, AM NOT ABLE TO CALL THESE INSICE THE CORRESPONDING PLACES
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