document.addEventListener('DOMContentLoaded', registerEvents);

function registerEvents(){
}

function login(event){
    // event.preventDefault();
    sessionStorage.setItem("token","");
    console.log("inside login()");
    displayMessage();
}

function displayMessage(){
    console.log("inside displayMessage()");
    let container = document.getElementById("messageArea");
    console.log("message area:");  console.log(container);
    container.innerText = "Login failed"
}