const Database = require("better-sqlite3")
const db = new Database("database.db");
db.pragma("foreign_keys = ON")


const express = require("express")
const app = express();
const PORT = process.env.PORT || 3000;


// app.use(logger)
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.json())

const signupRouter = require("./routes/signup")
const userRouter = require("./routes/users")

app.use("/signup", signupRouter)
app.use("/users", userRouter)

app.get("/", (req, res)=>{
    res.render("home");
});


app.post("/log", (req, res) =>{
    console.log(req.body.activity);
    res.redirect("/")
})




// function logger(req, res, next){
//     console.log(req.originalUrl)
//     next()
// }

app.listen(PORT, ()=>{
    console.log(`Servers is listening on http://localhost:${PORT}`)
});

//Repoistory uploaded to Render that deploys it