document.addEventListener('DOMContentLoaded', registerEvents); // Wait for the DOM to load before registering events

/**
 * Clears local storage and removes session token for logging out.
 */
function clearToken() {
    localStorage.clear()
    sessionStorage.removeItem("token"); //clears session token to enforce when user logs out.

}

/**
 * Registers event listeners after clearing tokens.
 */
function registerEvents(){
    clearToken();
    let loginButton = document.getElementById("submit");
    loginButton.addEventListener('click', login);
}

/**
 * Handles the login process by sending user credentials to the backend.
 * @param {Event} event - The event object triggered by the login button click.
 */
function login(event){
    event.preventDefault();
    let payload = {
        "email":"",
        "password":""
    };
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    console.log("payload: "); console.log(payload);
    payload.email = email;
    payload.password = password;

    let response = postRequest(payload, loginUrl);
    console.log("response: "); console.log(response);
    if(response["successful"]){
        let token = response["data"]["token"];
        sessionStorage.setItem("token",token);
        displayMessage("Login successful");
        window.location.href ="SelectionForm.html";
    }else{
        displayErrorMessage("Login failed!");
    }

}

/**
 * Displays a success message in the designated message area.
 * @param {string} message - The message to display.
 */
function displayMessage(message){
    console.log("inside displayMessage()");
    let container = document.getElementById("messageArea");
    container.style.color = "rgb(0 150 0)"
    container.innerText =message

}


/**
 * Displays an error message in the designated message area.
 * @param {string} message - The error message to display.
 */
function displayErrorMessage(message){
    console.log("inside displayMessage()");
    let container = document.getElementById("messageArea");
    container.style.color = "rgb(250 0 0)"
    container.innerText =message
}

let loginUrl = "http://localhost/internet_programming/task2/backend/api/login.php";

/**
 * Makes a POST request to a specified URL with a JSON payload.
 * @param {Object} payload - The data to send in the request body.
 * @param {string} url - The URL to send the request to.
 * @returns {Object} - The response object from the server.
 */
function postRequest(payload, url) {
    let response = {
        successful: false,
        message: "Invalid request payload"
    };

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType:"application/json",
        data: JSON.stringify(payload),
        async: false,
        success: function(success) {
            console.log("inside jQuery success function");
            console.log("success: "); console.log(success);
            response = success;
        },
        error: function(xhr, status, error) {
            response.message = "An error has occurred";
        }
    });

    return response;
}






