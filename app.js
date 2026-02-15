require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("Connected to Database"))

app.use(express.json())

const subscribersRouter = require('./routes/subscribers.js')
app.use('/subscribers', subscribersRouter)

app.get("/health", (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;