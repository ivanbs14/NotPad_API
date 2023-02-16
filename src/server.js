/* imports */
require("express-async-errors");
require("dotenv/config");

const AppError = require("./utils/appError");
const migrationsRun = require("./database/sqlite/migrations");
const uploadConfig = require("./configs/upload");

const cors = require("cors");
const express = require("express");
const routes = require("./routes");

migrationsRun();
/* inicializando express */
const app = express();

/* lib para atender requisiçoes back para front. */
app.use(cors());

/* avisando para o serve qual tipo de requisiçao ele vai receber */
app.use(express.json());

/* import imagem do avatar no insomnia(./File/Avatar) */
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

/* tratamento de error */
app.use(( error, request, response, next ) => {
    /* error pelo usuario */
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.error(error);

    /* error de servidor/codigo */
    return response.status(500).json({
        status: "error",
        message: "Internal server error",
    });
});

/* criando constante para definir porta onde a API vai ficar observando*/
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));