const express = require("express")
const bodyParser = require("body-parser")
const { body, matchedData, validationResult} = require("express-validator")
const argon2 = require("argon2")
const db = require("../db");


const router = express.Router()
const urlencodedParser = bodyParser.urlencoded({extended: false})
router.use(express.urlencoded({extended: true}));









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
    .matches(/^(?=.*[\p{Script=Latin}])(?=.*\p{N})(?=.*[@£$€{}\[\]\\!#¤%&\/()=?*+\-_.:,;])[\p{Script=Latin}\p{N}@£$€{}\[\]\\!#¤%&\/()=?*+\-_.:,;]+$/u).withMessage("Must contain a number, a letter and a special character (@ £ $ € { } [ ] \ ! # ¤ % & / ( ) = ? * + - _ . : , ;)")
    

    , async (req, res, next)=>{
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
        let password_hash;
         try{
                password_hash = await argon2.hash(password, {type: argon2.argon2id});
            } catch(err){
                res.status(500).send("Internal server error")
            }

        const insertUser = `
        INSERT INTO users (username, password_hash)
        VALUES (?, ?)`
        
        try{
            console.log(`Trying to enter user ${username} into database...`)
            const stmt = db.prepare(insertUser)
            stmt.run(username, password_hash)
            console.log(`Successfully entered user ${username} into database`)
            res.redirect("/login")
        } catch(err){
            if(err.code === "SQLITE_CONSTRAINT_UNIQUE"){
                console.log("Username already in use! User not added")
                return res.status(409).render("newUser",{
                    errors: [{msg: "Username already in use"}],
                    values: {username}
                })
            }
            console.log(err);
            return res.status(500).send("Internal server error")
        }
        
        
})


module.exports = router;