document.addEventListener('DOMContentLoaded', registerEvents); //calls the registerEvents function after the DOM has been loaded by the browser
let url = "http://localhost/internet_programming/task2/backend/api/add-team.php"; //url for adding new teams to the system

/**
 * A function that registers events and calls other initialization function
 */
function registerEvents(event){
    authenticate(event);
    let addTeamSubmit = document.getElementById("addTeamSubmit");
    addTeamSubmit.addEventListener('click', addTeam);
}


/**
 * a function that authenticates user based on the presence of a session token issue by the backend
 * @param event DOM event
 */
function authenticate(event){
    event.preventDefault();
    let token = sessionStorage.getItem("token");
    console.log("token: ");
    console.log(token);
    if (token === null) {
        window.location.href = "login.html";
    }
}


function addTeam(){
    let payload = getPayloadFromForm();
    let token = sessionStorage.getItem('token');
    if(token ===null){
        window.location.href = "login.html";
    }
    let headers = {
        "Authorization":`Bearer ${token}`
    }
    let response = callToServer(url,payload,headers);

    let messageDiv = document.getElementById("messageBoard");
    messageDiv.innerText = response.message;
    if(response.successful){
        window.location.reload();
        messageDiv.style.color = "#006400";
    }else{
        messageDiv.style.color = "#FF0000";
    }

}
/**
 * Function to get the payload data from the form
 * @return Object containing form data
 */

function getPayloadFromForm(){
    let name = document.getElementById("nameInput").value;
    let city = document.getElementById("cityInput").value;
    let manager = document.getElementById("managerInput").value;
    let established = document.getElementById("establishedInput").value;
    let president = document.getElementById("presidentInput").value;
    let played = document.getElementById("playedInput").value;
    let won = document.getElementById("wonInput").value;
    let drawn = document.getElementById("drawnInput").value;
    let lost = document.getElementById("lostInput").value;
    let gf = document.getElementById("gfInput").value;
    let ga = document.getElementById("gaInput").value;
    // let points = document.getElementById("pointsInput").value;

    return {
        "name":name,
        "city":city,
        "manager":manager,
        "established":established,
        "president":president,
        "noIfTrophies":"",
        "played":played,
        "won":won,
        "drawn":drawn,
        "lost":lost,
        "gf":gf,
        "against":ga
        // "points":points
    }
}

/**
 * Function to make a call to the server
 * @param url URL to which the request is made
 * @param payload Data to be sent in the request
 * @param headers Headers to be included in the request
 * @return Object containing the response from the server
 */

function callToServer(url, payload, headers) {
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
        headers:headers,
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







