const express = require("express");
const {user} = require("../Model/user");
const jwt = require('jsonwebtoken')
const router = express.Router();

const JWT_SECRET = 'some super secret...'


router.post("/forgetpassword", async (req, res) => {
    const { email } = req.body;
    // res.send(email)

    //make sure user exist in database
    if(email !== user.email) {
        res.send('User not registered')
        return;
    }

    //user exists
    const secret = JWT_SECRET + user.password
    const Payload = {
        email: user.email,
        id: user.id
    }
    const token = jwt.sign(Payload, secret, {expiresIn: '15m'})
    const link = `http://localhost/3000/resetpassword/${user.id}/${token}`
    console.log(link);
    res.send('password reset link sent to ur email')
})

router.get('/resetpassword/:id/:token', (req, res) => {
    res.send(req.params);
})



module.exports = router;