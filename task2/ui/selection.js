document.addEventListener('DOMContentLoaded', registerEvents);
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
    event.preventDefault()
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
    createTable();
    let createReportButton =  document.getElementById('createReportSubmit');
    createReportButton.addEventListener('click', goToReportPage);
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

function getReportData(){
    console.log("inside getReportData()");
    //get input from table selection
    // let input = getInputFromTableSelection()
    return [
        {
            "name": "Manchester City",
            "manager":"Pep Guardiola",
            "city": "Manchester",
            "president":"",
            "established":"1960",
            "createdBy":"Pep",
            "dateCreated":"2024",
            "modifiedBy":"Haaland",
            "dateModified":"2024",
            "logo": "https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg",
            "played": 10,
            "won": 7,
            "drawn": 1,
            "lost": 2,
            "gf": 10,
            "ga": 2,
            "gd": 8,
            "points": 22
        }
        ,
        {
            "name": "Liverpool",
            "logo": "https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg",
            "played": 10,
            "won": 7,
            "drawn": 1,
            "lost": 2,
            "gf": 10,
            "ga": 2,
            "gd": 8,
            "points": 22
        },
        {
            "name": "Manchester United",
            "logo": "https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg",
            "played": 10,
            "won": 5,
            "drawn": 3,
            "lost": 2,
            "gf": 6,
            "ga": 4,
            "gd": 2,
            "points": 18
        },
        {
            "name": "Chelsea",
            "logo": "https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg",
            "played": 10,
            "won": 5,
            "drawn": 3,
            "lost": 2,
            "gf": 6,
            "ga": 4,
            "gd": 2,
            "points": 18
        },
        {
            "name": "Aston Villa",
            "logo": "https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg",
            "played": 10,
            "won": 7,
            "drawn": 1,
            "lost": 2,
            "gf": 10,
            "ga": 2,
            "gd": 8,
            "points": 22
        }
        ,
        {
            "name": "Tottenham Hotspur",
            "logo": "https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg",
            "played": 10,
            "won": 7,
            "drawn": 1,
            "lost": 2,
            "gf": 10,
            "ga": 2,
            "gd": 8,
            "points": 22
        },
        {
            "name": "Arsenal",
            "logo": "https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg",
            "played": 10,
            "won": 5,
            "drawn": 3,
            "lost": 2,
            "gf": 6,
            "ga": 4,
            "gd": 2,
            "points": 18
        },
        {
            "name": "Everton",
            "logo": "https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg",
            "played": 10,
            "won": 5,
            "drawn": 3,
            "lost": 2,
            "gf": 6,
            "ga": 4,
            "gd": 2,
            "points": 18
        }
        ,
        {
            "name": "Watford",
            "logo": "https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg",
            "played": 10,
            "won": 3,
            "drawn": 5,
            "lost": 2,
            "gf": 6,
            "ga": 4,
            "gd": 2,
            "points": 14
        }

    ];
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