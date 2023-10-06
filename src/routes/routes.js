//import Router 
const { Router } = require ("express");
// allows userrouter to access all the methods within Router
const userRouter = Router();

//import controllers to give routes functionality
const {registerUser, listAllUsers, deleteUser, updatePassword, loginUser } = require("../controllers/controllers");
//automatically imported when you insert hashPassword function
const {hashPassword, passwordCheck, tokenCheck} = require("../middleware");

//create a user
userRouter.post("/users/register",hashPassword, registerUser);// password protected by hashing using bcrypt

//list all users in db
userRouter.get("/users/listAllUsers", tokenCheck, listAllUsers);//secured with token check (jwt)

//delete a user from db
userRouter.delete("/users/deleteUser", passwordCheck, deleteUser); //password check checks if the password entered and hashed password are the same

//updating user password
userRouter.put("/users/updatePassword", passwordCheck, hashPassword, updatePassword);// password protected by hashing using bcrypt

//login in user and issue a new web token upon login in
userRouter.get("/users/login", passwordCheck, loginUser); //password check to make sure they match to details in database token check not needed as user will have one generated upon log in
//export the routes
module.exports = userRouter;