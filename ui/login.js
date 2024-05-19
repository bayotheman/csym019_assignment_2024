document.addEventListener('DOMContentLoaded', registerEvents);

function clearToken() {
    // sessionStorage.clear(); //clears session token to enforce when user logs out.
    localStorage.clear()
    sessionStorage.removeItem("token"); //clears session token to enforce when user logs out.

}

function registerEvents(){
    clearToken();
    let loginButton = document.getElementById("submit");
    loginButton.addEventListener('click', login);
    // let registerButton = document.getElementById("register");
    // registerButton.addEventListener('click', register);
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

    // console.log("inside login()");
    // displayMessage();
}

function displayMessage(message){
    console.log("inside displayMessage()");
    let container = document.getElementById("messageArea");
    // console.log("message area:");  console.log(container);
    container.style.color = "rgb(0 150 0)"
    container.innerText =message

}

function displayErrorMessage(message){
    console.log("inside displayMessage()");
    let container = document.getElementById("messageArea");
    // console.log("message area:");  console.log(container);
    container.style.color = "rgb(250 0 0)"
    container.innerText =message
}

let loginUrl = "http://localhost/internet_programming/task2/backend/api/login.php";


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

function register(){
    let payload = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email:document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword:document.getElementById('confirmPassword').value
    }

    let url = "http://localhost/internet_programming/task2/backend/api/register.php"
    let response = postRequest(payload,url );
    if(response["successful"]){
        let token = response["data"]["token"];
        sessionStorage.setItem("token",token);
        displayMessage("Login successful");
        window.location.href ="SelectionForm.html";
    }else{
        displayErrorMessage("Login failed!");
    }
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