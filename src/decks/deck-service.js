const DeckService = {
    getAllDecks(knex){
        return knex.select('*').from('decks')
    },

    addDeck(knex, newDeck){
        return knex.insert(newDeck)
        .into('decks')
        .returning('*')
        .then(rows =>{
            return rows[0]
        })
    },

    getById(knex, id){
        return knex.from('decks')
        .select('*')
        .where('id', id).first()
    },

    deleteDeck(knex, id){
        return knex('decks')
        .where({ id })
        .delete()
    },

    updateDeck(knex, id, updatedDeck){
        return knex('decks')
        .where({ id })
        .update(updatedDeck)
    },
}
module.exports = DeckService