const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const { body, matchedData, validationResult} = require("express-validator")
const Database = require("better-sqlite3")
const argon2 = require("argon2")


const db = new Database("db/app.db");
db.pragma("foreign_keys = ON")
let sql;


const router = express.Router()
express().use(express.json())

function giveUsernameOrPasswordError(res, errors){
    return res.status(400).render("login", {
                    values: {error: "Username or password wrong"},
                    errors: errors.array()
                })
}




router.get("/", (req,res)=>{
    res.render("login", {values: {}});
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
    .matches(/^(?=.*[\p{Script=Latin}])(?=.*\p{N})(?=.*[@£$€{}\[\]\\!#¤%&\/()=?*+\-_.:,;])[\p{Script=Latin}\p{N}@£$€{}\[\]\\!#¤%&\/()=?*+\-_.:,;]+$/u).withMessage("Must contain a number, a letter and a special character (@ £ $ € { } [ ] \ ! # ¤ % & / ( ) = ? * + - _ . : , ;)")


   , async (req, res) =>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return giveUsernameOrPasswordError(res, errors)
        }

        //From here req.body.username and req.body.password should be clean and safe
        const user = db.prepare("SELECT * FROM users WHERE username = ?").get(req.body.username)
        if(!user){
            return giveUsernameOrPasswordError(res, errors)       
        }
        console.log("enenfen")

        res.redirect("/")


})


module.exports = router;
