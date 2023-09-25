const express = require('express');
const app = express();
const port = process.env.PORT || 80;
//const port = 3001
// you can keep port as .env if you are hosting this, if you are running locally specify another port
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB, Email } = require('./db');
const nodemailer = require('nodemailer');

app.use(cors());
app.use(bodyParser.json());

app.post('/test', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    // Check if the email already exists
    const existingEmail = await Email.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ ok: false, errorMessage: 'Email already exists' });
    }

    const newEmail = new Email({ email });
    await newEmail.save();
    res.status(200).json({ ok: true, message: 'Email saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, errorMessage: 'Failed to save email' });
  }
});


  app.get('/unsubscribe', async (req, res) => {
    try {
      const email = req.query.email; // Extract the email from the query parameter
  
      // Process the unsubscribe request here
      await Email.deleteOne({ email }); // Remove the email from the database
  
     
  
      // Respond with a success message
      res.send('Unsubscribe request received.');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to process unsubscribe request.' });
    }
  });


app.listen(port,function(error){
    if (error){
        console.log("something bad")
        
    }
    else{
        console.log("we up on port " + port)
        connectDB();
    }
})

