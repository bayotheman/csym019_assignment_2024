document.addEventListener('DOMContentLoaded', registerEvents);// Wait for the DOM to be fully loaded before executing



/**
 * Registers the event handler for the register button.
 */
function registerEvents(){

    let registerButton = document.getElementById("register");
    registerButton.addEventListener('click', register);
}
/**
 * Handles the registration process, including form submission and communication with the backend.
 * @param {Event} event - The event object triggered by the button click.
 */
function register(event){
    event.preventDefault();
    let payload = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email:document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword:document.getElementById('confirmPassword').value
    }
    console.log(payload);

    let url = "http://localhost/internet_programming/task2/backend/api/register.php"
    let response = postRequest(payload,url );
    let messageDiv =  document.getElementById("messageArea");

    if(response["successful"]){
        messageDiv.style.color="rgb(0 150 0)"
        messageDiv.innerText = response["message"];
    }else{
        messageDiv.innerText= "An error occurred ";

    }


}

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








