const express = require("express")
const router = express.Router()

router.get("/", (req,res)=>{
    res.render("newUser")
})

router.post("/", (req, res)=>{
    res.send(`Your username is ${req.body.username}
        and Your password is ${req.body.password}`)
})

module.exports = router
