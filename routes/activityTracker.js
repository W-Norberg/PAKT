const express = require("express");
const router = express.Router()

router.get("/", (req,res)=>{
    if(!req.session.userId){
        return res.redirect("/login")
    }
    res.render("activityTracker", {userId: req.session.userId})
    
})

module.exports = router;
