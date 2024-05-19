document.addEventListener('DOMContentLoaded', registerEvents);
reportData = {};
function registerEvents(){
    authorization()
    createReport();
}

function authorization() {
    let token = sessionStorage.getItem("token");
    console.log("token: ");
    console.log(token);
    if (token === null) {
        window.location.href = "login.html";
    }
}

function createReport(){
    let container = document.getElementById('reportContainer');
    createReportHelper(container);
}
function createReportHelper(container){
    console.log("inside createReport()")
    let data = getReportData();
    data.sort((a, b) => {
        if (a.points < b.points) return 1;
        if (a.points > b.points) return -1;
        return a.gd < b.gd ? 1 : (a.gd > b.gd ? -1 : 0);
    });
    let table = createTable(data);
    let pieChart = createPieChart(data);
    container.appendChild(table);
    container.appendChild(pieChart);
    if(data.length > 1){
        container.appendChild(createBarChart(data));
    }

}



//Report Generation

function getReportData(){
    console.log("inside getReportData()");
    console.log("report data");
    let checkedValues = JSON.parse(localStorage.getItem('data'));

    console.log(checkedValues);
    if(checkedValues === null){
        return [];
    }

    return Object.values(checkedValues);
}

function createTableStructure() {
    let table = document.createElement("table");
    table.setAttribute("style", "padding:5px; margin:5px");
    table.setAttribute("style", "padding:5px; margin:5px");

    let thead = document.createElement("thead");
    thead.setAttribute("id", "table_head");
    table.append(thead);

    thead.innerHTML =
        '            <tr>\n' +
        '                <th scope="col" id="position_col_header" style="text-align: center">Position</th>\n' +
        '                <th scope="col" id="team_col_header" style="text-align: left">Team</th>\n' +
        '                <th scope="col" id="played_col_header" style="text-align: center">Played</th>\n' +
        '                <th scope="col" id="won_col_header" style="text-align: center">Won</th>\n' +
        '                <th scope="col" id="drawn_col_header" style="text-align: center">Drawn</th>\n' +
        '                <th scope="col" id="lost_col_header" style="text-align: center">Lost</th>\n' +
        '                <th scope="col" id="for_col_header" style="text-align: center">For</th>\n' +
        '                <th scope="col" id="against_col_header" style="text-align: center">Against</th>\n' +
        '                <th scope="col" id="gd_col_header" style="text-align: center">GD</th>\n' +
        '                <th scope="col" id="points_col_header" style="text-align: center">Points</th>\n' +
        '            </tr>';
    return table;
}



function createTable(data){
    let div = document.createElement('div');
    div.setAttribute("style", "padding:20px; display:flex; align-item:center");
    let table = createTableStructure();
    for(let i =0; i < data.length; i++){
        let tr = createTableEntry(i, data[i]);
        table.append(tr);
    }
    div.append(table);
    return div;
}

function createPieChart(data){
    let div = document.createElement('div');
    div.setAttribute("class", "container");
    div.setAttribute("style", "display:flex; flex-wrap:wrap;" +
        " width:100%; margin:20px,20px,20px,20px; padding:5px; text-align:center; box-sizing: border-box;");

    for(let i = 0; i < data.length; i++){
        let chart = createSinglePieChart(data[i]);
        div.append(chart);
    }

    return div;
}

function createTableEntry(rowIndex, data){
        let tableEntry = data;
        let tableRow = document.createElement("tr");
        let position = rowIndex + 1;
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

        let positionElement= tableRow.appendChild(document.createElement("td"));
        positionElement.setAttribute("style", "text-align:center");


        let teamElement= tableRow.appendChild(document.createElement("td"));
        teamElement.setAttribute("style", "text-align:left");
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


        positionElement.innerHTML=position;
        teamElement.innerText = team;

        playedElement.innerText=played;
        wonElement.innerText=won;
        drawnElement.innerText=drawn;
        lostElement.innerText=lost;
        goalForElement.innerText=goalFor;
        againstElement.innerText=against;
        gdElement.innerText=gd;
        pointsElement.innerText= points;
    return tableRow;

}
function createSinglePieChart(dataItem){
    let div = document.createElement('div');
    let title =` ${dataItem.name} Stats`;
    div.setAttribute("class", "container");
    div.setAttribute("style", "width:300px; height:300px; margin:30px;  text-align:center");
    let ctx = document.createElement('canvas');
    ctx.setAttribute("class", "chart");
    div.append(ctx);

    let won = dataItem['won'];
    let lost = dataItem.lost;
    let drawn = dataItem.drawn;
    let remaining = 38 - dataItem.played;

    let data = {
        labels:['Win', 'Loss', 'Draw', 'Remainder'],
        datasets:[{
            label:`${dataItem.name} Statistics`,
            data: [won,lost ,drawn, remaining],
            backgroundColor: [
                'rgb(0,180,0)',
                'rgb(255,0,0)',
                'rgb(225,150, 0)',
                'rgb(120,120,120)',
            ]
            ,
            hoverOffset: 4
        }],
    };

    let config = {
        type:'pie',
        data: data,

        options:{
            plugins:{
                title:{
                    display: true,
                    text: title,
                    color: 'rgb(80,80,80)',
                    font:{
                        weight:'bold',
                        size:16
                    }
                }
            }
        }
    };
    new Chart(ctx, config);
    return div;

}
function createBarChart(dataset){
    let div = document.createElement('div');
    div.setAttribute("id", "container");
    div.setAttribute("style", "margin:30px; width:90%; text-align:center");
    let ctx = document.createElement('canvas');
    ctx.setAttribute("id", "myChart");
    div.append(ctx);

    let labels = dataset.map(row => row.name);

    let data = {
        labels:labels,
        datasets:[
            {
            label: 'Won',
            data: dataset.map(item => item.won),
            backgroundColor:'rgb(0,180,0)',
            borderWidth : 1
        },
            {
                label: 'Lost',
                data: dataset.map(item => item.lost),
                backgroundColor:'rgb(255,0,0)',
                borderWidth : 1
            },
            {
                label: 'Drawn',
                data: dataset.map(item => item.drawn),
                backgroundColor:'rgb(225,150, 0)',
                borderWidth : 1
            },
            {
                label: 'Remaining Games',
                data: dataset.map(item => (38 - item.played)),
                backgroundColor:'rgb(100,100, 100)',
                borderWidth : 1
            }
        ]
    };

    let title = "Teams Stats Comparison";
    let config = {
        type :'bar',
        options:{
            animation: false,
            plugins: {
                legend:{
                    display:true
                },
                tooltip:{
                    enabled: true
                },

                title:{
                    display: true,
                    text: title,
                    color: 'rgb(80,80,80)',
                    font:{
                        weight:'bold',
                        size:16
                    }
                }
            },
            responsive:true,
            interaction:{
                intersect:false
            },
            scales:{
                x:{
                    stacked: false,
                },
                y:{
                    stacked: false
                }
            }
        },

        data: data

    };


    new Chart(ctx,
       config );

    return div;

}

function getHtmlMainContainer(){
    // return document.getElementsByTagName('main');
    return document.getElementById('reportContainer');

}



