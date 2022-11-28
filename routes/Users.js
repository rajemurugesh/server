const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const User = require("../Model/user")
const PasswordReset = require('../Model/passwordReset')

const transporter = nodemailer.createTransport({
    host:'0.0.0.0',
    port:'1025'

});

router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    })

    const result = await user.save()
    console.log(result)

    const {password, ...data} = await result.toJSON()

    res.send(data)
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email})

    if (!user) {
        return res.status(404).send({
            message: 'user not found'
        })
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'invalid credentials'
        })
    }

    const token = jwt.sign({_id: user._id}, `${process.env.JWT_SECRET_KEY}` )

    // res.send(token)

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.send({ message: 'success', user: user})
})


router.get('/user', async (req, res)=>{
  try {
  const cookie = req.cookies['jwt']

  const claims = jwt.verify(cookie, `${process.env.JWT_SECRET_KEY}` )

  if(!claims) {
    return res.status(401).send({
      message:'unauthenticated'
    })
  }
 const user= await User.findOne({_id: claims._id})

 const {password, ...data} = await user.toJSON()
  res.send(data)
} catch (e){
  return res.status(401).send({
    message:'invalid'
  })
}
})



router.post('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 0})

    res.send({
        message: 'success'
    })
})

router.post('/forgotpassword', async (req, res) => {
    const email = req.body.email;
    const token = Math.random().toString(20).substring(2, 12);

    const passwordReset = new PasswordReset({
        email,
        token
    })

    await passwordReset.save();

    const url = `http://localhost:3000/resetpassword/${token}`;

    await transporter.sendMail({
        from: 'admin@example.com',
        to: email,
        subject: 'Reset your password!',
        html: `Click <a href="${url}">here</a> to reset your password`
    })

    res.send({
        message: 'Check your email'
    })
});

router.post('/resetpassword', async (req, res) => {
// if(req.body.password !== req.body.password_confirm) {
//     return res.status(400).send({
//         message:"Password do not match!"
//     })
// }

    const passwordReset = await PasswordReset.findOne({token: req.body.token});

    
    const {email} = await passwordReset.toJSON();
    console.log(email)

    console.log(JSON.stringify({ x: 5, y: 6 }));
    
    const user = await User.findOne({email});

    if(!user) {
        return res.status(404).send({
            message: "User Not Found"
        })
    }

    const salt = await bcrypt.genSalt(10)

    user.password = await bcrypt.hash(req.body.password, salt);
    user.save();

    res.send({
        message: 'Success'
    })

});


module.exports = router;
