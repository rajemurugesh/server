//NPM Intialization 
const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const connection = require('./DB/connection')
const cors = require ('cors');
const cookieParser = require('cookie-parser')


const port = process.env.PORT|| 3005;



const app = express();

//middleware
app.use(express.json())
app.use(express.urlencoded())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin:['http://localhost:3000']
}));

connection ();


//Routes
app.get("/", (req,res) => {
    res.send("MY API IS RUNNING SUCCESSFULLY")
});

//server creation
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

//Router

const data = require("./routes/Users")

app.use('/', data)

// const forget = require("./routes/forgetpassword")

// app.use('/', forget)