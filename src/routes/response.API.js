/* imports */
const { Router } = require("express");

const ResponseAPI = require("../controllers/ResponseAPI");

/* instanciando rota na memoria */
const responseRoutes = Router();

const responseAPI = new ResponseAPI();

/* utilizando metodo GET receber as notas do users*/
responseRoutes.get("/", responseAPI.responseAPI);

/* exportando o userRoutes */
module.exports = responseRoutes;