require('dotenv').config({ path: './config/.env' });
const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const APIRouter = require('./routers/api_router.js');
const DemoRouter = require('./routers/demo_router.js');
const app = express();

// Environment Variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV;

// Connect with Database
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

let db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Added logger for development and API error debugging
let logType = (NODE_ENV !== 'production')? 
    'dev': ':method :url :status :res[content-length] - :response-time ms';
app.use(morgan(logType));

// Handle Request Payload
app.use(express.json());

// Handle Routes
app.use('/', APIRouter);
app.use('/createDemoData', DemoRouter);
app.all('*', (req, res) => {
    res.status(404).json({ msg: 'Invalid URL called!' });
})

// Connect App to Server
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
