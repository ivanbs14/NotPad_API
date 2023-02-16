const { Router } = require("express");

/* import class */
const SessionController = require("../controllers/SessionController");
/* instanciando class na memoria */
const sessionController = new SessionController();

const sessionRoutes = Router();
sessionRoutes.post("/", sessionController.create);

 module.exports = sessionRoutes;

