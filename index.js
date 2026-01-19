const express = require("express");
const Database = require("better-sqlite3");
const session = require("express-session");



const db = new Database("db/app.db");
db.pragma("foreign_keys = ON");
let sql;


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
    // if(!req.session.viewCount){
    //     req.session.viewCount = 1
    // }else{
    //     req.session.viewCount += 1;
    // }
    // res.render("home", {viewCount: req.session.viewCount});
    // console.log(req.session.viewCount)
}); 



// function logger(req, res, next){
//     console.log(req.originalUrl)
//     next()
// }

app.listen(PORT, ()=>{
    console.log(`Servers is listening on http://localhost:${PORT}`);
});

//Repoistory uploaded to Render that deploys it