/* imports */
const sqliteConnection = require('../../sqlite');
const createUsers = require('./createUsers');

/* function para rodar as migrations */
async function migrationsRun() {
    const schemas = [
        createUsers
    ].join('');

    /* execuntando os scehmas e exibindo possiveis erros */
    sqliteConnection()
        .then(db => db.exec(schemas))
        .then(error => console.error(error));
}

module.exports = migrationsRun;