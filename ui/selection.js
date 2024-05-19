document.addEventListener('DOMContentLoaded', registerEvents);
let reportData = {};
let allData = [];

function registerEvents(){
    authorization();
    createTable();
    registerReportCreationAction();
    registerPopUp();
}

function deleteTeams() {
    let payload ={
        teams: Object.keys(reportData)
    }

    let response = deleteTeamsHelper(payload);
    if (response !== null && response.successful) {
        alert("Team(s) successfully deleted");
        fetchAllTeams()
    } else {
        alert("An error occurred!");
    }
    closePopup();
}

function registerPopUp(){
    document.getElementById('deleteTeam').addEventListener('click', function() {
        if(Object.values(reportData).length === 0){
            alert('No team was selected for deletion!');
        }else{
            document.getElementById('popup').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        }

    });

    document.getElementById('yesButton').addEventListener('click', deleteTeams);

    document.getElementById('noButton').addEventListener('click', closePopup);

    document.getElementById('overlay').addEventListener('click', closePopup);

}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}




function onBackPress(){
    // event.preventDefault();
    console.log("inside on back press in selection.js");
    let data = JSON.parse(localStorage.getItem("data"));
    if(data != null && data.length > 0){
        for(let i = 0; i < data.length; i++){
            reportData[data[i]["name"]] = data[i];
        }
    }
    console.log("report data: "); console.log(reportData);

}

function registerReportCreationAction() {
    let createReportButton = document.getElementById('createReportSubmit');
    createReportButton.addEventListener('click', goToReportPage)
}


function deleteTeamsHelper(payload){
    let token = sessionStorage.getItem("token");
    let url = "http://localhost/internet_programming/task2/backend/api/delete-team.php";
    let response = {
        successful: false,
        message: "Invalid request payload",
        data:[]
    };

    $.ajax({
        url: url,
        type: "POST",
        contentType:"application/json",
        async: false,
        data: JSON.stringify(payload),
        headers:{
            "Authorization":`Bearer ${token}`
        },
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
 function goToReportPage(){
     if(Object.values(reportData).length === 0){
         alert('No team selected! kindly select at least one team to generate report');
         return;
     }
    console.log("inside goToReport page")
     console.log("report data");
     console.log(reportData);
     localStorage.setItem("data", JSON.stringify(reportData));
     window.location.href ="sampleReport.html";
 }
function fetchAllTeams() {
    let token = sessionStorage.getItem("token");
    let url = "http://localhost/internet_programming/task2/backend/api/fetch-all-teams.php";
    let response = {
        successful: false,
        message: "Invalid request payload",
        data:[]
    };

    $.ajax({
        url: url,
        type: "GET",
        contentType:"application/json",
        async: false,
        headers:{
            "Authorization":`Bearer ${token}`
        },
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

function authorization() {
    let token = sessionStorage.getItem("token");
    console.log("token: ");
    console.log(token);
    if (token === null) {
        window.location.href = "login.html";
    }

}

function fetchData(){

        let response = fetchAllTeams();
        let data = response.data;
        console.log("data from server: "); console.log(data);
        return data;
    // }
}
function getReportData(){
    console.log("inside getReportData()");
    return fetchData();
}

 function createTable(){
    console.log("inside loadTable");
    let data = getReportData();
    allData  = getReportData();
     let table = document.getElementById("teams_table");
     for(let i =0; i < data.length; i++){
         let tr = createTableEntry(i, data[i]);
         table.append(tr);
     }

 }

 function toggle(source){
   let checkboxes = document.getElementsByName("checkbox");
   reportData = {};
     console.log('inside toggle');
     // console.log('all data');
     // console.log(allData);
   for(let i = 0; i < checkboxes.length; i++){
       checkboxes[i].checked = source.checked;
       reportData[allData[i]["name"]] = allData[i];
   }

   let checkAll = document.getElementById('checkAll');
   if(checkAll.checked === false){
       reportData = {};
   }

   console.log('report data');
   console.log(reportData);


 }

function createTableEntry(rowIndex, data) {
    let tableEntry = data;
    // function checkAllToggle(){
    //     let checkboxes = document.getElementsByName("checkbox");
    //     for(let i = 0; i < checkboxes.length; i++){
    //         checkboxes[i].checked = event.checked;
    //         reportData[data["name"]] = data;
    //     }
    //
    // }
    function toggle(){
        let checkbox = document.getElementById(rowIndex);
        let checkAll = document.getElementById("checkAll");
        // Check if checkbox element exists
        console.log("data:");
        console.log(tableEntry);

        console.log(reportData);
        if (checkbox) {
            // Toggle the checkAll checkbox based on the checkbox state

            checkAll.checked = checkbox.checked && checkAll.checked;
            if(checkbox.checked){
                reportData[data["name"]] = data;

            }else{
                delete reportData[data["name"]];
            }
            // reportData[data["name"]] = data;

            // reportData.set(data["name"], data);
        }
        // else{
        //     reportData[data["name"]] = null;
        //     // reportData.delete(data["name"]);
        // }
        console.log(reportData);
    }

    let checkAll =  document.getElementById("checkAll")
    // checkAll.onclick = checkAllToggle;

    let tableRow = document.createElement("tr");
    let position = rowIndex + 1;
    let team = tableEntry['name'];
    let city = tableEntry['city'];
    let manager = tableEntry['manager'];
    let president = tableEntry['president'];
    let established = tableEntry['established'];
    let createdBy = tableEntry['createdBy'];
    let dateCreated = tableEntry['dateCreated'];
    let modifiedBy = tableEntry['modifiedBy']
    let dateModified = tableEntry['dateModified'];


    let positionElement = tableRow.appendChild(document.createElement("td"));
    positionElement.setAttribute("style", "text-align:center");
    let checkBoxElement = document.createElement('input');
    checkBoxElement.setAttribute("type","checkbox");
    checkBoxElement.setAttribute("id", rowIndex);
    checkBoxElement.setAttribute("class", "check");
    checkBoxElement.setAttribute("name", "checkbox");
    checkBoxElement.onclick = toggle;
    positionElement.appendChild(checkBoxElement);


    let teamElement = tableRow.appendChild(document.createElement("td"));
    teamElement.setAttribute("style", "text-align:left");
    // teamElement.style.fontWeight ="bold";
    let cityElement = tableRow.appendChild(document.createElement("td"));
    cityElement.setAttribute("style", "text-align:left");
    let managerElement = tableRow.appendChild(document.createElement("td"));
    managerElement.setAttribute("style", "text-align:center");
    let presidentElement = tableRow.appendChild(document.createElement("td"));
    presidentElement.setAttribute("style", "text-align:center");
    let establishedElement = tableRow.appendChild(document.createElement("td"));
    establishedElement.setAttribute("style", "text-align:center");
    let createdByElement = tableRow.appendChild(document.createElement("td"));
    createdByElement.setAttribute("style", "text-align:center");
    let dateCreatedElement = tableRow.appendChild(document.createElement("td"));
    dateCreatedElement.setAttribute("style", "text-align:center");
    let modifiedByElement = tableRow.appendChild(document.createElement("td"));
    modifiedByElement.setAttribute("style", "text-align:center");
    let dateModifiedElement = tableRow.appendChild(document.createElement("td"));
    dateModifiedElement.setAttribute("style", "text-align:center");

    teamElement.innerText = team;
    cityElement.innerText = city;
    managerElement.innerText = manager;
    presidentElement.innerText = president;
    establishedElement.innerText = established;
    createdByElement.innerText = createdBy;
    dateCreatedElement.innerText = dateCreated;
    modifiedByElement.innerText = modifiedBy;
    dateModifiedElement.innerText = dateModified;
    return tableRow;

}