import data from './league.json' with { type: 'json' };
// let data; // variable fromΩor holding league table data content.
function registerAllEvents(){
    // fetchData();
    loadTable();
    // console.log(data);


}

function fetchData(){
    console.log("inside fetch data");
    // let data; // variable for holding league table data content.
    // fetch('./league.json')  // to fetch data from league.json file
    // .then(response =>{
    //         data = response.json();
    //         console.log(data['table']);
    //         // console.log(data);//read the json content into variable data
    //     }
    // )
    // console.log("inside loading data");
    console.log(data);
        // .then((data) => console.log(data))
}

function loadTable(){
    console.log("inside loadTable");
    // console.log(data['table']);
    let tableData = data['table'];
    console.log(data['table']);

    let table = document.getElementById('league_table');
    for(let i = 0; i < tableData.length; i++){
        let tableEntry = tableData[i];
        let tableRow = table.appendChild(document.createElement("tr"));

        let position = tableEntry['position'];
        let team = tableEntry['name'];
        let logo = tableEntry['logo_url'];
        let played = tableEntry['played'];
        let won = tableEntry['won'];
        let drawn = tableEntry['drawn'];
        let lost = tableEntry['lost'];
        let goalFor = tableEntry['for'];
        let against = tableEntry['against'];
        let gd = tableEntry['gd'];
        let points = tableEntry['points'];
        let form = tableEntry['form'];




        table.appendChild(tableRow);
        let positionElement= tableRow.appendChild(document.createElement("td"));
        let teamParentElement= tableRow.appendChild(document.createElement("td"));
        let teamContainer= document.createElement("span");
        // teamContainer.setAttribute("style", "align-items:last");
        // teamContainer.setAttribute("style", "width:10%;");
        // teamContainer.style.display="flex"
        // teamContainer.setAttribute("style", "display:flex");


        let logoContainer= tableRow.appendChild(document.createElement("span"))
        logoContainer.setAttribute("style", "width:10%;");
        let logoImage= tableRow.appendChild(document.createElement("img"));


        let playedElement= tableRow.appendChild(document.createElement("td"));
        playedElement.setAttribute("style", "text-align:center");
        let wonElement= tableRow.appendChild(document.createElement("td"));
        wonElement.setAttribute("style", "text-align:center");
        let drawnElement= tableRow.appendChild(document.createElement("td"));
        drawnElement.setAttribute("style", "text-align:center");
        let lostElement= tableRow.appendChild(document.createElement("td"));
        lostElement.setAttribute("style", "text-align:center");
        let goalForElement= tableRow.appendChild(document.createElement("td"));
        goalForElement.setAttribute("style", "text-align:center");
        let againstElement= tableRow.appendChild(document.createElement("td"));
        againstElement.setAttribute("style", "text-align:center");
        let gdElement= tableRow.appendChild(document.createElement("td"));
        gdElement.setAttribute("style", "text-align:center");
        let pointsElement= tableRow.appendChild(document.createElement("td"));
        pointsElement.setAttribute("style", "text-align:center");
        pointsElement.style.fontSize ="large";
        pointsElement.style.fontWeight ="bold";

        // let formElement= tableRow.appendChild(document.createElement("td"));


        positionElement.innerHTML=position;
        positionElement.setAttribute("style", "text-align:center");

        teamParentElement.append(teamContainer);
        teamContainer.appendChild(logoContainer);
        let text = document.createElement("b");
        text.style.padding = "10px"
        text.style.border = "none";
        text.innerHTML = team;

        logoContainer.appendChild(logoImage)
        teamContainer.appendChild(text);
        logoImage.src = logo;
        logoImage.alt = "SVG Image";


        // logoElement.innerHTML=logo;
        playedElement.innerHTML=played;
        wonElement.innerHTML=won;
        drawnElement.innerHTML=drawn;
        lostElement.innerHTML=lost;
        goalForElement.innerHTML=goalFor;
        againstElement.innerHTML=against;
        gdElement.innerHTML=gd;
        pointsElement.innerHTML= points;


        // tableRow.appendChild(positionElement);



    }
    // let tableRow = table.appendChild(document.createElement("tr"));
}
// function loadTable(){
//     console.log("inside loadTable");
//     // console.log(data['table']);
//     let tableData = data['table'];
//     console.log(data['table']);
//
//     let table = document.getElementById('league_table');
//     for(let i = 0; i < tableData.length; i++){
//         let tableEntry = tableData[i];
//         let tableRow = table.appendChild(document.createElement("tr"));
//
//         let position = tableEntry['position'];
//         let team = tableEntry['name'];
//         let logo = tableEntry['logo_url'];
//         let played = tableEntry['played'];
//         let won = tableEntry['won'];
//         let drawn = tableEntry['drawn'];
//         let lost = tableEntry['lost'];
//         let goalFor = tableEntry['for'];
//         let against = tableEntry['against'];
//         let gd = tableEntry['gd'];
//         let points = tableEntry['points'];
//         let form = tableEntry['form'];
//
//         table.appendChild(tableRow);
//         let positionElement= tableRow.appendChild(document.createElement("td"));
//         let teamParentElement= tableRow.appendChild(document.createElement("td"));
//         let teamContainer= document.createElement("div");
//         teamContainer.class = "team-container";
//         teamContainer.style.display="flex"
//         // teamContainer.setAttribute("style", "align-items:last");
//
//         let logoContainer= tableRow.appendChild(document.createElement("span"))
//         let logoImage= tableRow.appendChild(document.createElement("img"));
//
//
//         let playedElement= tableRow.appendChild(document.createElement("td"));
//         let wonElement= tableRow.appendChild(document.createElement("td"));
//         let drawnElement= tableRow.appendChild(document.createElement("td"));
//         let lostElement= tableRow.appendChild(document.createElement("td"));
//         let goalForElement= tableRow.appendChild(document.createElement("td"));
//         let againstElement= tableRow.appendChild(document.createElement("td"));
//         let gdElement= tableRow.appendChild(document.createElement("td"));
//         let pointsElement= tableRow.appendChild(document.createElement("td"));
//         // let formElement= tableRow.appendChild(document.createElement("td"));
//
//
//         positionElement.innerHTML=position;
//
//         teamParentElement.append(teamContainer);
//         teamContainer.appendChild(logoContainer);
//         let text = document.createElement("b");
//         text.style.border = "none";
//         text.innerHTML = team;
//
//         logoContainer.appendChild(logoImage)
//         teamContainer.appendChild(text);
//         logoImage.src = logo;
//         logoImage.alt = "SVG Image";
//
//
//         // logoElement.innerHTML=logo;
//         playedElement.innerHTML=played;
//         wonElement.innerHTML=won;
//         drawnElement.innerHTML=drawn;
//         lostElement.innerHTML=lost;
//         goalForElement.innerHTML=goalFor;
//         againstElement.innerHTML=against;
//         gdElement.innerHTML=gd;
//         pointsElement.innerHTML= points;
//
//
//         // tableRow.appendChild(positionElement);
//
//
//
//     }
//     // let tableRow = table.appendChild(document.createElement("tr"));
// }
document.addEventListener('DOMContentLoaded', registerAllEvents);
