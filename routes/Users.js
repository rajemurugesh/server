//express
const express = require("express");

const router = express.Router();
//model
const User = require("../Model/model");

//bcrypt
const bcrypt = require("bcryptjs");

//signup
router.post("/register", async (req, res) => {
  try {
    let existinguser = await User.findOne({ email: req.body.email });
    if (existinguser) {
      return res.status(400).json("user already exist in DB");
    }
    let hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: hash,
    });
    const data3 = await user.save();
    res.json(data3);
  } catch (err) {
    res.status(400).json(err);
    // res.send({message: "Successfully Registered , Please login now"})
  }
});

// router.post("/login", async (req, res) => {
//   try {
//     const userpassword = await User.findOne({ email: req.body.email });
//     if (!userpassword) {
//       return res.status(400).json("Email not exist in DB");
//     }

//     const validpassword = await bcrypt.compare(
//       req.body.password,
//       userpassword.password
//     );

//     if (!validpassword) {
//       return res.status(400).json("Password not valid");
//     }

//     const webtoken = jwt.sign({ email: userpassword.email }, "Raje"); //secret key ,its like a ID card

//     res.header("auth", webtoken).send(webtoken);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

// const validateuser = (req, res, next) => {
//   var token = req.header("auth");
//   req.token = token;
//   next();
// };


// router.get("/get", validateuser, async (req, res) => {
//   jwt.verify(req.token, "raje", async (err, data) => {
//     if (err) {
//       res.sendStatus(403);
//       console.log(data)
//     } else {
//       const data2 = await User.find().select(['-password']);
//       res.json(data2);
//     }
//   });
// });




// // //login
router.post("/login", (req, res)=> {
  const { email, password} = req.body
  User.findOne({ email: email}, (err, user) => {
      if(user){
          if(user && bcrypt.compare(password, user.password)) {
              res.send({message: "Login Successfull", user: user})
          } else {
              res.send({ message: "Password didn't match"})
          }
      } else {
          res.send({message: "User not registered"})
      }
      if(err) {
        res.send({message: "please register"})
      }
    
  })
}) 

router.get('/get', (req,res) => {
  User.find().then(model => {
      res.send(model)
  })
})



module.exports = router;