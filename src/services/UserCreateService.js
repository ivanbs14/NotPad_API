const { hash } = require("bcryptjs");
const appError = require("../utils/appError");

class UserCreateService {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async execute({ name, email, password }) {
        /* Logica de buscar dados incluída no arquivo UserRepository.js */
        const checkUsersExists = await this.userRepository.findByEmail(email);

        /* exibindo error caso email ja exist */
        if(checkUsersExists) {
        throw new appError("Este email já esta em uso.");
        }

        /* criptografando senha */
        const hashedPassword = await hash(password, 8);

        /* Logica de buscar dados incluída no arquivo UserRepository.js */
        const userCreated = await this.userRepository.create({ name, email, password: hashedPassword });

        return userCreated;
    }
}

module.exports = UserCreateService;