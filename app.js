var mysql = require('mysql');
var con = mysql.createConnection({
host: "localhost", 
user: "root",
 password: "pass4root", 
 port: 3306,
}); 

var express = require("express");
var url = require("url");
var app = express(); 

app.get("/", function (req,res){
    writeSearch(req,res);
});

app.get("/schedule", function (req,res){
    writeSchedule(req,res);
});

app.listen(3000, function (){
    console.log("Server Started");
  });

function writeSearch(req,res){
res.writeHead(200, { "Content-Type": "text/html" });
let query = url.parse(req.url, true).query; 
let search = query.search ? query.search : ""; 
let filter = query.filter ? query.filter : "";
let response = `
<!DOCTYPE html> 
<html lang = "en"> 
<head> 
    <title> Spring 2021 CSE Class Find </title>
</head>

<body> 

<div style="display:inline-block;vertical-align:middle">
    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Stony_Brook_U_logo_horizontal.svg/1280px-Stony_Brook_U_logo_horizontal.svg.png" width="300" height="75">
</div>
<div style="display:inline-block;">
    <h2> &nbsp; &nbsp; CSE Class Find</h2>
</div>
<br></br>
<form method ="get" action ="/">
<b> Search </b> <input type="text" name="search" value="">
<select name ="filter"> 
    <option value="allFeilds"> All Fields</option>
    <option value="courseName"> Course Title</option>
    <option value="courseNum"> Course Number</option> 
    <option value="instructor">Instructor</option> 
    <option value="day"> Day</option>   
    <option value="time">Time</option>   
</select>
<input type="submit" value="Search">
<br>
Example Searches: 316, fodor, 2:30 PM, MW
</Form>
<br></br>
<ol>
`;

let sql = "SELECT * FROM cse316.classes;"

if (filter == "allFeilds")
    sql = `SELECT * FROM cse316.classes
        WHERE Subj LIKE '%` + search + `%' OR
        CRS LIKE '%` + search + `%' OR
        Title LIKE '%` + search + `%' OR
        Cmp LIKE '%` + search + `%' OR
        Sctn LIKE '%` + search + `%' OR
        Days LIKE '%` + search + `%' OR
        Start_Time LIKE '%` + search + `%' OR
        End_Time LIKE '%` + search + `%' OR
        Mtg_Start_Date LIKE '%` + search + `%' OR
        Mtg_End_Date LIKE '%` + search + `%' OR
        Instruction_Mode LIKE '%` + search + `%' OR
        Room LIKE '%` + search + `%' OR
        Instructor LIKE '%` + search + `%' OR
        Enrl_Cap LIKE '%` + search + `%' OR
        Wait_Cap LIKE '%` + search + `%' OR
        Cmbnd_Descr LIKE '%` + search + `%' OR
        Cmbnd_Enrl_Cap LIKE '%` + search + `%'`;

    else if (filter == "courseNum")
        sql = `SELECT * FROM cse316.classes
        WHERE CRS LIKE '%` + search + `%'`;
    else if (filter == "courseName")
        sql = `SELECT * FROM cse316.classes
        WHERE Title LIKE '%` + search + `%'`;
    else if (filter == "instructor")
        sql = `SELECT * FROM cse316.classes
        WHERE Instructor LIKE '%` + search + `%'`;
    else if (filter == "instructor")
        sql = `SELECT * FROM cse316.classes
        WHERE Instructor LIKE '%` + search + `%'`;
    else if (filter == "day")
        sql = `SELECT * FROM cse316.classes
        WHERE Days LIKE '%` + search + `%'`;
    else if (filter == "time")
        sql = `SELECT * FROM cse316.classes
        WHERE Start_Time LIKE '%` + search + `%' OR
        End_Time LIKE '%` + search + `%'`;

con.query(sql, function (err, result){
if(err) throw err;
for (let x of result){
    response +=`
    <li>
    <b> CSE ` + x.CRS + ` - ` +
    x.Title + ` - ` + x.Cmp + ` - Section ` + x.Sctn +`</b>
    <pre> 
        Days:                    `+ x.Days + `
        Start Time:              `+ formatTime(x.Start_Time) + `
        End Time:                `+ formatTime(x.End_Time) + `
        Start Date:              `+ x.Mtg_Start_Date + `
        End Date:                `+ x.Mtg_End_Date + `
        Duration:                `+ x.Duration +` 
        Instruction Mode:        `+ x.Instruction_Mode +`
        Building:                `+ x.Building +` 
        Room:                    `+ x.Room +`
        Instructor:              `+ x.Instructor +`
        Enrollment Cap:          `+ x.Enrl_Cap + `
        Waitlist Cap:            `+ x.Wait_Cap + `
        Combined Description:    `+ x.Cmbnd_Descr +`
        Combined Enrollment Cap: `+ x.Cmbnd_Enrl_Cap +`
        <form action="/schedule" method ="get">
        <button name="add" value="` + [x.CRS,x.Sctn] + `"> Add Class </button></form> </pre>
    </li>`

    

}
res.write(response + "</ol>\n\n</body>\n</html>");
res.end();

});
};

function writeSchedule(req,res){
let query = url.parse(req.url, true).query; 
let id = query.add.split(",");
let addQuery = `INSERT INTO cse316.saved SELECT * FROM cse316.classes WHERE cse316.classes.CRS="`+ id[0] +`" AND cse316.classes.Sctn="` +id[1] + `";`
let response = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title> Schedule</title>
  <style>
    table {
      border-collapse: collapse;
    }

    table,
    td,
    th {
      border: 1px solid grey;
    }

    tr {
      color: blue;
    }
    td {
      height: 500px;
    }
  </style>
</head>

<body>
  <h2>Schedule</h2>
  <a href = "/"><b>Return to Search </b></a>
  <br></br>
  <table width="100%">
    <thead>
      <tr>
        <th scope="col" style="background-color:lightgrey">Monday</th>
        <th scope="col" style="background-color:lightgrey">Tuesday</th>
        <th scope="col" style="background-color:lightgrey">Wendesday</th>
        <th scope="col" style="background-color:lightgrey">Thursday</th>
        <th scope="col" style="background-color:lightgrey">Friday</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Mon</td>
        <td>Tue</td>
        <td>Wed</td>
        <td>Thu</td>
        <td>Fri</td>
      </tr>
    </tbody>
  </table>


</body>
</html>

`



con.query(addQuery, function (err, result){
    if(err) console.log(err);
    con.query("SELECT * FROM cse316.saved WHERE cse316.saved.Days LIKE '%M%' ORDER BY cse316.saved.Start_time;",function(err,result){
        if(err) console.log(err);
        response = response.replace("<td>Mon</td>", getDay(result));
        con.query("SELECT * FROM cse316.saved WHERE cse316.saved.Days LIKE '%TU%' ORDER BY cse316.saved.Start_time;",function(err,result){
            if(err) console.log(err);
            response = response.replace("<td>Tue</td>", getDay(result));
            con.query("SELECT * FROM cse316.saved WHERE cse316.saved.Days LIKE '%W%' ORDER BY cse316.saved.Start_time;",function(err,result){
                if(err) console.log(err);
                response = response.replace("<td>Wed</td>", getDay(result));
                con.query("SELECT * FROM cse316.saved WHERE cse316.saved.Days LIKE '%TH%' ORDER BY cse316.saved.Start_time;",function(err,result){
                    if(err) console.log(err);
                    response = response.replace("<td>Thu</td>", getDay(result));
                    con.query("SELECT * FROM cse316.saved WHERE cse316.saved.Days LIKE '%F%' ORDER BY cse316.saved.Start_time;",function(err,result){
                        if(err) console.log(err);
                        response = response.replace("<td>Fri</td>", getDay(result));
                        res.write(response);
                        res.end();
                    });

                });

            });   
        
        });
        
    });
});

};

function getDay(result){
let retStr = "<td>";
let lastEnd = new Date();
lastEnd.setHours(0);
lastEnd.setMinutes(0);
for (let x of result){
    let current = new Date();
    temp = x.Start_Time.split(":");
    current.setHours(temp[0]);
    current.setMinutes(temp[1]);
    if(current > lastEnd){
        retStr += "\n <b> " + formatTime(x.Start_Time) + " - " +
        formatTime(x.End_Time) + " <br><br>"+
        x.Subj + " " + 
        x.CRS + "-" + 
        x.Sctn + " </b> <p> "+
        x.Title +" <br><br>" +
        x.Instructor + "<br><br>"+
        "<br/><br/>";
        temp = x.End_Time.split(":");
        lastEnd.setHours(temp[0]);
        lastEnd.setMinutes(temp[1]);
    }
}

return retStr + "</td>";

};


function formatTime(time) {
    temp = time.split(":");
    var h = temp[0];
    var m = temp[1]; 
    var hh = "AM";
    if (h > 12){
        h = h - 12;
        hh = "PM";
    }
    if (h == 0){
    h = 12;
    }
    return h+":"+m+" "+hh;
};