const express = require("express");
const router = express.Router()
const bodyParser = require("body-parser")
const { body, matchedData, validationResult} = require("express-validator")
const db = require("../db");
const urlencodedParser = bodyParser.urlencoded({extended: false})
router.use(express.urlencoded({extended: true}));


router.get("/", (req,res)=>{
    const currentUserId = req.session.userId
    if(!currentUserId){
        return res.redirect("/login")
    }
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(currentUserId)
    const activities = db.prepare("SELECT id, name FROM activities WHERE user_id = ?").all(currentUserId)
    // res.render("activityTracker", {username: user.username, values: {error: req.session.error}})
    res.render("activityTracker", {username: user.username, values: {error: req.session.error, activities: {activities}}})
    
})

router.post("/submitNewActivity",
    body("activity")
    .trim()
    .notEmpty().withMessage("Activity is required")
    .isLength({ min: 2, max: 64}).withMessage("Must be 2-64 characters")
    .matches(/^[\p{L}\p{N} ]+$/u).withMessage("Only letters and numbers allowed")

    , async (req, res, next)=>{
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).redirect("/activityTracker")
        }
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.session.userId)
        
        const insertNewActivity = `INSERT INTO activities (user_id, name)
        VALUES (?, ?)`
        try{
            process.stdout.write(`Trying to enter new activity (${req.body.activity}) into ${user.username}'s database -> `)
            const stmt = db.prepare(insertNewActivity)
            await stmt.run(req.session.userId, req.body.activity)
            console.log("Succes")
            req.session.error = ""
            return res.redirect("/activityTracker")
        } catch(err){
            if(err.code === "SQLITE_CONSTRAINT_UNIQUE"){
                console.log("Activity already available")
                req.session.error = "Acitvity already available"
                return res.status(400).redirect("/activityTracker")
            }
            console.log(err)
            return res.redirect("/activityTracker")
        }
})


module.exports = router;
