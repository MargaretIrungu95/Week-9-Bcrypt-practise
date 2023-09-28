//import Router 
const { Router } = require ("express");
// allows userrouter to access all the methods within Router
const userRouter = Router();

//import controllers to give routes functionality
const {registerUser, listAllUsers, deleteUser, updatePassword, loginUser } = require("../controllers/controllers");
//automatically importted when you insert hashPassword function
const {hashPassword, passwordCheck, tokenCheck} = require("../middleware");

//create a user
userRouter.post("/users/register",hashPassword, registerUser);

//list all users in db
userRouter.get("/users/listAllUsers", tokenCheck, listAllUsers);

//delete a user from db
userRouter.delete("/users/deleteUser", passwordCheck, deleteUser);

//updating user password
userRouter.put("/users/updatePassword", passwordCheck, hashPassword, updatePassword);

//login in user and issue a new web token upon login in
userRouter.get("/users/login", passwordCheck, loginUser);
//export the routes
module.exports = userRouter;