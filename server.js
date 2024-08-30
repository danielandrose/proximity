const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Connect to MongoDB
mongoose.connect('mongodb+srv://Daniel:dan123@cluster0.ptelakr.mongodb.net/proximity', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Define a schema and model for proximity sensor data
const proximitySchema = new mongoose.Schema({
  detected: Boolean,  // Whether an object is detected or not
  timestamp: { type: Date, default: Date.now }
});

const Proximity = mongoose.model('Proximity', proximitySchema);

// POST endpoint to save proximity sensor data
app.post('/api/proximity', async (req, res) => {
  try {
    const proximityData = new Proximity({
      detected: req.body.detected
    });
    await proximityData.save();
    res.status(201).send(proximityData);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET endpoint to retrieve the latest proximity sensor data
app.get('/api/proximity/latest', async (req, res) => {
  try {
    const data = await Proximity.findOne().sort({ timestamp: -1 });
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
