

let registeredTeams ={};
function createTeamMap(response) {
    let teams = response["teams"];
    $.each(teams, function(i, team) {
        registeredTeams[team["name"]] = team;
    });
    // console.log("map before:")
    // console.log(teamsMap);
}

function updateLeagueTable(response) {
    createTeamMap(response);
    let fixtures = response["fixtures"];

    $.each(fixtures, function(j, fixture)
    {
        fixture = fixtures[j];

        let homeTeamName = fixture["home_team"];
        let awayTeamName = fixture["away_team"];

        let home = registeredTeams[homeTeamName];
        let away = registeredTeams[awayTeamName];

        let homeGoals = 0;
        if(fixture["home_goals"] !== undefined){
            homeGoals = fixture["home_goals"];
        }

        let awayGoals = 0;
        if(fixture["away_goals"] !== undefined){
            awayGoals = fixture["away_goals"];
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
    let rank  = Object.values(registeredTeams);
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
    // console.log("table rank");
    // console.log(rank);
    updateLeagueTableRecord(rank);
}

let registeredPlayers ={};

function populateRegisteredPlayersMap(response){
    let teams = response["teams"];
    // let fixtures = response["fixtures"];
    $.each(teams, function(i, team){
        team = teams[i];
        let players = team["players"];
        $.each(players, function (j, player) {
            player = players[j];
            player["team"] = team["name"];
            registeredPlayers[player["name"]] = player;
        });

    });
    // console.log("Scorers map:");
    // console.log(scorersMap);
}
function updateTopScorersTable(response){
    let fixtures = response["fixtures"];
    let scorersMap = {};
    // registeredPlayers = {};
    $.each(fixtures, function(i, fixture){
        fixture = fixtures[i];
        console.log("fixture");
        console.log(fixture);
        let homePlayersStats = fixture["home_team_players_stats"];
        for(let i = 0; i < homePlayersStats.length ; i++){
            let player = homePlayersStats[i];
            player["team"] = fixture["home_team"];
            // console.log("home players stats: ");
            // console.log(player);
        }
        let awayPlayersStats = fixture["away_team_players_stats"];
        for(let i = 0; i < awayPlayersStats.length ; i++){
            // awayPlayersStats[i]["team"] = fixture["away_team"];
            let player = awayPlayersStats[i];
            player["team"] = fixture["away_team"];
            // console.log("away players stats: ");
            // console.log(player);
        }
        // console.log("home players stats");
        // console.log(homePlayersStats);
        // console.log("away players stats");
        // console.log(awayPlayersStats);

        let players = [];

        Array.prototype.push.apply(players, homePlayersStats);
        Array.prototype.push.apply(players, awayPlayersStats);

        // console.log("players list concat");
        // console.log(players);

        $.each(players, function (j, player) {
            player = players[j];
            let playerName = player["name"];
            let playerTeam = player["team"];
            // console.log("player");
            // console.log(player);
            // if(playersStats[playerName] !== undefined){
            //     stat = playersStats[playerName];
            // }
            let stat = registeredPlayers[playerName];
            if(stat !== undefined){
                stat["played"] += 1;
                stat["goals"] += player["goals"];
                stat["assists"] += player["assists"] ;
                stat["goals_per_90"] += player["goals_in_90"];
                stat["total_minutes_played"] += player["minutes_played"];
                stat["total_shots"] += player["total_shots"];
                stat["shots_on_target"] += player["shots_on_target"];
                stat["goal_conversion"] = 0;
                stat["shot_accuracy"] = 0;

                if(stat["goals"] > 0){
                    scorersMap[playerName] = stat;
                }
            }else{
                stat = {
                    name : playerName,
                    team: playerTeam,
                    played : 0,
                    goals: 0,
                    assists : 0,
                    goals_per_90 : 0,
                    mins_per_goal : 0,
                    total_shots : 0,
                    shots_on_target:0,
                    goal_conversion: 0,
                    shot_accuracy:0
                }


            }

            registeredPlayers[playerName] = stat;


        });

    });
    // console.log("Haaland match count: " + haalandCount);
    let scorersList = Object.values(scorersMap);
    console.log("Scorers Map: ");
    console.log(scorersMap);
    scorersList.sort((a, b) => {
            if (a["goals"] < b["goals"]) {
                return 1;
            } else if (a["goals"] > b["goals"]) {
                return -1;
            } else {
                return 0;
            }
        }
    );

    updateTopScorerTableRecord(scorersList);

    // console.log("Scorers list:");
    // console.log(scorersList);
}
// function updateTopScorersTable(response){
//     let fixtures = response["fixtures"];
//     let scorersMap = {};
//     let haalandCount = 0;
//     $.each(fixtures, function(i, fixture){
//         fixture = fixtures[i];
//         // console.log("fixture");
//         // console.log(fixture);
//         let homePlayersStats = fixture["home_team_players_stats"];
//         let awayPlayersStats = fixture["away_team_players_stats"];
//         // console.log("home players stats");
//         // console.log(homePlayersStats);
//         // console.log("away players stats");
//         // console.log(awayPlayersStats);
//
//         let players = [];
//
//         if(homePlayersStats !== undefined ){
//             Array.prototype.push.apply(players, homePlayersStats);
//         }
//         if(awayPlayersStats !== undefined ){
//             Array.prototype.push.apply(players, awayPlayersStats);
//         }
//
//         // console.log("players list concat");
//         // console.log(players);
//
//         $.each(players, function (j, player) {
//             player = players[j];
//             let playerName = player["name"]
//             // console.log("player");
//             // console.log(player);
//             // let stat = {
//             //     name : playerName,
//             //     played : 0,
//             //     goals: 0,
//             //     assists : 0,
//             //     goals_per_90 : 0,
//             //     mins_per_goal : 0,
//             //     total_shots : 0,
//             //     shots_on_target:0,
//             //     goal_conversion: 0,
//             //     shot_accuracy:0
//             // }
//             // if(playersStats[playerName] !== undefined){
//             //     stat = playersStats[playerName];
//             // }
//             let stat = registeredPlayers[playerName];
//             if(stat !== undefined){
//                 stat["played"] += 1;
//                 stat["goals"] += player["goals"];
//                 stat["assists"] += player["assists"] ;
//                 stat["goals_per_90"] += player["goals_in_90"];
//                 stat["total_minutes_played"] += player["minutes_played"];
//                 stat["total_shots"] += player["total_shots"];
//                 stat["shots_on_target"] += player["shots_on_target"];
//                 stat["goal_conversion"] = 0;
//                 stat["shot_accuracy"] = 0;
//
//                 if(stat["goals"] > 0){
//                     scorersMap[playerName] = stat;
//                 }
//             }
//
//         });
//
//     });
//     // console.log("Haaland match count: " + haalandCount);
//     let scorersList = Object.values(scorersMap);
//     scorersList.sort((a, b) => {
//             if (a["goals"] < b["goals"]) {
//                 return 1;
//             } else if (a["goals"] > b["goals"]) {
//                 return -1;
//             } else {
//                 return 0;
//             }
//         }
//     );
//
//     updateTopScorerTableRecord(scorersList);
//
//     // console.log("Scorers list:");
//     // console.log(scorersList);
// }
function displayError() {

}
(function loadLeagueTable(){
    setTimeout(function () {
        $.ajax({
            url:"league_v1.json",
            type:"GET",
            dataType:"json",
            success:function(response){
                // populateRegisteredPlayersMap(response);
                // registeredTeams ={};
                updateLeagueTable(response);
                // updateTopScorersTable(response);
                loadLeagueTable();
            },
            error:function(){
                displayError();
            },
        });

    }, 1000);
})();

//process list top scorers independent of league table
(function topScorers(){
    setTimeout(function () {
        $.ajax({
            url:"league_v1.json",
            type:"GET",
            dataType:"json",
            success:function(response){
                // console.log("Top score API call ");
                // populateRegisteredPlayersMap(response);
                // console.log("registered players");
                // console.log(registeredPlayers);

                updateTopScorersTable(response);
                topScorers();
            },
            error:function(){
                displayError();
            },
        });

    }, 1000);
})();


function updateLeagueTableEntry(id, tableEntry){
    // console.log("table entry: " + id );
    // console.log(tableEntry);
    let tableRow = document.getElementById(String(id));
    // console.log("table row: ");
    // console.log(tableRow);

    let position = String(id + 1);
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
    let formLength = form.length;
    // let formRank = form.slice(formLength, form.length);

    // table.appendChild(tableRow);
    let positionElement= tableRow.getElementsByClassName("position")[0];
    // positionElement.setAttribute("style", "text-align:center");
    positionElement.style.textAlign = "center";

    // let teamParentElement= tableRow.getElementsByClassName("logo")[0];
    // let teamContainer= teamParentElement.getElementsByClassName("team_container")[0];
    // teamContainer.setAttribute("style", "width:10%;");

    let teamContainer= tableRow.getElementsByClassName("logo")[0];
    // teamContainer.setAttribute("style", "width:80%;");

    let logoContainer= teamContainer.getElementsByClassName("logo_container")[0];
    // logoContainer.setAttribute("style", "width:10%");
    let logoImage= teamContainer.getElementsByClassName("image")[0];
    // console.log("logoImage element: ");
    // console.log(logoImage);

    let playedElement= tableRow.getElementsByClassName("played")[0];
    // playedElement.setAttribute("style", "text-align:center");
    let wonElement= tableRow.getElementsByClassName("won")[0];
    // wonElement.setAttribute("style", "text-align:center");
    let drawnElement= tableRow.getElementsByClassName("drawn")[0];
    // drawnElement.setAttribute("style", "text-align:center");
    let lostElement= tableRow.getElementsByClassName("lost")[0];
    // lostElement.setAttribute("style", "text-align:center");
    let goalForElement= tableRow.getElementsByClassName("for")[0];
    // goalForElement.setAttribute("style", "text-align:center");
    let againstElement= tableRow.getElementsByClassName("against")[0];
    // againstElement.setAttribute("style", "text-align:center");
    let gdElement= tableRow.getElementsByClassName("gd")[0];
    // gdElement.setAttribute("style", "text-align:center");
    let pointsElement= tableRow.getElementsByClassName("points")[0];


    let formElement= tableRow.getElementsByClassName("form")[0];
    let formStructure = formElement.getElementsByClassName("form_structure")[0];
    // for(let j = 0, k = 5; j < form.length && formLength < 6 ; j++,k--) {
    //     console.log("formStructure");
    //     console.log(formStructure);
    //     let li = formStructure.getElementsByTagName("li")[k];
    //
    //     console.log("li");
    //     console.log(li);
    //     let formTagDiv = li.getElementsByClassName("form_tag")[0];
    //     console.log("form tag div");
    //     console.log(formTagDiv);
    //     let outcome = form[j];
    //     formTagDiv.innerText = outcome;
    //     switch (outcome){
    //         case "W":
    //             formTagDiv.style.backgroundColor="forestgreen";
    //             break;
    //         case "L":
    //             formTagDiv.style.backgroundColor="red";
    //             break;
    //         case "D":
    //             formTagDiv.style.backgroundColor="dimgray";
    //             break;
    //     }
    //
    // }
    // if(form.length > 1){
    //     let divider = formStructure.getElementsByClassName("form_divider")[0];
    //     divider.innerText = "|";
    // }


    for(j = 0; j < form.length && formLength < 6; j++) {
        console.log("formStructure");
        console.log(formStructure);
        let li = formStructure.getElementsByTagName("li")[j];

        console.log("li");
        console.log(li);
        let formTagDiv = li.getElementsByClassName("form_tag")[0];
        console.log("form tag div");
        console.log(formTagDiv);
        let outcome = form[j];
        formTagDiv.innerText = outcome;
        switch (outcome){
            case "W":
                formTagDiv.style.backgroundColor="forestgreen";
                break;
            case "L":
                formTagDiv.style.backgroundColor="red";
                break;
            case "D":
                formTagDiv.style.backgroundColor="dimgray";
                break;
        }

    }


    let text = tableRow.getElementsByTagName("b")[0];
    text.innerText = team;
    logoImage.src = logo;
    playedElement.innerText=played;
    wonElement.innerText=won;
    drawnElement.innerText=drawn;
    lostElement.innerText=lost;
    goalForElement.innerText=goalFor;
    againstElement.innerText=against;
    gdElement.innerText=gd;
    pointsElement.innerText= points;

}

function updateLeagueTableRecord(tableData){
    console.log("inside loadTable");
    for(let i = 0; i < 10; i++){
        updateLeagueTableEntry(i, tableData[i] );
    }
}
function updateTopScorerTableRecord(scorerData){
    console.log("Score Data: ");
    console.log(scorerData.length);

    for(let i = 0; i < scorerData.length; i++){
        updateTopScorerTableEntry(i, scorerData[i]);
    }
}

function updateTopScorerTableEntry(index, scorerEntry){
    console.log("scorers entry");
    console.log(scorerEntry);
    let tableRow = document.getElementById(String(index));
    // console.log("table row: ");
    // console.log(tableRow);

    // let position = String(id + 1);

    let name = scorerEntry['name'];
    let team = scorerEntry['team'];
    let goals = scorerEntry['goals'];
    let assists = scorerEntry['assists'];
    let played = scorerEntry['played'];
    let goalsPer90 = scorerEntry['goals_per_90'];
    let minPerGoal = scorerEntry['mins_per_goal'] === undefined ? 0 : scorerEntry['mins_per_goal'];
    let totalShots = scorerEntry['total_shots'];
    let shotsOnTarget = scorerEntry['shots_on_target'];
    let goalConversion = scorerEntry['goal_conversion'];
    let shotAccuracy = scorerEntry['shot_accuracy'];

    // console.log("inside table row, position element: ");
    // console.log(tableRow.getElementsByClassName("position"));


    let positionElement= tableRow.getElementsByClassName("position")[0];
    positionElement.style.textAlign = "center";


    let playerNameContainer= tableRow.getElementsByClassName("name")[0];

    let playerNameElement= playerNameContainer.getElementsByClassName("player_text")[0];
    let teamNameElement= playerNameContainer.getElementsByTagName("div")[1];

    let goalsElement= tableRow.getElementsByClassName("goals")[0];
    let assistsElement= tableRow.getElementsByClassName("assists")[0];
    let playedElement= tableRow.getElementsByClassName("played")[0];
    let goalsPer90Element= tableRow.getElementsByClassName("goals_p_90")[0];
    let minsPerGoalElement= tableRow.getElementsByClassName("mins_p_goal")[0];
    let totalShotsElement= tableRow.getElementsByClassName("total_shots")[0];
    let goalConversionElement= tableRow.getElementsByClassName("goal_conversion")[0];
    let shotAccuracyElement= tableRow.getElementsByClassName("shot_accuracy")[0];

    playerNameElement.innerText = name;
    teamNameElement.innerText = team;
    goalsElement.innerText = goals;
    assistsElement.innerText = assists;
    playedElement.innerText = played;
    minsPerGoalElement.innerText = minPerGoal;
    totalShotsElement.innerText = totalShots;
    goalsPer90Element.innerText = goalsPer90;
    goalConversionElement.innerText = goalConversion + '%';
    shotAccuracyElement.innerText = shotAccuracy + '%';


}































// function updateTableRecord(tableData){
//     console.log("inside loadTable");
//     // console.log(data['table']);
//     // let tableData = data['table'];
//     // console.log(data['table']);
//
//     let table = document.getElementById('league_table');
//     for(let i = 0; i < 4; i++){
//         let tableEntry = tableData[i];
//         console.log("table entry: " + i );
//         console.log(tableEntry);
//         let tableRow = document.getElementById(String(i));
//         console.log("table row: ");
//         console.log(tableRow);
//
//         let position = String(i + 1);
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
//         // table.appendChild(tableRow);
//         let positionElement= tableRow.getElementsByClassName("position")[0];
//         positionElement.setAttribute("style", "text-align:center");
//         positionElement.style.textAlign = "center";
//
//         let teamParentElement= tableRow.getElementsByClassName("team")[0];
//         let teamContainer= teamParentElement.getElementByClassName("team_container");
//         teamContainer.style.display="flex"
//         teamContainer.setAttribute("style", "align-items:last");
//         teamContainer.setAttribute("style", "width:10%;");
//
//         teamContainer.setAttribute("style", "display:flex");
//
//
//         let logoContainer= teamContainer.getElementsByClassName("logo_container")[0];
//         // logoContainer.setAttribute("style", "width:10%");
//         let logoImage= logoContainer.getElementsByClassName("image");
//         console.log("logoImage element: ");
//         console.log(logoImage);
//
//         let playedElement= tableRow.getElementsByClassName("played")[0];
//         playedElement.setAttribute("style", "text-align:center");
//         let wonElement= tableRow.getElementsByClassName("won")[0];
//         wonElement.setAttribute("style", "text-align:center");
//         let drawnElement= tableRow.getElementsByClassName("drawn")[0];
//         drawnElement.setAttribute("style", "text-align:center");
//         let lostElement= tableRow.getElementsByClassName("lost")[0];
//         lostElement.setAttribute("style", "text-align:center");
//         let goalForElement= tableRow.getElementsByClassName("for")[0];
//         goalForElement.setAttribute("style", "text-align:center");
//         let againstElement= tableRow.getElementsByClassName("against")[0];
//         againstElement.setAttribute("style", "text-align:center");
//         let gdElement= tableRow.getElementsByClassName("gd")[0];
//         gdElement.setAttribute("style", "text-align:center");
//         let pointsElement= tableRow.getElementsByClassName("points")[0];
//         pointsElement.setAttribute("style", "text-align:center");
//         pointsElement.style.fontSize ="large";
//         pointsElement.style.fontWeight ="bold";
//
//         // let formElement= tableRow.getElementsByClassName("form");;
//
//
//         positionElement.innerHTML=position;
//         // positionElement.setAttribute("style", "text-align:center");
//
//         // teamParentElement.append(teamContainer);
//         // teamContainer.appendChild(logoContainer);
//         let text = tableRow.getElementsByTagName("b")[0];
//         text.style.padding = "10px"
//         text.style.border = "none";
//         text.innerHTML = team;
//
//         // logoContainer[0] = logoImage
//         // teamContainer.appendChild(text);
//         logoImage.src = logo;
//         // logoImage.alt = "SVG Image";
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
//
//     }
//     // let tableRow = table.appendChild(document.createElement("tr"));
// }
//
//
//
//
//




// function updateTableRecord(tableData){
//     console.log("inside loadTable");
//     // console.log(data['table']);
//     // let tableData = data['table'];
//     // console.log(data['table']);
//
//     let table = document.getElementById('league_table');
//     for(let i = 0; i < tableData.length; i++){
//         let tableEntry = tableData[i];
//         let tableRow = document.getElementById(String(i));
//         console.log("table row: ");
//         console.log(tableRow);
//
//         let position = String(i + 1);
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
//         // let positionElement= tableRow.appendChild(document.createElement("td"));
//         // let teamParentElement= tableRow.appendChild(document.createElement("td"));
//         // let teamContainer= document.createElement("span");
//         // // teamContainer.setAttribute("style", "align-items:last");
//         // // teamContainer.setAttribute("style", "width:10%;");
//         // // teamContainer.style.display="flex"
//         // // teamContainer.setAttribute("style", "display:flex");
//         //
//         //
//         // let logoContainer= tableRow.appendChild(document.createElement("span"))
//         // logoContainer.setAttribute("style", "width:10%");
//         // let logoImage= tableRow.appendChild(document.createElement("img"));
//         //
//         //
//         // let playedElement= tableRow.appendChild(document.createElement("td"));
//         // playedElement.setAttribute("style", "text-align:center");
//         // let wonElement= tableRow.appendChild(document.createElement("td"));
//         // wonElement.setAttribute("style", "text-align:center");
//         // let drawnElement= tableRow.appendChild(document.createElement("td"));
//         // drawnElement.setAttribute("style", "text-align:center");
//         // let lostElement= tableRow.appendChild(document.createElement("td"));
//         // lostElement.setAttribute("style", "text-align:center");
//         // let goalForElement= tableRow.appendChild(document.createElement("td"));
//         // goalForElement.setAttribute("style", "text-align:center");
//         // let againstElement= tableRow.appendChild(document.createElement("td"));
//         // againstElement.setAttribute("style", "text-align:center");
//         // let gdElement= tableRow.appendChild(document.createElement("td"));
//         // gdElement.setAttribute("style", "text-align:center");
//         // let pointsElement= tableRow.appendChild(document.createElement("td"));
//         // pointsElement.setAttribute("style", "text-align:center");
//         // pointsElement.style.fontSize ="large";
//         // pointsElement.style.fontWeight ="bold";
//         //
//         // // let formElement= tableRow.appendChild(document.createElement("td"));
//         //
//         //
//         // positionElement.innerHTML=position;
//         // positionElement.setAttribute("style", "text-align:center");
//         //
//         // teamParentElement.append(teamContainer);
//         // teamContainer.appendChild(logoContainer);
//         // let text = document.createElement("b");
//         // text.style.padding = "10px"
//         // text.style.border = "none";
//         // text.innerHTML = team;
//         //
//         // logoContainer.appendChild(logoImage)
//         // teamContainer.appendChild(text);
//         // logoImage.src = logo;
//         // logoImage.alt = "SVG Image";
//         //
//         //
//         // // logoElement.innerHTML=logo;
//         // playedElement.innerHTML=played;
//         // wonElement.innerHTML=won;
//         // drawnElement.innerHTML=drawn;
//         // lostElement.innerHTML=lost;
//         // goalForElement.innerHTML=goalFor;
//         // againstElement.innerHTML=against;
//         // gdElement.innerHTML=gd;
//         // pointsElement.innerHTML= points;
//         //
//
//
//         // table.appendChild(tableRow);
//         let positionElement= tableRow.getElementsByClassName("position")[0];
//         // positionElement.setAttribute("style", "text-align:center");
//         // positionElement.style.textAlign = "center";
//
//         let teamParentElement= tableRow.getElementsByClassName("team");
//         let teamContainer= tableRow.getElementsByClassName("team_container")[0];
//         teamContainer.setAttribute("style", "align-items:last");
//         teamContainer.setAttribute("style", "width:10%;");
//         teamContainer.style.display="flex"
//         teamContainer.setAttribute("style", "display:flex");
//
//
//         let logoContainer= teamContainer.getElementsByClassName("logo_container")[0];
//         // logoContainer.setAttribute("style", "width:10%");
//         let logoImage= logoContainer.getElementsByClassName("image");
//         console.log("logoImage element: ");
//         console.log(logoImage);
//
//         let playedElement= tableRow.getElementsByClassName("played")[0];
//         playedElement.setAttribute("style", "text-align:center");
//         let wonElement= tableRow.getElementsByClassName("won")[0];
//         wonElement.setAttribute("style", "text-align:center");
//         let drawnElement= tableRow.getElementsByClassName("drawn")[0];
//         drawnElement.setAttribute("style", "text-align:center");
//         let lostElement= tableRow.getElementsByClassName("lost")[0];
//         lostElement.setAttribute("style", "text-align:center");
//         let goalForElement= tableRow.getElementsByClassName("for")[0];
//         goalForElement.setAttribute("style", "text-align:center");
//         let againstElement= tableRow.getElementsByClassName("against")[0];
//         againstElement.setAttribute("style", "text-align:center");
//         let gdElement= tableRow.getElementsByClassName("gd")[0];
//         gdElement.setAttribute("style", "text-align:center");
//         let pointsElement= tableRow.getElementsByClassName("points")[0];
//         pointsElement.setAttribute("style", "text-align:center");
//         pointsElement.style.fontSize ="large";
//         pointsElement.style.fontWeight ="bold";
//
//         // let formElement= tableRow.getElementsByClassName("form");;
//
//
//         positionElement.innerHTML=position;
//         // positionElement.setAttribute("style", "text-align:center");
//
//         // teamParentElement.append(teamContainer);
//         // teamContainer.appendChild(logoContainer);
//         let text = tableRow.getElementsByTagName("b")[0];
//         text.style.padding = "10px"
//         text.style.border = "none";
//         text.innerHTML = team;
//
//         // logoContainer[0] = logoImage
//         // teamContainer.appendChild(text);
//         logoImage.src = logo;
//         // logoImage.alt = "SVG Image";
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
//
//     }
//     // let tableRow = table.appendChild(document.createElement("tr"));
// }



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




// document.addEventListener('DOMContentLoaded', registerAllEvents);
