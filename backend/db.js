const mongoose = require("mongoose");
require("dotenv").config();

const db_password = process.env.DB_PASSWORD;

const mongoURI = `mongodb+srv://21bd1a05aqcsef:${db_password}@rulengine.ghk0l.mongodb.net/?retryWrites=true&w=majority&appName=rulengine`;

async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

function disconnectDB() {
  mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB };
