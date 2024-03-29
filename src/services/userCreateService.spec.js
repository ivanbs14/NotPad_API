const UserCreateService = require("./UserCreateService");
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory");
const appError = require("../utils/appError");

describe("TestsUserCreateService", () => {
    let userRepositoryInMemory = null;
    let userCreateService = null;

    beforeEach(() => {
        userRepositoryInMemory = new UserRepositoryInMemory();
        userCreateService = new UserCreateService(userRepositoryInMemory);
    });

    /* Teste para saber se o usuário esta cadastrado com sucesso */
    it("user should be create", async () => {
        const user ={
            name: "User Test",
            email: "user@test.com",
            password: "123"
        };
    
        const userCreated = await userCreateService.execute(user);
    
        expect(userCreated).toHaveProperty("id");
    });

    /* Teste de cadastro com email existente. Retorno = {email ja em uso} */
    it("user not should be create with exists email", async () => {
        const user1 = {
            name: "User Test 1",
            email: "user@test.com",
            password: "123"
        };
        
        const user2 = {
            name: "User Test 2",
            email: "user@test.com",
            password: "456"
        };

        await userCreateService.execute(user1);
        await expect(userCreateService.execute(user2)).rejects.toEqual(new appError("Este email já esta em uso."));
    });
});