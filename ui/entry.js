document.addEventListener('DOMContentLoaded', registerEvents);
let url = "http://localhost/task2/backend/api/add-team.php";

function registerEvents(){
    let addTeamSubmit = document.getElementById("addTeamSubmit");
    addTeamSubmit.addEventListener('click', addTeam);
}

function addTeam(event){
    event.preventDefault();
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
        messageDiv.style.color = "#006400";
    }else{
        messageDiv.style.color = "#FF0000";
    }

}

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
    let points = document.getElementById("pointsInput").value;

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
        "against":ga,
        "points":points
    }
}

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