//importing dependencies and fileconnections needed
const User = require("../models/users");
const bcrypt = require ("bcrypt");
const jwt = require ("jsonwebtoken");

//connection to make route to create user in db function
async function registerUser (req, res) {
    try {
        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });
        //creating and signing the token before sending response to give the response along with the token
        const expirationTime = 1000*60*60*24*7;   // milli = 1000 ,, 1000 milliseconds * 60 seconds in a minute * 60 mins in an hr * 24hrs perday * 7 days a week
        //access the secret key as an envitronment variable stored in .env without revealing it for security 
        const privateKey = process.env.JWTPASSWORD
        //payload consists of user details  -- use the username to know if you have the right user
        const payload = {
          username: req.body.username
        };
        // establish an expiration time for when token will expire and become invalid and need to be renewed --  time is defined in milliseconds hence the calculation for expirationTime
        const options = {
          expiresIn: expirationTime
        }
        // this is where the signature process takes place and establish the token, which is made up of the header(contains info on signing algorithm used), payload and private key 
        const token = await jwt.sign(payload, privateKey, options);
        // display encoded token in terminal and can be decoded on jwt.io
        console.log (token);
        
        //upon success, send back username, email and the token for the requested user
        res.status(201).json({
            message: "Success! User has been registered to the database!",
            user: {
                username: req.body.username,
                email: req.body.email,
                token: token
            }
        });
        // if error occurs send back error response
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: error.message,
            detail: error
        })
    }
};

// Login user
async function loginUser (req, res) {
  try {
    //find a user by their username 
    const user = await User.findOne({where: {username: req.body.username}});
    
    //create a jwt for the user upon log in same method as register user. reference that controller for further details on each step
    const expirationTime = 1000*60*60*24*7; // milli = 1000 ,, 1000 milliseconds * 60 seconds in a minute * 60 mins in an hr * 24hrs perday * 7 days a week
    const privateKey = process.env.JWTPASSWORD // access secret key
    const payload = { //access user's username
      username: req.body.username
    };
    const options = {// expiration date for how long the token will be valid for before a new one needs to be issued/ generated
      expiresIn: expirationTime
    }
    // create and sign token 
    const token = await jwt.sign(payload, privateKey, options);
    // log the generated token onto the terminal
    console.log(token);
    //success message
    res.status(201).json({
      message: `${payload} has been logged in successfully!`,
      user: {
        username: user.username,
        email: user.email,
        token: token
      },
    });
    //error message 
  } catch (error) {
    console.log(error);
    res.status(501).json({
        message: error.message,
        detail: error
    })
  }
}



//listing all users
async function listAllUsers (req, res) {
    try {
      //find all users and list them
        const listOfUsers = await User.findAll();
        res.status(200).json({
            message: "Success! All users in database are: ",
            userlist: listOfUsers
        })
        //error response if one is encountered
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: error.message,
            detail: error
        })
    }
};

//deleting a user by their username
const deleteUser = async (req, res) => {
    try {
      const selectedUser = await User.findOne({ where: { username: req.body.username } });
      //if selected user is not found in db the do this:
      if (!selectedUser) {
        res.status(404).json({
          success: false,
          message: "User was not found. Please try a different username.",
          username: req.body.username,
        });
      } else { //if the user is found, then delete the user
        await User.destroy();
        res.status(200).json({
          message: "User has been successfully deleted!",
          deletedUser: selectedUser,
        });
      }
      //if error is encountered, return error response
    } catch (error) {
      console.log(error);
      res.status(501).json({
        message: error.message,
        error: error,
      });
    }
};


//updating a user's password
const updatePassword = async (req, res) => {
    try {
        //find specific user by username
      const userDetails = await User.findOne({
        where: { username: req.body.username },
      });
       //userdetails is on index.js and searches for the username of certain user so as to update the password.
      await userDetails.update({
        password: req.body.password,
      });
      //once new password is set save these details onto db and give the success response
      await userDetails.save();
      res.status(200).json({
        message: "User password updated",
        username: req.body.username
      });
    } catch (error) {
      console.log(error);
      res.status(501).json({
        message: error.message,
        detail: error,
      });
    }
};

  


//export functions that contain connections
module.exports = {
    registerUser,
    listAllUsers,
    deleteUser,
    updatePassword,
    loginUser
}