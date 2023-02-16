/* imports */
const { Router } = require("express");

const TagsController = require("../controllers/TagsController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js");

/* instanciando rota na memoria */
const tagsRoutes = Router();

const tagsController = new TagsController();

/* utilizando metodo GET receber as tags do users*/
tagsRoutes.get("/", ensureAuthenticated, tagsController.index);

/* exportando o userRoutes */
module.exports = tagsRoutes;