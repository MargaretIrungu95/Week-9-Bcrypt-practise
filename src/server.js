//import .env and configure its content
require("dotenv").config();

//import express
const express = require("express");
const cors = require ("cors");

// rename express to app
const app = express();

//import router
const userRouter = require("./routes/routes");
//import users table from model#
const User = require("./models/users");


// specify port the server will listen on
const port = process.env.PORT || 5001; //if the server cant load on 5002 it will load on 5001.

function syncTables() {
    User.sync();
    //creates the user table if it doesnt already exist. if it exists, nothing is done.
}

//app.use() is for middleware
app.use(express.json());
app.use(cors());

//middleware to allow use of routes, which are now connected to the controllers to send req and res
app.use(userRouter);


//health check for your API and see if server is working
app.get("/health", (req, res) => {
    res.status(200).json({
        message: "SUCCESS! This API is alive and healthy!"
    })
});

// listener for your server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
   //run the function to sync and create the tables
    syncTables();
});
