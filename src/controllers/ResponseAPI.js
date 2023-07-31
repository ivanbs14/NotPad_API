class ResponseAPI {
    async responseAPI(request, response) {

        const estaSincronizado = true;

        response.json(estaSincronizado);
    };
}

module.exports = ResponseAPI;