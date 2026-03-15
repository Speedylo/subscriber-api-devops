require('dotenv-flow').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(process.env.DATABASE_URL)
	.then(() => console.log(`Connected to ${process.env.NODE_ENV} Database`))
	.catch(console.error);
	
app.use(morgan('combined'));
app.use(express.json());

const subscribersRouter = require('./routes/subscribers.js');
app.use('/subscribers', subscribersRouter);

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

module.exports = app;