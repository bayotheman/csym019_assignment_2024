document.addEventListener('DOMContentLoaded', registerEvents);
let url = "http://localhost/task2/backend/api/fetch-all-teams.php";
window.onload = onBackPress;
// window.onpopstate = function (){
//     reportData = {};
//     allData = [];
//     // let checkboxes = document.getElementsByName("checkbox");
//     //
//     // for(let i = 0; i < checkboxes.length; i++){
//     //     checkboxes[i].checked = false;
//     //     // reportData[allData[i]["name"]] = allData[i];
//     // }
// }
let reportData = {};
let allData = [];
// window.onpopstate = function (event){
//     reportData = {};
//     allData = [];
//     let checkboxes = document.getElementsByName("checkbox");
//
//     for(let i = 0; i < checkboxes.length; i++){
//         checkboxes[i].checked = false;
//         // reportData[allData[i]["name"]] = allData[i];
//     }
//
// }
// window.onload = onBackPress;
function onBackPress(){
    event.preventDefault();
    console.log("inside on back press");
    let data = JSON.parse(sessionStorage.getItem("data"));
    if(data != null && data.length > 0){
        for(let i = 0; i < data.length; i++){
            reportData[data[i]["name"]] = data[i];
        }
    }
    console.log("report data: "); console.log(reportData);
    // window.location.href ="SelectionForm.html";
    // reportData = {};
    // allData = [];
    // let checkAll = document.getElementById("checkAll");
    // checkAll.checked = false;

    // for(let i = 0; i < checkboxes.length; i++){
    //     checkboxes[i].checked = false;
    //     reportData[allData[i]["name"]] = allData[i];
    // }

}

function registerEvents(){

    // createReport();
    // let addTeamButton = document.getElementById('addTeamSubmit');
    // console.log("addTeamButton: ");  console.log(addTeamButton);
    // addTeamButton.addEventListener('click', addTeam);
    // let data = JSON.parse(sessionStorage.getItem("data"));
    // if(data != null && data.length > 0){
    //     for(let i = 0; i < data.length; i++){
    //         reportData[data[i]["name"]] = data[i];
    //     }
    // }
    console.log("inside register events");
    createTable();
    let createReportButton =  document.getElementById('createReportSubmit');
    createReportButton.addEventListener('click', goToReportPage)
    let deleteTeamButton = document.getElementById("deleteTeam");
    deleteTeamButton.addEventListener('click', deleteTeams);
}

function deleteTeams(){

}
 function goToReportPage(event){
    console.log("inside goToReport page")
     // sessionStorage.setItem("token", "qwertyuiooasdfghjklkgltuyshj");
     console.log("report data");
     console.log(reportData);
     sessionStorage.setItem("data", JSON.stringify(reportData));
     let checkedValues = [];
     // document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
     //     if(checkbox.id !== "checkAll"){
     //         checkedValues.push(checkbox.value);
     //     }
     // });
     // sessionStorage.setItem('checkedValues', JSON.stringify(checkedValues));

     event.preventDefault()
     window.location.href ="sampleReport.html";
 }
function fetchAllTeams(token) {
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
function fetchData(){
    let token = sessionStorage.getItem("token");
    console.log("token: "); console.log(token);
    if(token === null){
        window.location.href ="login.html";
    }
    // else{
        let response = fetchAllTeams(token);
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
     // let div = document.createElement('div');
     // div.setAttribute("style", "padding:20px; display:flex; align-item:center");
     let table = document.getElementById("teams_table");
     for(let i =0; i < data.length; i++){
         let tr = createTableEntry(i, data[i]);
         table.append(tr);
     }
     // div.append(table);
     // return div;
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
    // let points = tableEntry['points'];
    // let form = tableEntry['form'];
    //

    let positionElement = tableRow.appendChild(document.createElement("td"));
    positionElement.setAttribute("style", "text-align:center");
    // let form = document.createElement('form');
    let checkBoxElement = document.createElement('input');
    checkBoxElement.setAttribute("type","checkbox");
    checkBoxElement.setAttribute("id", rowIndex);
    checkBoxElement.setAttribute("class", "check");
    checkBoxElement.setAttribute("name", "checkbox");
    // checkBoxElement.setAttribute("onclick", toggle());
    checkBoxElement.onclick = toggle;
    positionElement.appendChild(checkBoxElement);
    // form.appendChild(checkBoxElement);
    // positionElement.appendChild(form);

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
    // let pointsElement= tableRow.appendChild(document.createElement("td"));
    // pointsElement.setAttribute("style", "text-align:center");
    // pointsElement.style.fontSize ="large";
    // pointsElement.style.fontWeight ="bold";


    // positionElement.innerHTML = position;
    teamElement.innerText = team;
    cityElement.innerText = city;
    managerElement.innerText = manager;
    presidentElement.innerText = president;
    establishedElement.innerText = established;
    createdByElement.innerText = createdBy;
    dateCreatedElement.innerText = dateCreated;
    modifiedByElement.innerText = modifiedBy;
    dateModifiedElement.innerText = dateModified;
    // pointsElement.innerText= points;
    return tableRow;

}