document.addEventListener('DOMContentLoaded', registerEvents);

function registerEvents(){
    let submit = document.getElementById("submit");
    submit.addEventListener('click', login);
}

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

    let response = loginRequest(payload);
    console.log("response: "); console.log(response);
    if(response["successful"]){
        let token = response["data"]["token"];
        sessionStorage.setItem("token",token);
        displayMessage("Login successful");
        window.location.href ="SelectionForm.html";
    }else{
        displayErrorMessage("Login failed!");
    }

    console.log("inside login()");
    displayMessage();
}

function displayMessage(message){
    console.log("inside displayMessage()");
    let container = document.getElementById("messageArea");
    console.log("message area:");  console.log(container);
    container.innerText =message
}

function displayErrorMessage(message){
    console.log("inside displayMessage()");
    let container = document.getElementById("messageArea");
    console.log("message area:");  console.log(container);
    container.innerText =message
}

let loginUrl = "http://localhost/task2/backend/api/login.php";


function loginRequest(payload) {
    let response = {
        successful: false,
        message: "Invalid request payload"
    };

    $.ajax({
        url: loginUrl,
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

// function loginRequest(payload){
//     let response = {}
//     response["successful"] = false;
//     response["message"] = "Invalid request payload";
//     $.ajax({
//         url: loginUrl,
//         type: "POST",
//         dataType: "json",
//         data: payload,
//         async: false,
//         success: function (success) {
//             response = success;
//         },
//         error: function (){
//           response["message"] = "An error has occurred";
//         }
//     })
//     return response;
// }