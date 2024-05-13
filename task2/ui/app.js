document.addEventListener('DOMContentLoaded', registerEvents);

function registerEvents(){
        createReport();
}



function getReportData(){
    return [
        {
            "name": "Manchester City",
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
            "name": "Manchester City",
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
        }
        // ,
        // {
        //     "name": "Totteham Hotspur",
        //     "logo": "https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg",
        //     "played": 10,
        //     "won": 5,
        //     "drawn": 3,
        //     "lost": 2,
        //     "gf": 6,
        //     "ga": 4,
        //     "gd": 2,
        //     "points": 18
        // }

    ];
}

function createTableStructure() {
    let table = document.createElement("table");
    table.setAttribute("style", "padding:5px; margin:5px");
    table.setAttribute("style", "padding:5px; margin:5px");

    let thead = document.createElement("thead");
    thead.setAttribute("id", "table_head");
    // thead.setAttribute("style", "text-align:left")
    table.append(thead);

    thead.innerHTML =
        '            <tr>\n' +
        '                <th scope="col" id="position_col_header" style="text-align: center">Position</th>\n' +
        // '                <th scope="col" id="logo_col_header"></th>\n' +
        '                <th scope="col" id="team_col_header" style="text-align: left">Team</th>\n' +
        '                <th scope="col" id="played_col_header" style="text-align: center">Played</th>\n' +
        '                <th scope="col" id="won_col_header" style="text-align: center">Won</th>\n' +
        '                <th scope="col" id="drawn_col_header" style="text-align: center">Drawn</th>\n' +
        '                <th scope="col" id="lost_col_header" style="text-align: center">Lost</th>\n' +
        '                <th scope="col" id="for_col_header" style="text-align: center">For</th>\n' +
        '                <th scope="col" id="against_col_header" style="text-align: center">Against</th>\n' +
        '                <th scope="col" id="gd_col_header" style="text-align: center">GD</th>\n' +
        '                <th scope="col" id="points_col_header" style="text-align: center">Points</th>\n' +
        // '                <th scope="col" id="form_col_header">Form</th>\n' +
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
    // let h6 = document.createElement('h6');
    let title =` ${dataItem.name} Stats`;
    div.setAttribute("class", "container");
    div.setAttribute("style", "width:300px; height:300px; margin:30px;  text-align:center");
    let ctx = document.createElement('canvas');
    ctx.setAttribute("class", "chart");
    // let br = document.createElement('br');
    // div.append(br);
    // div.append(h6);
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
    div.setAttribute("style", "margin:30px;  text-align:center");
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
    return document.getElementsByTagName('main');
}
function createReport(){
    let data = getReportData();
    let container= getHtmlMainContainer();
    let table = createTable(data);
    let pieChart = createPieChart(data);
    container[0].append(table);
    container[0].append(pieChart);
    if(data.length > 1){
        container[0].append(createBarChart(data));
    }



}




