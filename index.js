const express = require("express")
const app = express();
const PORT = process.env.PORT || 3000;


app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));


app.get("/", (req, res)=>{
    res.render("home");
});

app.post("/log", (req, res) =>{
    console.log(req.body.activity);
    res.redirect("/")
})


/* SERVER */
app.listen(PORT, ()=>{
    console.log(`Servers is listening on http://localhost:${PORT}`)
});