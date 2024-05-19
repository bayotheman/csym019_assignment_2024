
//a key-value data structure to hold teams for referencing.
let registeredTeams ={};

/**
 * an async jQuery function that immediately invoked function expression to load the league table. And subsequently
 * continuously request data from the json file(league.js) and calls the createPremierLeague() function
 * to begin the table creation, and update process.
 *
 */
(function loadLeagueTable(){
    setTimeout(function () {
        $.ajax({    // performs an AJAX request to get the data from the JSON file.
            url:"league.json", // url of the league.json file.
            type:"GET", // HTTP method to use for the request.
            dataType:"json", // type of data expected from the server.
            success:function(response){ // function to call if the request succeeds.
                createPremierLeagueTable(response); //calls function to create and update the Premier League table using the response data.
                loadLeagueTable();// call the function again to continuously request data.
            },
            error:function(e){ // function to call if the request fails.
                displayError(e); // display an error message.
            },
        });

    }, 500); // set a timeout to call the function after 500 milliseconds.

})();
// });
function displayError(){

}

/**
 * A function that creates the premier league table using helper functions.
 * @param response void
 */
function createPremierLeagueTable(response){
    registerTeams(response); // register the teams using the response data.
    calculateTeamStatistics(response); // calculate team statistics using the response data.
    let rank = rankTeams();     // rank the teams based on their statistics and assing the result to variable ranks.
    updateLeagueTableRecord(rank);     // update the league table record with the ranked teams.

}

/**
 * a function that stores an entry for a team using the team name as the key and the team object as the value
 * @param response nothing is returned
 */
function registerTeams(response) {
    registeredTeams = {};   // empty the registeredTeams object for each function call.

    let teams = response["teams"];   // get the list of teams from the response.

    $.each(teams, function(i, team) {    // iterate through each team in the teams array.

        // creates an entry object for each team with initial statistics.
        let entry ={
            name:team["name"],
            logo:team["logo"],
            played:0,
            won:0,
            drawn:0,
            lost: 0,
            gf:0,
            ga:0,
            gd:0,
            points:0,
            form:[]
        }
        registeredTeams[entry.name] = entry;       // add the team entry to the registeredTeams object.
    });

}

/**
 * a function that performs the calculations for team statistics (such as matches played, won, drawn, lost,
 * goal for, goal against, goal difference, points and entry for team form) and ranks each team into an array.
 * @param response nothing is returned.
 */
function calculateTeamStatistics(response) {
    let fixtures = response["fixtures"];     // get the list of fixtures from the response and assigns it to variable fixtures

    $.each(fixtures, function(j, fixture)    // iterate through each fixture in the fixtures array.
    {
        fixture = fixtures[j]; //get fixture object at index j of fixtures array

        let homeTeamName = fixture["home_team"]; //get home team name from fixture
        let awayTeamName = fixture["away_team"]; //get away team name from fixtures

        let home = registeredTeams[homeTeamName]; //get the home team from the registered teams key-value store
        let away = registeredTeams[awayTeamName];//get the home team from the registered teams key-value store


        let homeGoals = 0;// Initialize home goals with a default value of 0.
        if(fixture["home_goals"] !== undefined){//checks fixture if home goals is present
            homeGoals = fixture["home_goals"];// overrides the previously assigned home goals value with the one gotten from fixture
        }

        let awayGoals = 0; // Initialize away goals with a default value of 0.
        if(fixture["away_goals"] !== undefined){ //checks fixture if away goals is present
            awayGoals = fixture["away_goals"]; // overrides the previously assigned away goals value with the one gotten from fixture
        }

        // Update the home team statistics.
        home.gf += homeGoals; // update the home team "goals for" property.
        home.ga += awayGoals;// update the home team "goals against" property.
        home.played += 1; //increment the count of number of matches played for home team
        home.gd += (homeGoals - awayGoals); //calculate and update the goal difference variable for home team

        // console.log("away team"); console.log(away);
        away.gf +=awayGoals;// update the away team "goals for" property.
        away.ga += homeGoals;// update the away team "goals against" property.
        away.played += 1;//increment the count of number of matches played for away team
        away.gd += (awayGoals - homeGoals);//calculate and update the goal difference variable for away team

        // Update the results and form based on the goals scored.
        if(homeGoals > awayGoals){ //if home teams goals > away team goals (if home team wins)
            home["won"] += 1; //update the count for the "won" property of home team by 1
            home["points"] += 3; //increment by 3 the number of points for home team "points" property
            home["form"].push("W"); //push the "W" for win letter into the home team's form property array

            away["lost"] += 1;//update the count for the "won" property of away team by 1
            away["form"].push("L");//push the "L" for win letter into the away team's form property array
        }else if (awayGoals > homeGoals){ //if home teams goals < away team goals (if away team wins)
            away["won"] += 1; //update the count for the "won" property of away team by 1
            away["points"] += 3; //increment by 3 the number of points for home team "points" property
            away["form"].push("W");//push the "W" for win letter into the away team's form property array

            home["lost"] += 1; //update the count for the "lost" property of home team by 1
            home["form"].push("L");//push the "L" for win letter into the home's form property array
        }else{//if the match results in a draw
            home["drawn"] += 1; //update the count for the "drawn" property of home team by 1
            home["points"] += 1; //increment by 1 the number of points for home team "points" property
            home["form"].push("D");//push the "D" for draw letter into the home team's form property array
            away["drawn"] += 1;//update the count for the "drawn" property of away team by 1
            away["points"] += 1;//increment by 1 the number of points for away team's "points" property
            away["form"].push("D");//push the "D" for draw letter into the away team's form property array
        }

    });

}

/**
 * a function that rank registered teams based on points and goal difference.
 * @returns returns an array containing the top 10 teams.
 */
function rankTeams() {
    //creates a league rank
    let rank = Object.values(registeredTeams);
    //sort league table data from top to bottom
    rank.sort((a, b) => {
        if (a["points"] < b["points"]) {
            return 1;
        } else if (a["points"] > b["points"]) {
            return -1;
        } else {
            if (a["gd"] < b["gd"]) {
                return 1;
            } else if (a["gd"] > b["gd"]) {
                return -1;
            }
            return 0;
        }
    });
    // console.log(`registered teams: ${rank}`);
    rank = rank.slice(0, 10); //to take only the top 10 teams
    return rank;
}

/**
 * a function that loops through the tableData and calls an helper function to update the premier league table
 * @param tableData containing ranked teams
 */
function updateLeagueTableRecord(tableData){
    console.log("inside loadTable");
    console.log(tableData);
    tableData.slice(0, 10);
    for(let i = 0; i < tableData.length; i++){
        updateLeagueTableEntry(i, tableData[i] );
    }
}

/**
 * helper function that updates a single row entry in the premier league table
 * @param id table row identifier
 * @param tableEntry the data to be displayed.
 */
function updateLeagueTableEntry(id, tableEntry){
    let tableRow = document.getElementById(String(id));
    if (!tableRow) return;

    let { name: team, logo, played, won, drawn, lost, gf: goalFor, ga: against, gd, points, form } = tableEntry;

    // Ensure the correct elements are updated
    let positionElement = tableRow.querySelector(".position");
    if (positionElement) positionElement.style.textAlign = "center";

    let teamContainer = tableRow.querySelector(".logo");
    if (teamContainer) {
        let logoImage = teamContainer.querySelector(".image");
        if (logoImage) logoImage.src = logo;
    }
    let text = tableRow.querySelector("b");
    if (text) text.innerText = team;

    let playedElement = tableRow.querySelector(".played");
    if (playedElement) playedElement.innerText = played;

    let wonElement = tableRow.querySelector(".won");
    if (wonElement) wonElement.innerText = won;

    let drawnElement = tableRow.querySelector(".drawn");
    if (drawnElement) drawnElement.innerText = drawn;

    let lostElement = tableRow.querySelector(".lost");
    if (lostElement) lostElement.innerText = lost;

    let goalForElement = tableRow.querySelector(".for");
    if (goalForElement) goalForElement.innerText = goalFor;

    let againstElement = tableRow.querySelector(".against");
    if (againstElement) againstElement.innerText = against;

    let gdElement = tableRow.querySelector(".gd");
    if (gdElement) gdElement.innerText = gd;

    let pointsElement = tableRow.querySelector(".points");
    if (pointsElement) pointsElement.innerText = points;

    let formElement = tableRow.querySelector(".form .form_structure");
    if (formElement) {
        formElement.innerHTML = ''; // Clear existing form tags
        form.reverse();
        if(form.length > 6){
            form = form.splice(0,6);
        }
        form.forEach(outcome => {
            let formTag = document.createElement('div');
            formTag.classList.add('form_tag');
            formTag.innerText = outcome;
            switch (outcome){
                case "W":
                    formTag.classList.add('win');
                    break;
                case "L":
                    formTag.classList.add('lose');
                    break;
                case "D":
                    formTag.classList.add('draw');
                    break;
            }
            formElement.appendChild(formTag);
        });
    }
}






//This section handles Top scorers Information.


//a key-value data structure to hold players' information for referencing.
let registeredPlayers ={};

//process list top scorers independent of league table
(function topScorers(){
    setTimeout(function () {
        $.ajax({
            url:"league.json",
            type:"GET",
            dataType:"json",
            success:function(response){
                // console.log("Top score API call ");
                // populateRegisteredPlayersMap(response);
                // console.log("registered players");
                // console.log(registeredPlayers);
                createPremierLeagueTopScorersTable(response);
                // registeredPlayers ={};
                // calculatePlayerStatistics(response);
                topScorers();
            },
            error:function(){
                displayError();
            },
        });

    }, 500);
})();


/**
 * A function that creates the premier league top scorer table using helper functions.
 * @param response void
 */
function createPremierLeagueTopScorersTable(response){
    registeredPlayers = {};
    let scorersMap = calculatePlayerStatistics(response);
    let rank = rankTopScorers(scorersMap);
    updateTopScorerTableRecord(rank);
}


/**
 * a function that loops through the tableData and calls a helper function to update the premier league top scorers table
 * @param scorerData containing ranked teams
 */
function updateTopScorerTableRecord(scorerData){
    console.log("Score Data: ");
    console.log(scorerData.length);

    for(let i = 0; i < scorerData.length; i++){
        updateTopScorerTableEntry(i, scorerData[i]);
    }
    // $.each(scorerData, function (j, score){
    //     updateTopScorerTableEntry(j, score);
    // });

}


/**
 * a function that ranks top scorers players in descending order i.e. highest goals is best.
 * @param scorersMap a key-value data structure for all league scorers
 * @returns [] an array containing the league's top scorers.
 */
function rankTopScorers(scorersMap) {
    let scorersList = Object.values(scorersMap);
    scorersList.sort((a, b) => b["goals"] - a["goals"]);
    return scorersList;
}

/**
 * A function that calculates players goals statistics( goals, assists, matches played, shot accuracy etc.), ranks the
 * @param response
 * @returns  a key-value data structure that contains the scorers' information.
 */
function calculatePlayerStatistics(response) {
    let fixtures = response["fixtures"];
    let scorersMap = {};

    $.each(fixtures, function(i, fixture) {
        let homePlayersStats = fixture["home_team_players_stats"];
        let awayPlayersStats = fixture["away_team_players_stats"];

        // Add team name to each player's stats
        homePlayersStats.forEach(player => player["team"] = fixture["home_team"]);
        awayPlayersStats.forEach(player => player["team"] = fixture["away_team"]);

        // Combine home and away players stats
        let players = homePlayersStats.concat(awayPlayersStats);

        // Update player stats
        players.forEach(player => {
            let playerName = player["name"];
            let playerTeam = player["team"];
            let stat = registeredPlayers[playerName] || {
                name: playerName,
                team: playerTeam,
                played: 0,
                goals: 0,
                assists: 0,
                goals_per_90: 0,
                mins_per_goal: 0,
                total_shots: 0,
                shots_on_target: 0,
                goal_conversion: 0,
                shot_accuracy: 0,
                total_minutes_played: 0
            };

            stat["played"] += 1;
            stat["goals"] += player["goals"];
            stat["assists"] += player["assists"];
            stat["goals_per_90"] += player["goals_in_90"];
            stat["total_minutes_played"] += player["minutes_played"];
            stat["total_shots"] += player["total_shots"];
            stat["shots_on_target"] += player["shots_on_target"];
            stat["goal_conversion"] = Math.round((stat["goals"] / stat["total_shots"]) * 100);
            stat["shot_accuracy"] = Math.round((stat["shots_on_target"] / stat["total_shots"]) * 100);

            if (stat["total_minutes_played"] > 0) {
                stat["goals_per_90"] =((stat["goals"] / stat["total_minutes_played"]) * 90).toPrecision(2);
            } else {
                stat["goals_per_90"] = 0;
            }

            // Calculate minutes per goal
            if (stat["goals"] > 0) {
                stat["mins_per_goal"] = Math.round(stat["total_minutes_played"] / stat["goals"]);
            } else {
                stat["mins_per_goal"] = 0; // or some appropriate value
            }



            registeredPlayers[playerName] = stat;
            if (stat["goals"] > 0) {
                scorersMap[playerName] = stat;
            }
        });
    });

    return scorersMap;
    // let scorersList = rankTopScorers(scorersMap);

    // updateTopScorerTableRecord(scorersList);
}




/**
 * a helper function that updates a single row entry in the premier league top scorers table
 * @param index table row index
 * @param scorerEntry the data to be displayed.
 */
function updateTopScorerTableEntry(index, scorerEntry){
    let tableRow = document.getElementById(String(index));
    if (!tableRow) return;

    let { name, team, goals, assists, played, goals_per_90: goalsPer90, mins_per_goal: minPerGoal = 0,
        total_shots: totalShots, shots_on_target: shotsOnTarget, goal_conversion: goalConversion, shot_accuracy: shotAccuracy } = scorerEntry;

    let positionElement = tableRow.querySelector(".position");
    if (positionElement) positionElement.style.textAlign = "center";

    let playerNameContainer = tableRow.querySelector(".name");
    if (playerNameContainer) {
        let playerNameElement = playerNameContainer.querySelector(".player_text");
        let teamNameElement = playerNameContainer.getElementsByTagName("div")[1];

        if (playerNameElement) playerNameElement.innerText = name;
        if (teamNameElement) teamNameElement.innerText = team;
    }

    let goalsElement = tableRow.querySelector(".goals");
    if (goalsElement) goalsElement.innerText = goals;

    let assistsElement = tableRow.querySelector(".assists");
    if (assistsElement) assistsElement.innerText = assists;

    let playedElement = tableRow.querySelector(".matches_played");
    if (playedElement) playedElement.innerText = played;

    let goalsPer90Element = tableRow.querySelector(".goals_p_90");
    if (goalsPer90Element) goalsPer90Element.innerText = goalsPer90;

    let minsPerGoalElement = tableRow.querySelector(".mins_p_goal");
    if (minsPerGoalElement) minsPerGoalElement.innerText = minPerGoal;

    let totalShotsElement = tableRow.querySelector(".total_shots");
    if (totalShotsElement) totalShotsElement.innerText = totalShots;

    let goalConversionElement = tableRow.querySelector(".goal_conversion");
    if (goalConversionElement) goalConversionElement.innerText = goalConversion + '%';

    let shotAccuracyElement = tableRow.querySelector(".shot_accuracy");
    if (shotAccuracyElement) shotAccuracyElement.innerText = shotAccuracy + '%';
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



// import data from './league1.json' with { type: 'json' };
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
//     // fetch('./league1.json')  // to fetch data from league1.json file
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
