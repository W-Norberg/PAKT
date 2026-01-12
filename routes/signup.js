const Database = require("better-sqlite3")
const db = new Database("database.db");
db.pragma("foreign_keys = ON")

const express = require("express")
const router = express.Router()
express().use(express.json())

const bodyParser = require("body-parser")
const { body, matchedData, validationResult} = require("express-validator")
const urlencodedParser = bodyParser.urlencoded({extended: false})


router.get("/", (req,res)=>{
    res.render("newUser")
})

router.post("/",
    body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 30}).withMessage("Must be 3-30 characters")
    .isAlphanumeric().withMessage("Only letters and numbers allowed"),
    
    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({min: 5}).withMessage("Must be at least 5 characters")
    .matches(/\d/).withMessage("Must contain a number")
    .matches(/\W/).withMessage("Must contain a special character")
    

    , (req, res)=>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        //From here req.body.username and req.body.password should be clean and safe
        let username = req.body.username
        let password = req.body.password

        console.log(username, password)
        
})


module.exports = router
