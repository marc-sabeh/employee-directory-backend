const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name :{
        type:String,
        required: "Required",
    },
    email :{
        type:String,
        required: "Required",
        unique: true,
        match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    picture :{
        type:String,
    },
    phone_number :{
        type:String,
        required: "Required",
    },
    password :{
        type:String,
        required: "Required"
    },
    title :{
        type:String,
        required: "Required",
    },
    seiority :{
        type:String,
        required: "Required",
    },
    department_id :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: "Required"
    },
    location :{
        type:String,
        required: "Required",
    },
});

module.exports = mongoose.model("User", userSchema);