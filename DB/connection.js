const mongoose =  require("mongoose");

module.exports = connection = async () =>{
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        await mongoose.connect(process.env.DB, connectionParams);
        console.log("connected to the database");
    } catch (error) {
        console.log(error, "could not connect database");
    }
};