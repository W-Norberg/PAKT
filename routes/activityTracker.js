const express = require("express");
const router = express.Router()
const bodyParser = require("body-parser")
const { body, matchedData, validationResult} = require("express-validator")
const db = require("../db");
const urlencodedParser = bodyParser.urlencoded({extended: false})
router.use(express.urlencoded({extended: true}));


router.get("/", (req,res)=>{
    if(!req.session.userId){
        return res.redirect("/login")
    }
    res.render("activityTracker", {userId: req.session.userId})
    
})

router.post("/submitNewActivity",
    body("activity")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 30}).withMessage("Must be 3-30 characters")
    .matches(/^[\p{L}\p{N}]+$/u).withMessage("Only letters and numbers allowed")

    , async (req, res, next)=>{
    const errors = validationResult(req);
        if(!errors.isEmpty()){

        }
})


module.exports = router;
