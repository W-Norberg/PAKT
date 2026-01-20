const express = require("express");
const session = require("express-session");
const db = require("./db");


//TiDB is a sql cloud sql that is good and should have free 25gb.
//Is persistent and wont remove data between deploys like render prolly does



const app = express();
const PORT = process.env.PORT || 3000;


const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const activityTrackerRouter = require("./routes/activityTracker")


app.use(session({
    name: "MySessionID",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true //Works on https, not localhost
    }
}));

let createUsersTable = `CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`

let createActivityTable = `CREATE TABLE IF NOT EXISTS activities(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        UNIQUE (user_id, name)
        )`
    
let createActivity_entriesTable = `CREATE TABLE IF NOT EXISTS activity_entries(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        entry_date TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (activity_id) REFERENCES activites(id)
)`


db.exec(createUsersTable);
db.exec(createActivityTable);
db.exec(createActivity_entriesTable);


app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/activityTracker", activityTrackerRouter)


// app.use(logger)
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.json());




//GET home page
app.get("/", (req, res)=>{
    res.render("home", {values: {}});

}); 

// function logger(req, res, next){
//     console.log(req.originalUrl)
//     next()
// }

app.listen(PORT, ()=>{
    console.log(`Servers is listening on http://localhost:${PORT}`);
});

//Repoistory uploaded to Render that deploys it