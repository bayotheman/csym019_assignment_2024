document.addEventListener('DOMContentLoaded', registerEvents);

function registerEvents(){

    let registerButton = document.getElementById("register");
    registerButton.addEventListener('click', register);
}

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

        // window.location.href ="SelectionForm.html";
    // }else{
    //     messageDiv.innerText = response["message"];
    // }
}

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
