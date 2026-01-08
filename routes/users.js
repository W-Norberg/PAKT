const express = require("express")
const router = express.Router()

router.get("/", (req, res)=>{
    console.log(req.query.name)
    res.send("User List")
});

// router.get("/new", (req, res)=>{
//     res.render("users/new", {firstName: "Enter name"});
// });

// router.post("/", (req, res, next)=>{
//     const isValid = false
//     if (isValid){
//         users.push({firstName: req.body.firstName})
//         res.redirect(`/users/${users.length - 1}`)
//     }
//     else{
//         console.log("Error")
//         res.render("users/new", {firstName: req.body.firstName})
//     }
// })


// router.route("/:userId")
//     .get((req, res)=>{
//         console.log(req.user)
//         res.send(`Get User With ID ${req.params.userId}`)
//     }).put((req, res)=>{
//         res.send(`Update User With ID ${req.params.userId}`)
//     }).delete((req, res)=>{
//         res.send(`Delete USer With ID ${req.params.userId}`)
//     })


// const users = [{name: "Bob"}, {name: "Ricky"}]
// router.param("userId", (req, res, next, userId) =>{
//     req.user = users[userId]
//     next()
// })

module.exports = router