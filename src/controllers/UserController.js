/* imports */
const { hash, compare } = require("bcryptjs");
const appError = require("../utils/appError");

const UserRepository = require("../repositories/UserRepository");
const sqliteConnection = require("../database/sqlite");
const UserCreateService = require("../services/UserCreateService");

class UserController {
    async create(request, response) {
       const { name, email, password } = request.body;

       const userRepository = new UserRepository();
       const userCreateService = new UserCreateService(userRepository);

       await userCreateService.execute({ name, email, password });

       /* conteudo foi desacoplado para pasta services, usercreateservices */
       
       return response.status(201).json();
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id;

        const database = await sqliteConnection();
        /* consulta o id do database com o id indicado */
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

        /* se o id nao exister no database */
        if(!user) {
            throw new appError("Usuário não encontrado");
        }

        /* se o email ja for existente */
        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new appError("Este e-mail já esta em uso.");
        }

        /* confere o que foi modificado e atualiza no database */
        /* ?? parametro que indica, se existir conteudo nome, use o name. Se nao use o user.name*/
        user.name = name ?? user.name;
        user.email = email ?? user.email;

        /* error caso o usuario nao digite a senha antiga para alterar pela nova */
        if (password && !old_password) {
            throw new appError("Você precisa digitar a senha antiga")
        }

        /* error caso a senha antiga nao seja igual a digitada */
        if(password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if(!checkOldPassword) {
                throw new appError("A senha antiga não confere.");
            }

            user.password = await hash(password, 8);
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, user_id]
        );

        return response.json();
    }
}

module.exports  = UserController;