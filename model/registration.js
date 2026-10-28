const mongoose = require("mongoose")

const register = new mongoose.Schema({

firstName : {
   type : String,
   required : true,
   trim : true
},
lastName : {
   type : String,
   required : true,
   trim : true
},

email : {
 type : String,
   required : true,
   trim : true,
   lowercase: true
}, 
age : {
    type : Number,
   required : true,
   trim : true
},
address : {
    type : String,
   required : true,
   trim : true
},
city : {
    type : String,
   required : true,
   trim : true
}},
{timestamps : true }
)
module.exports = mongoose.model("registration", register)