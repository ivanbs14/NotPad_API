/* imports */
const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const UserController = require("../controllers/UserController");
const UserAvatarController = require("../controllers/UserAvatarController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js");

/* instanciando rota na memoria */
const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const userController = new UserController();
const userAvatarController = new UserAvatarController();

/* utilizando metodo POST para enviar e receber users*/
usersRoutes.post("/", userController.create);

/* utilizando metodo PUT para updated dados */
usersRoutes.put("/", ensureAuthenticated, userController.update);

/* utilizando metodo patch para updated apenas em um file */
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);

/* exportando o userRoutes */
module.exports = usersRoutes;