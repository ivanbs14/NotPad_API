const knex = require("../database/knex");

class NotesController {
    /* funçao create nota Consultar DocQbuild */
    async create(request, response) {
        const { title, description, tags, links } = request.body;
        const user_id = request.user.id;

        /* inserindo a nota */
        const note_id = await knex("notes").insert({
            title,
            description,
            user_id
        });

        /* linksInsert, que vai percorrer cada link existente */
        const linksInsert = links.map(link => {
            return {
                note_id,
                url: link
            }
        });

        await knex("links").insert(linksInsert);

        /* tagsInsert, que vai percorrer cada tag existente */
        const tagsInsert = tags.map(name => {
            return {
                note_id,
                name,
                user_id
            }
        });

        await knex("tags").insert(tagsInsert);

        response.json();

    }

    /* funçao show Consultar DocQbuild */
    async show(request, response) {
        const { id } = request.params;

        const note = await knex("notes").where( {id} ).first();
        const tags = await knex("tags").where( { note_id:  id }).orderBy("name");
        const links = await knex("links").where( { note_id: id }).orderBy("created_at");


        return response.json({
            ...note,
            tags,
            links
        });
    }

    /* funçao delete nota Consultar DocQbuild */
    async delete(request, response) {
        const { id } = request.params;

        await knex("notes").where({ id }).delete();

        return response.json();
    }

    /* funçao receber dados, aplicar filtros de notas e tags */
    async index(request, response) {
        const { title, tags } = request.query;

        const user_id = request.user.id;

        let notes;

        if (tags) {
            /* convertendo texto simples para vetor */
            const filterTags = tags.split(',').map(tag => tag.trim());

            notes = await knex("tags")
                .select([
                    "notes.id",
                    "notes.title",
                    "notes.user_id",
                ])
                .where("notes.user_id", "=", user_id)
                .whereLike("notes.title", `%${title}%`)
                .whereIn("name", filterTags)
                .innerJoin("notes", "notes.id", "tags.note_id")
                .groupBy("notes.id")
                .orderBy("notes.title")

        } else {
            notes = await knex("notes")
                .where({ user_id })
                .whereLike("title", `%${title}%`)
                .orderBy("title");
        }

        const userTags = await knex("tags").where({ user_id });
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id);

            return {
                ...note,
                tags: noteTags
            }
        });

        return response.json(notesWithTags);
    }
}

module.exports = NotesController;