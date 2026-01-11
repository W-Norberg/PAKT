const express = require("express")
const router = express.Router()
express().use(express.json())

const bodyParser = require("body-parser")
const { check, validationResult} = require("express-validator")
const urlencodedParser = bodyParser.urlencoded({extended: false})


router.get("/", (req,res)=>{
    res.render("newUser")
})

router.post("/", urlencodedParser, [
    check("username", "Username must be 3+ characters long")
        .exists()
        .isLength({ min: 3 })


], (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json(errors.array())
    }
})


module.exports = router
