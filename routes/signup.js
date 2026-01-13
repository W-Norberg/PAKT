const Database = require("better-sqlite3")
const db = new Database("db/app.db");
db.pragma("foreign_keys = ON")
let sql;
let createUsersTable = `CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`


db.exec(createUsersTable)


const express = require("express")
const router = express.Router()
express().use(express.json())

const bodyParser = require("body-parser")
const { body, matchedData, validationResult} = require("express-validator")
const urlencodedParser = bodyParser.urlencoded({extended: false})


router.get("/", (req,res)=>{
    res.render("newUser", {values: {}});
})

router.post("/",
    body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 30}).withMessage("Must be 3-30 characters")
    .matches(/^[\p{L}\p{N}]+$/u).withMessage("Only letters and numbers allowed"),
    
    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({min: 5}).withMessage("Must be at least 5 characters")
    .matches(/\d/).withMessage("Must contain a number")
    .matches(/\W/).withMessage("Must contain a special character")
    

    , (req, res, next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render("newUser", {
                values: {username: req.body.username},
                errors: errors.array()
            })
        }

        //From here req.body.username and req.body.password should be clean and safe
        let username = req.body.username
        let password = req.body.password

        const insertUser = `
        INSERT INTO users (username, password)
        VALUES (?, ?)`
        
        try{
            console.log("Entering user into database...")
            const stmt = db.prepare(insertUser)
            stmt.run(username, password)
            res.redirect("/")
        } catch(err){
            if(err.code === "SQLITE_CONSTRAINT_UNIQUE"){
                console.log("Username already in use!")
                return res.status(409).render("newUser",{
                    errors: [{msg: "Username already in use"}],
                    values: {username}
                })
            }
            console.log(err);
            return res.status(500).send("Internal server error")
        }
        
        
})


module.exports = router
