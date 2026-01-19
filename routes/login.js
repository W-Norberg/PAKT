require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser")
const { body, matchedData, validationResult} = require("express-validator")
const argon2 = require("argon2");
const db = require("../db");


//Remember to comment your code!!!!!!!

let sql;

const router = express.Router()
express().use(express.json())


const urlencodedParser = bodyParser.urlencoded({extended: false})
router.use(express.urlencoded({extended: true}));






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
        if (!user){
            return giveUsernameOrPasswordError(res, errors)       
        }
        try {
            if (await argon2.verify(user.password_hash, req.body.password)){
                console.log(`Correct password for ${user.username}!`)
                req.session.userId = user.id;
                res.redirect("activityTracker")

            } else {
                console.log("password did not match, returning wrong username or password...")
                giveUsernameOrPasswordError(res, errors)
            }
        } catch{
            console.log("Internal error")
            res.send("Internal error, sorry!")
        }



})


module.exports = router;
