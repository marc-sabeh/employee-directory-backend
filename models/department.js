const mongoose = require('mongoose');

let departmentSchema = new mongoose.Schema({
    department_name :{
        type:String,
        required: "Required",
        unique: true,
    },
});

module.exports = mongoose.model("Department", departmentSchema);