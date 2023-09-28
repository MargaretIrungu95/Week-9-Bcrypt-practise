//access table in db
const User = require("../models/users");

//import bcrypt
const bcrypt = require ("bcrypt");

// import json web token
const jwt = require("jsonwebtoken");


//function to hash the passwords
async function hashPassword(req, res, next) {
    try {
        //parseint converts the password which is a string to an integer
        //number of salting rounds accessed in .env
        const saltRounds = parseInt(process.env.SALT)
        //these three lines takes the plain password and encrypts it according to the salting rounds specified and returns the password on the table as the hashed password
        const plainTextPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        req.body.password = hashedPassword;
        next();
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: error.message,
            error: error
        })
    }
};

//function to check password
async function passwordCheck(req, res, next) {
    try {
        //get copy of encrypted password from database
        const userDetails = await User.findOne({where : {username: req.body.username}})
        console.log(userDetails);
            //if the userdetails are not null then make password be the password of the user provided
            if(userDetails !== null) {
                var hashedPassword = userDetails.password;
            } else { //if it is null, then use dummy as the plain text password instead and then encrypt it
                var hashedPassword = "Dummy"
            }
        const plainTextPassword = req.body.password;
        //compare plain text and encrypted passwords
        const match = await bcrypt.compare(plainTextPassword, hashedPassword);

        //if the password and username match, do this:
        if (match && userDetails) {
            console.log("Password and Username match!");
           //if they match then go to next function
            next();
            
         //if the plain and encrypted passwords and username do not match, then handle error in the following way:    
        } else {
            throw new Error("Password and Username do not match.");
        }
        
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: error.message,
            error: error
        });
    }
};

//verification of JWT generated for each user -- The verification of the token is needed to make sure the header and payload of the token has not been changed
// compares the jwt that contains the original token and compares it to a test signature to make sure the header, signature and payload match hence a successful verification
async function tokenCheck(req, res, next) { // every function in middle ware has to have the next parameter to allow the server to move on when running the code
    try {
        // access the secret key in .env
        const secretKey = process.env.JWTPASSWORD;
        //accessing the token to be displayed in a certain format 
        //replace() gets rid of the word bearer so that you get back a pure token
        const token = req.header("Authorization").replace("Bearer ", "");
        // verify the token and secret key to get the decoded token back
        const decodedToken = jwt.verify(token, secretKey);
        //from the decoded token, we only want to access the username to confirm if the user is authentic 
        const username = decodedToken.username;

        //get the details of the user from the database for comparison purpose to make sure they match from the info decoded from the token
        const user = await User.findOne({
            //always use where to specify what you are specifically trying to find
            where: {
                username: username
            }
        });

        //this if statement checks to see if the user is in the database or not
        //if user is not found, throw this error
        if (!user) {
            throw new Error ("User was not found in database. Please try another username.");
        } else{ // if found, pass the user's information on to the request and go onto the next step 
            req.user = user;
            next();
        };
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: error.message,
            error: error
        });  
    }
}

//export these functions
module.exports = {
    hashPassword,
    passwordCheck,
    tokenCheck
};