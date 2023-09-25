const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  }

});

const Email = mongoose.model('Email', emailSchema);

const connectDB = async () => {


    try{const connect = await mongoose.connect('connect to your databse',{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log("MongoDB connected!")
    console.log('hostname: ${connect.connection.host}');

}catch(err){
        consolge.log(err)
    }
    
}

module.exports = {
    connectDB, 
    Email
  };