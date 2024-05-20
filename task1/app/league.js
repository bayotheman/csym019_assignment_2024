
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
        $.ajax({
            url:"league.json",
            type:"GET",
            dataType:"json",
            success:function(response){
                createPremierLeagueTable(response);
                loadLeagueTable();
            },
            error:function(e){
                displayError(e);
            },
        });

    }, 500);
})();

/**
 * function that handles the display of error message
 */
function displayError(){
    alert("An error occurred, kindly try again!"); //display the error message as an alert notification
}

/**
 * A function that creates the premier league table using helper functions.
 * @param response void
 */
function createPremierLeagueTable(response){
    registerTeams(response);
    calculateTeamStatistics(response);
    let rank = rankTeams();
    updateLeagueTableRecord(rank);

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
    let rank = Object.values(registeredTeams);    // extract the values (team data) from the registeredTeams object into an array

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

    rank = rank.slice(0, 10); //to take only the top 10 teams

    return rank;
}

/**
 * a function that loops through the tableData and calls a helper function to update the premier league table
 * @param tableData containing ranked teams
 */
function updateLeagueTableRecord(tableData){
    for(let i = 0; i < tableData.length; i++){ // loop through each team in tableData
        updateLeagueTableEntry(i, tableData[i] ); // update each table row at index i with team data

    }
}

/**
 * helper function that updates a single row entry in the premier league table
 * @param id table row identifier
 * @param tableEntry the data to be displayed.
 */
function updateLeagueTableEntry(id, tableEntry) {
    let tableRow = document.getElementById(String(id));
    if (!tableRow) return;

    let {name: team, logo, played, won, drawn, lost, gf: goalFor, ga: against, gd, points, form} = tableEntry; // destructure the table entry elements to get individual properties and maps each table entry property into these variables

    let positionElement = tableRow.querySelector(".position");
    if (positionElement) positionElement.style.textAlign = "center";

    let teamContainer = tableRow.querySelector(".logo");
    if (teamContainer) { //checks the existence of the element
        let logoImage = teamContainer.querySelector(".image");
        if (logoImage) logoImage.src = logo;

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
            if (form.length > 6) { //checks if the form array content is greater than 6
                form = form.splice(0, 6);// if yes extract the first 6 elements
            }
            form.forEach(outcome => { //iterate through the form array
                let formTag = document.createElement('div'); //create a new div tag
                formTag.classList.add('form_tag'); // Adds a base class for styling
                formTag.innerText = outcome; // Set the text to "W", "L", or "D"
                switch (outcome) { // adds a specific class based on the outcome for color coding
                    case "W": //for case W
                        formTag.classList.add('win'); // add base class "win"
                        break;
                    case "L": //for case L
                        formTag.classList.add('lose');// add base class "lost"
                        break;
                    case "D"://for case D
                        formTag.classList.add('draw');// add base class "draw"
                        break;
                }
                formElement.appendChild(formTag); // append the newly created form tag to the form container
            });
        }
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
                createPremierLeagueTopScorersTable(response);
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


