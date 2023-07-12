const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8000;
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const noteRouter = require('./routes/noteRoutes');
const paymentController = require("./userControllers/paymentController");

app.use(cors());
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));
app.use('/users', userRouter);
app.use('/note', noteRouter);
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/orders', paymentController.orders);
app.post('/verify', paymentController.verify);

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});

const mongodbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/crud-api';

mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }) 
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
