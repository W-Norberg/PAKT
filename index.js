const Database = require("better-sqlite3")
const db = new Database("database.db");
db.pragma("foreign_keys = ON")


const express = require("express")
const app = express();
const PORT = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
// app.use(logger)
app.use(express.json())

app.get("/", (req, res)=>{
    res.render("home");
});


app.post("/log", (req, res) =>{
    console.log(req.body.activity);
    res.redirect("/")
})

app.post("/signup", (req, res)=>{
    res.render("/newUser")
})

const userRouter = require("./routes/users")


app.use("/users", userRouter)


// function logger(req, res, next){
//     console.log(req.originalUrl)
//     next()
// }

/* SERVER */
app.listen(PORT, ()=>{
    console.log(`Servers is listening on http://localhost:${PORT}`)
});

//Repoistory uploaded to Render that deploys it