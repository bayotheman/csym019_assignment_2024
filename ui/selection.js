document.addEventListener('DOMContentLoaded', registerEvents);
let reportData = {};
let allData = [];

/*
* Main function to start page in initialization process
*/

function registerEvents(){
    authorization();
    createTable();
    registerReportCreationAction();
    registerPopUp();
}

/*
* Function to handle the deletion of selected teams
*/
function deleteTeams() {
    let payload ={
        teams: Object.keys(reportData)
    }

    let response = deleteTeamsHelper(payload);
    if (response !== null && response.successful) {
        alert("Team(s) successfully deleted");
    } else {
        alert("An error occurred!");
    }
    closePopup();
    window.location.reload();

}

/*
*Function to set up event listeners for the popup dialog
*/
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


/**
 * A function that registers events with other functions
 */
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

/**
 * A function that stores the selected data in the localStorage to be used by the next page and also navigates to the next page(Report.html)
 */
 function goToReportPage(){
     if(Object.values(reportData).length === 0){
         alert('No team selected! kindly select at least one team to generate report');
         return;
     }
    console.log("inside goToReport page")
     console.log("report data");
     console.log(reportData);
     localStorage.setItem("data", JSON.stringify(reportData));
     window.location.href ="Report.html";
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

/**
 * authorizes access to this page based on the presence of a session token
 */
function authorization() {
    let token = sessionStorage.getItem("token");
    if (token === null) {
        window.location.href = "login.html";
    }

}

/**
 * A wrapper function that uses an helper function to fetch all teams from the backend system.
 * @returns {[]}
 */
function fetchData(){

        let response = fetchAllTeams();
        return response.data;
    // }
}

/**
 * a function that loads the selection with the teams data
 */
 function createTable(){
    let data = fetchData();
    allData  = fetchData();
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
    function toggle(){
        let checkbox = document.getElementById(rowIndex);
        let checkAll = document.getElementById("checkAll");
        // Check if checkbox element exists
        console.log("data:");
        console.log(tableEntry);

        console.log(reportData);
        if (checkbox) {

            checkAll.checked = checkbox.checked && checkAll.checked;
            if(checkbox.checked){
                reportData[data["name"]] = data;

            }else{
                delete reportData[data["name"]];
            }

        }

    }

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

















