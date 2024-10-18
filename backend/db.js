const mongoose = require("mongoose");
require("dotenv").config();

const db_password = process.env.DB_PASSWORD;

const mongoURI = `mongodb+srv://korninani:${db_password}@cluster0.p7nwv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
