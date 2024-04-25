
// window.onload = createTeamMap;

const map ={};
function createTeamMap(response) {
    let teams = response["teams"];
    $.each(teams, function(i, team) {
        map[team["name"]] = team;
    });
    console.log("map before:")
    console.log(map);
}
// function updateTable(response) {
//     let rank = [];
//     let teams = response["teams"];
//     // console.log("length of teams:" + teams.length);
//     $.each(teams, function(i, team)
//             // for (let i = 0; i < teams.length; i++)
//         {
//             // let team = teams[i];
//             let points = team["points"];
//             let played = team["played"];
//             let won = team["won"];
//             let lost = team["lost"];
//             let drawn = team["drawn"];
//             let gf = team["gf"];
//             let ga = team["ga"];
//             let form = team["form"];
//             let fixtures = team["fixtures"];
//             // console.log("fixtures:");
//             // console.log(fixtures);
//             // for(let j = 0; j < fixtures.length; j++)
//             $.each(fixtures, function(j, fixture)
//             {
//                 fixture = fixtures[j];
//                 // console.log("fixture:");
//                 // console.log(fixture);
//                 // console.log("gf:");
//                 // let gfSize =  fixture["gf"];
//                 // console.log(gfSize);
//                 // let gaSize =  fixture["ga"];
//                 played += 1;
//                 let goalScored = 0;
//                 if(fixture["gf"] !== undefined){
//                     goalScored = fixture["gf"].length;
//                 }
//                 let goalsConceded = 0;
//                 if(fixture["ga"] !== undefined){
//                     goalsConceded = fixture["ga"].length;
//                 }
//                 if(goalScored > goalsConceded){
//                     //team wins
//                     // console.log("win");
//                     points += 3;
//                     won += 1;
//                     form.push("W");
//                 }else if(goalScored === goalsConceded){ // team draws
//                     points +=1 ;
//                     drawn += 1;
//                     form.push("D");
//                 }else{
//                     //team losses
//                     lost += 1;
//                     form.push("L");
//                 }
//                 gf += goalScored;
//                 ga += goalsConceded;
//             });
//
//             let gd = gf - ga;
//
//             let entry = {
//                 name : team["name"],
//                 logo : team["logo"],
//                 played : played,
//                 won : won,
//                 lost : lost,
//                 drawn : drawn,
//                 gf : gf,
//                 ga : ga,
//                 gd : gd,
//                 points : points,
//                 form: form
//             }
//             rank.push(entry);
//         }
//     );
//     console.log("rank:");
//     console.log(rank);
//     updateTableRecord(rank);
// }

function updateTable(response) {
    createTeamMap(response);
    let fixtures = response["fixtures"];

    $.each(fixtures, function(j, fixture)
    {
        fixture = fixtures[j];

        let homeTeamName = fixture["home_team"];
        let awayTeamName = fixture["away_team"];

        let home = map[homeTeamName];
        let away = map[awayTeamName];

        let homeGoals = 0;
        if(fixture["home_goals"] !== undefined){
            homeGoals = fixture["home_goals"].length;
        }

        let awayGoals = 0;
        if(fixture["away_goals"] !== undefined){
            awayGoals = fixture["away_goals"].length;
        }

        home['gf'] += homeGoals;
        home['ga'] += awayGoals;
        home["played"] += 1;
        home['gd'] += (homeGoals - awayGoals);

        away['gf'] += awayGoals;
        away['ga'] += homeGoals;
        away["played"] += 1;
        away['gd'] += (awayGoals - homeGoals);


        if(homeGoals > awayGoals){
            home["won"] += 1;
            home["points"] += 3;
            home["form"].push("W");

            away["lost"] += 1;
            away["form"].push("L");
        }else if (awayGoals > homeGoals){
            away["won"] += 1;
            away["points"] += 3;
            away["form"].push("W");

            home["lost"] += 1;
            home["form"].push("L");
        }else{
            home["drawn"] += 1;
            home["points"] += 1;
            home["form"].push("D");
            away["drawn"] += 1;
            away["points"] += 1;
            away["form"].push("D");
        }

    });

    //populate league table data
    let rank  = Object.values(map);
    //sort league table data from top to bottom
    rank.sort((a, b) => {
        if(a["points"] < b["points"]){
            return 1;
        }else if(a["points"] > b["points"]){
            return -1;
        }else{
            if(a["gd"] < b["gd"]){
                return 1;
            }else if (a["gd"] > b["gd"]){
                return -1;
            }
            return 0;
        }
    });
    console.log("rank");
    console.log(rank);
    // updateTableRecord(rank);
}























function updateTable3(response) {
    let rank = [];
    let map = {}

    let teams = response["teams"];
    let fixtures = response["fixtures"];

    // console.log("length of teams:" + teams.length);
    $.each(teams, function(i, team)
            // for (let i = 0; i < teams.length; i++)
        {
            // let team = teams[i];
            let teamName = team["name"];
            let points = team["points"];
            let played = team["played"];
            let won = team["won"];
            let lost = team["lost"];
            let drawn = team["drawn"];
            let gf = team["gf"];
            let ga = team["ga"];
            let form = team["form"];

            // console.log("fixtures:");
            // console.log(fixtures);
            // for(let j = 0; j < fixtures.length; j++)
            $.each(fixtures, function(j, fixture)
            {

                fixture = fixtures[j];
                let homeTeamName = fixture["home_team"];
                let awayTeamName = fixture["away_team"];

                team["played"] += 1;
                // console.log("fixture:");
                // console.log(fixture);
                let homeGoals = 0;
                if(fixture["home_goals"] !== undefined){
                    homeGoals = fixture["home_goals"].length;
                }

                let awayGoals = 0;
                if(fixture["away_goals"] !== undefined){
                    awayGoals = fixture["away_goals"].length;
                }

                let home = {
                    name: homeTeamName,
                    gf : homeGoals,
                    ga : awayGoals,
                    played : 1,
                    drawn : 0,
                    won: 0,
                    lost : 0,
                    points : 0,
                    form : []
                };

                let away = {
                    name: awayTeamName,
                    gf : awayGoals,
                    ga : homeGoals,
                    played : 1,
                    drawn : 0,
                    won: 0,
                    lost : 0,
                    points : 0,
                    form : []
                };

                if(homeGoals > awayGoals){
                    home["won"] = 1;
                    home["points"] = 3;
                    home["form"].push("W");
                    away["lost"] = 1;
                    away["form"].push("L");
                }else if (awayGoals > homeGoals){
                    away["won"] = 1;
                    away["points"] = 3;
                    away["form"].push("W");
                    home["lost"] = 1;
                    home["form"].push("L");
                }else{
                    home["drawn"] = 1;
                    home["points"] = 1;
                    away["drawn"] = 1;
                    away["points"] = 1;
                }




            });

            let gd = gf - ga;

            let entry = {
                name : team["name"],
                logo : team["logo"],
                played : played,
                won : won,
                lost : lost,
                drawn : drawn,
                gf : gf,
                ga : ga,
                gd : gd,
                points : points,
                form: form
            }
            rank.push(entry);
        }
    );
    console.log("rank:");
    console.log(rank);
    updateTableRecord(rank);
}

// function updateTable2(response) {
//     let teams = {
//
//     };
//     let fixtures = response["fixtures"];
//     // console.log("length of teams:" + teams.length);
//     $.each(fixtures, function(i, fixture)
//             // for (let i = 0; i < teams.length; i++)
//         {
//             let homeTeam = fixture["home_team"];
//             let awayTeam = fixture["away_team"];
//             let homeGoals = 0;
//             if(fixture["home_goals"] !== undefined){
//                 homeGoals = fixture['home_goals'].length;
//             }
//             let awayGoals = 0;
//             if(fixture["away_goals"] !== undefined){
//                 homeGoals = fixture['away_goals'].length;
//             }
//
//             let played = 1;
//
//
//             let teamA = {
//                 name : homeTeam,
//                 logo : "",
//                 played : played++,
//                 won : ,
//                 lost : lost,
//                 drawn : drawn,
//                 gf : gf,
//                 ga : ga,
//                 gd : gd,
//                 points : points,
//                 form: form
//             }
//
//             let teamB = {
//                 name : fixture["name"],
//                 logo : fixture["logo"],
//                 played : played,
//                 won : won,
//                 lost : lost,
//                 drawn : drawn,
//                 gf : gf,
//                 ga : ga,
//                 gd : gd,
//                 points : points,
//                 form: form
//             }
//
//
//
//
//
//             $.each(fixtures, function(j, fixture)
//             {
//                 fixture = fixtures[j];
//                 // console.log("fixture:");
//                 // console.log(fixture);
//                 // console.log("gf:");
//                 // let gfSize =  fixture["gf"];
//                 // console.log(gfSize);
//                 // let gaSize =  fixture["ga"];
//                 played += 1;
//                 let goalScored = 0;
//                 if(fixture["gf"] !== undefined){
//                     goalScored = fixture["gf"].length;
//                 }
//                 let goalsConceded = 0;
//                 if(fixture["ga"] !== undefined){
//                     goalsConceded = fixture["ga"].length;
//                 }
//                 if(goalScored > goalsConceded){
//                     //team wins
//                     // console.log("win");
//                     points += 3;
//                     won += 1;
//                     form.push("W");
//                 }else if(goalScored === goalsConceded){ // team draws
//                     points +=1 ;
//                     drawn += 1;
//                     form.push("D");
//                 }else{
//                     //team losses
//                     lost += 1;
//                     form.push("L");
//                 }
//                 gf += goalScored;
//                 ga += goalsConceded;
//             });
//
//             let gd = gf - ga;
//
//             let entry = {
//                 name : fixture["name"],
//                 logo : fixture["logo"],
//                 played : played,
//                 won : won,
//                 lost : lost,
//                 drawn : drawn,
//                 gf : gf,
//                 ga : ga,
//                 gd : gd,
//                 points : points,
//                 form: form
//             }
//             teams.push(entry);
//         }
//     );
//     console.log("rank:");
//     console.log(teams);
//     updateTableRecord(teams);
// }

function displayError() {

}
let count = 0;
(function loadTable(){
    setTimeout(function () {
        $.ajax({
            url:"league_v1.json",
            type:"GET",
            dataType:"json",
            success:function(response){
                // count+=1;
                // console.log(count);
                updateTable(response);
                loadTable();
            },
            error:function(){
                displayError();
            },
        });

    }, 1000);
})();

function updateTableRecord(tableData){
    console.log("inside loadTable");
    // console.log(data['table']);
    // let tableData = data['table'];
    // console.log(data['table']);

    let table = document.getElementById('league_table');
    for(let i = 0; i < tableData.length; i++){
        let tableEntry = tableData[i];
        let tableRow = document.getElementById(String(i));
        console.log("table row: ");
        console.log(tableRow);

        let position = String(i + 1);
        let team = tableEntry['name'];
        let logo = tableEntry['logo'];
        let played = tableEntry['played'];
        let won = tableEntry['won'];
        let drawn = tableEntry['drawn'];
        let lost = tableEntry['lost'];
        let goalFor = tableEntry['gf'];
        let against = tableEntry['ga'];
        let gd = tableEntry['gd'];
        let points = tableEntry['points'];
        let form = tableEntry['form'];

        // let positionElement= tableRow.appendChild(document.createElement("td"));
        // let teamParentElement= tableRow.appendChild(document.createElement("td"));
        // let teamContainer= document.createElement("span");
        // // teamContainer.setAttribute("style", "align-items:last");
        // // teamContainer.setAttribute("style", "width:10%;");
        // // teamContainer.style.display="flex"
        // // teamContainer.setAttribute("style", "display:flex");
        //
        //
        // let logoContainer= tableRow.appendChild(document.createElement("span"))
        // logoContainer.setAttribute("style", "width:10%");
        // let logoImage= tableRow.appendChild(document.createElement("img"));
        //
        //
        // let playedElement= tableRow.appendChild(document.createElement("td"));
        // playedElement.setAttribute("style", "text-align:center");
        // let wonElement= tableRow.appendChild(document.createElement("td"));
        // wonElement.setAttribute("style", "text-align:center");
        // let drawnElement= tableRow.appendChild(document.createElement("td"));
        // drawnElement.setAttribute("style", "text-align:center");
        // let lostElement= tableRow.appendChild(document.createElement("td"));
        // lostElement.setAttribute("style", "text-align:center");
        // let goalForElement= tableRow.appendChild(document.createElement("td"));
        // goalForElement.setAttribute("style", "text-align:center");
        // let againstElement= tableRow.appendChild(document.createElement("td"));
        // againstElement.setAttribute("style", "text-align:center");
        // let gdElement= tableRow.appendChild(document.createElement("td"));
        // gdElement.setAttribute("style", "text-align:center");
        // let pointsElement= tableRow.appendChild(document.createElement("td"));
        // pointsElement.setAttribute("style", "text-align:center");
        // pointsElement.style.fontSize ="large";
        // pointsElement.style.fontWeight ="bold";
        //
        // // let formElement= tableRow.appendChild(document.createElement("td"));
        //
        //
        // positionElement.innerHTML=position;
        // positionElement.setAttribute("style", "text-align:center");
        //
        // teamParentElement.append(teamContainer);
        // teamContainer.appendChild(logoContainer);
        // let text = document.createElement("b");
        // text.style.padding = "10px"
        // text.style.border = "none";
        // text.innerHTML = team;
        //
        // logoContainer.appendChild(logoImage)
        // teamContainer.appendChild(text);
        // logoImage.src = logo;
        // logoImage.alt = "SVG Image";
        //
        //
        // // logoElement.innerHTML=logo;
        // playedElement.innerHTML=played;
        // wonElement.innerHTML=won;
        // drawnElement.innerHTML=drawn;
        // lostElement.innerHTML=lost;
        // goalForElement.innerHTML=goalFor;
        // againstElement.innerHTML=against;
        // gdElement.innerHTML=gd;
        // pointsElement.innerHTML= points;
        //


        // table.appendChild(tableRow);
        let positionElement= tableRow.getElementsByClassName("position")[0];
        // positionElement.setAttribute("style", "text-align:center");
        // positionElement.style.textAlign = "center";

        let teamParentElement= tableRow.getElementsByClassName("team");
        let teamContainer= tableRow.getElementsByClassName("team_container")[0];
        teamContainer.setAttribute("style", "align-items:last");
        teamContainer.setAttribute("style", "width:10%;");
        teamContainer.style.display="flex"
        teamContainer.setAttribute("style", "display:flex");


        let logoContainer= teamContainer.getElementsByClassName("logo_container")[0];
        // logoContainer.setAttribute("style", "width:10%");
        let logoImage= logoContainer.getElementsByClassName("image");
        console.log("logoImage element: ");
        console.log(logoImage);

        let playedElement= tableRow.getElementsByClassName("played")[0];
        playedElement.setAttribute("style", "text-align:center");
        let wonElement= tableRow.getElementsByClassName("won")[0];
        wonElement.setAttribute("style", "text-align:center");
        let drawnElement= tableRow.getElementsByClassName("drawn")[0];
        drawnElement.setAttribute("style", "text-align:center");
        let lostElement= tableRow.getElementsByClassName("lost")[0];
        lostElement.setAttribute("style", "text-align:center");
        let goalForElement= tableRow.getElementsByClassName("for")[0];
        goalForElement.setAttribute("style", "text-align:center");
        let againstElement= tableRow.getElementsByClassName("against")[0];
        againstElement.setAttribute("style", "text-align:center");
        let gdElement= tableRow.getElementsByClassName("gd")[0];
        gdElement.setAttribute("style", "text-align:center");
        let pointsElement= tableRow.getElementsByClassName("points")[0];
        pointsElement.setAttribute("style", "text-align:center");
        pointsElement.style.fontSize ="large";
        pointsElement.style.fontWeight ="bold";

        // let formElement= tableRow.getElementsByClassName("form");;


        positionElement.innerHTML=position;
        // positionElement.setAttribute("style", "text-align:center");

        // teamParentElement.append(teamContainer);
        // teamContainer.appendChild(logoContainer);
        let text = tableRow.getElementsByTagName("b")[0];
        text.style.padding = "10px"
        text.style.border = "none";
        text.innerHTML = team;

        // logoContainer[0] = logoImage
        // teamContainer.appendChild(text);
        logoImage.src = logo;
        // logoImage.alt = "SVG Image";


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



// function updateTableRecord(tableData){
//     console.log("inside loadTable");
//     // console.log(data['table']);
//     // let tableData = data['table'];
//     // console.log(data['table']);
//
//     let table = document.getElementById('league_table');
//     for(let i = 0; i < tableData.length; i++){
//         let tableEntry = tableData[i];
//         let tableRow = table.appendChild(document.createElement("tr"));
//
//         let position = i + 1;
//         let team = tableEntry['name'];
//         let logo = tableEntry['logo'];
//         let played = tableEntry['played'];
//         let won = tableEntry['won'];
//         let drawn = tableEntry['drawn'];
//         let lost = tableEntry['lost'];
//         let goalFor = tableEntry['gf'];
//         let against = tableEntry['ga'];
//         let gd = tableEntry['gd'];
//         let points = tableEntry['points'];
//         let form = tableEntry['form'];
//
//
//
//
//         table.appendChild(tableRow);
//         let positionElement= tableRow.appendChild(document.createElement("td"));
//         let teamParentElement= tableRow.appendChild(document.createElement("td"));
//         let teamContainer= document.createElement("span");
//         // teamContainer.setAttribute("style", "align-items:last");
//         // teamContainer.setAttribute("style", "width:10%;");
//         // teamContainer.style.display="flex"
//         // teamContainer.setAttribute("style", "display:flex");
//
//
//         let logoContainer= tableRow.appendChild(document.createElement("span"))
//         logoContainer.setAttribute("style", "width:10%");
//         let logoImage= tableRow.appendChild(document.createElement("img"));
//
//
//         let playedElement= tableRow.appendChild(document.createElement("td"));
//         playedElement.setAttribute("style", "text-align:center");
//         let wonElement= tableRow.appendChild(document.createElement("td"));
//         wonElement.setAttribute("style", "text-align:center");
//         let drawnElement= tableRow.appendChild(document.createElement("td"));
//         drawnElement.setAttribute("style", "text-align:center");
//         let lostElement= tableRow.appendChild(document.createElement("td"));
//         lostElement.setAttribute("style", "text-align:center");
//         let goalForElement= tableRow.appendChild(document.createElement("td"));
//         goalForElement.setAttribute("style", "text-align:center");
//         let againstElement= tableRow.appendChild(document.createElement("td"));
//         againstElement.setAttribute("style", "text-align:center");
//         let gdElement= tableRow.appendChild(document.createElement("td"));
//         gdElement.setAttribute("style", "text-align:center");
//         let pointsElement= tableRow.appendChild(document.createElement("td"));
//         pointsElement.setAttribute("style", "text-align:center");
//         pointsElement.style.fontSize ="large";
//         pointsElement.style.fontWeight ="bold";
//
//         // let formElement= tableRow.appendChild(document.createElement("td"));
//
//
//         positionElement.innerHTML=position;
//         positionElement.setAttribute("style", "text-align:center");
//
//         teamParentElement.append(teamContainer);
//         teamContainer.appendChild(logoContainer);
//         let text = document.createElement("b");
//         text.style.padding = "10px"
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
//

















// window.onload = makeAjaxRequest;



// import data from './league.json' with { type: 'json' };
// // let data; // variable fromΩor holding league table data content.
// function registerAllEvents(){
//     // fetchData();
//     loadTable();
//     // console.log(data);
//
//
// }
//
// function fetchData(){
//     console.log("inside fetch data");
//     // let data; // variable for holding league table data content.
//     // fetch('./league.json')  // to fetch data from league.json file
//     // .then(response =>{
//     //         data = response.json();
//     //         console.log(data['table']);
//     //         // console.log(data);//read the json content into variable data
//     //     }
//     // )
//     // console.log("inside loading data");
//     console.log(data);
//         // .then((data) => console.log(data))
// }
//
// // function loadTable(){
// //     console.log("inside loadTable");
// //     // console.log(data['table']);
// //     let tableData = data['table'];
// //     console.log(data['table']);
// //
// //     let table = document.getElementById('league_table');
// //     for(let i = 0; i < tableData.length; i++){
// //         let tableEntry = tableData[i];
// //         let tableRow = table.appendChild(document.createElement("tr"));
// //
// //         let position = tableEntry['position'];
// //         let team = tableEntry['name'];
// //         let logo = tableEntry['logo_url'];
// //         let played = tableEntry['played'];
// //         let won = tableEntry['won'];
// //         let drawn = tableEntry['drawn'];
// //         let lost = tableEntry['lost'];
// //         let goalFor = tableEntry['for'];
// //         let against = tableEntry['against'];
// //         let gd = tableEntry['gd'];
// //         let points = tableEntry['points'];
// //         let form = tableEntry['form'];
// //
// //
// //
// //
// //         table.appendChild(tableRow);
// //         let positionElement= tableRow.appendChild(document.createElement("td"));
// //         let logoElement= tableRow.appendChild(document.createElement("td"));
// //         logoElement.setAttribute("style", "margin:0");
// //         logoElement.setAttribute("style", "padding:0");
// //         // logoElement.setAttribute('style', "text-align:center");
// //         let teamParentElement= tableRow.appendChild(document.createElement("td"));
// //         let teamContainer= document.createElement("span");
// //         // teamContainer.setAttribute("style", "align-items:last");
// //         // teamContainer.setAttribute("style", "width:10%;");
// //         // teamContainer.style.display="flex"
// //         // teamContainer.setAttribute("style", "display:flex");
// //
// //
// //         // let logoContainer= tableRow.appendChild(document.createElement("span"))
// //         // logoContainer.setAttribute("style", "width:10%;");
// //         let logoImage= tableRow.appendChild(document.createElement("img"));
// //
// //
// //
// //         let playedElement= tableRow.appendChild(document.createElement("td"));
// //         playedElement.setAttribute("style", "text-align:center");
// //         let wonElement= tableRow.appendChild(document.createElement("td"));
// //         wonElement.setAttribute("style", "text-align:center");
// //         let drawnElement= tableRow.appendChild(document.createElement("td"));
// //         drawnElement.setAttribute("style", "text-align:center");
// //         let lostElement= tableRow.appendChild(document.createElement("td"));
// //         lostElement.setAttribute("style", "text-align:center");
// //         let goalForElement= tableRow.appendChild(document.createElement("td"));
// //         goalForElement.setAttribute("style", "text-align:center");
// //         let againstElement= tableRow.appendChild(document.createElement("td"));
// //         againstElement.setAttribute("style", "text-align:center");
// //         let gdElement= tableRow.appendChild(document.createElement("td"));
// //         gdElement.setAttribute("style", "text-align:center");
// //         let pointsElement= tableRow.appendChild(document.createElement("td"));
// //         pointsElement.setAttribute("style", "text-align:center");
// //         pointsElement.style.fontSize ="large";
// //         pointsElement.style.fontWeight ="bold";
// //
// //         // let formElement= tableRow.appendChild(document.createElement("td"));
// //
// //
// //         positionElement.innerHTML=position;
// //         positionElement.setAttribute("style", "text-align:center");
// //
// //         teamParentElement.append(teamContainer);
// //         // logoElement.appendChild(logoContainer);
// //         logoElement.appendChild(logoImage);
// //         let text = document.createElement("b");
// //         text.style.padding = "10px"
// //         text.style.border = "none";
// //         text.innerHTML = team;
// //
// //         // logoContainer.appendChild(logoImage)
// //         teamContainer.appendChild(text);
// //         logoImage.src = logo;
// //         logoImage.alt = "SVG Image";
// //
// //
// //         // logoElement.innerHTML=logo;
// //         playedElement.innerHTML=played;
// //         wonElement.innerHTML=won;
// //         drawnElement.innerHTML=drawn;
// //         lostElement.innerHTML=lost;
// //         goalForElement.innerHTML=goalFor;
// //         againstElement.innerHTML=against;
// //         gdElement.innerHTML=gd;
// //         pointsElement.innerHTML= points;
// //
// //
// //         // tableRow.appendChild(positionElement);
// //
// //
// //
// //     }
// //     // let tableRow = table.appendChild(document.createElement("tr"));
// // }
//
// function updateTableRecord(){
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
//
//
//
//         table.appendChild(tableRow);
//         let positionElement= tableRow.appendChild(document.createElement("td"));
//         let teamParentElement= tableRow.appendChild(document.createElement("td"));
//         let teamContainer= document.createElement("span");
//         // teamContainer.setAttribute("style", "align-items:last");
//         // teamContainer.setAttribute("style", "width:10%;");
//         // teamContainer.style.display="flex"
//         // teamContainer.setAttribute("style", "display:flex");
//
//
//         let logoContainer= tableRow.appendChild(document.createElement("span"))
//         logoContainer.setAttribute("style", "width:10%;");
//         let logoImage= tableRow.appendChild(document.createElement("img"));
//
//
//         let playedElement= tableRow.appendChild(document.createElement("td"));
//         playedElement.setAttribute("style", "text-align:center");
//         let wonElement= tableRow.appendChild(document.createElement("td"));
//         wonElement.setAttribute("style", "text-align:center");
//         let drawnElement= tableRow.appendChild(document.createElement("td"));
//         drawnElement.setAttribute("style", "text-align:center");
//         let lostElement= tableRow.appendChild(document.createElement("td"));
//         lostElement.setAttribute("style", "text-align:center");
//         let goalForElement= tableRow.appendChild(document.createElement("td"));
//         goalForElement.setAttribute("style", "text-align:center");
//         let againstElement= tableRow.appendChild(document.createElement("td"));
//         againstElement.setAttribute("style", "text-align:center");
//         let gdElement= tableRow.appendChild(document.createElement("td"));
//         gdElement.setAttribute("style", "text-align:center");
//         let pointsElement= tableRow.appendChild(document.createElement("td"));
//         pointsElement.setAttribute("style", "text-align:center");
//         pointsElement.style.fontSize ="large";
//         pointsElement.style.fontWeight ="bold";
//
//         // let formElement= tableRow.appendChild(document.createElement("td"));
//
//
//         positionElement.innerHTML=position;
//         positionElement.setAttribute("style", "text-align:center");
//
//         teamParentElement.append(teamContainer);
//         teamContainer.appendChild(logoContainer);
//         let text = document.createElement("b");
//         text.style.padding = "10px"
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


// function makeAjaxRequest(){
//     if (window.XMLHttpRequest) {
//         xhr = new XMLHttpRequest();
//     } else {
//         if (window.ActiveXObject) {
//             xhr = new ActiveXObject("Microsoft.XMLHTTP");
//         }
//     }
//     if(xhr){
//         xhr.open("GET","league.json",true);
//         xhr.send();
//         xhr.onreadystatechange = showContents; //determine the success of the request and start processing
//     } else{
//         //handle error to alert user
//     }
// }




// document.addEventListener('DOMContentLoaded', registerAllEvents);
