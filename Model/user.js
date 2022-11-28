const mongoose = require('mongoose');
// const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name:  {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    
    password: {
        type: String,
        required: true,
    }
})

// module.exports = mongoose.model('User', userSchema)
const User = mongoose.model("user", userSchema);

// const validate = (data) => {
//     const schema = Joi.object({
//         name: Joi.string().required(),
//         email: Joi.string().email().required(),
//         password: Joi.string().required()
//     })
//     return schema.validate(data)
// }



// module.exports = {User, validate}
module.exports = User;