//NPM Intialization 
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require ('cors');


const port = process.env.PORT|| 3005;



const app = express();

//middleware
app.use(express.json())
app.use(express.urlencoded())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());



//DB Connection
const CONNECTION_URL = 'mongodb+srv://Rajeswari:raje1992@cluster1.wm1nl.mongodb.net/loginregister';

mongoose.connect(CONNECTION_URL , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("DB CONNECTED");
}).catch(()=>{
    console.log("UNABLE TO CONNECT DB");
})

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