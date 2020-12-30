const CardService = {
    getAllCards(knex){
        return(knex)
        .select('*')
        .from('cards')
    },
    addCard(knex, newCard){
        return knex.insert(newCard)
        .into('cards')
        .returning('*')
        .then( rows => {
            return rows[0]
        })
    },

    getById(knex, id){
        return knex.from('cards')
        .select('*')
        .where('id', id).first()
    },

    deleteCard(knex, id){
        return knex('cards')
        .where({id})
        .delete()
    },

    updateCard(knex, id, updatedFields){
        return knex('cards')
        .where({ id})
        .update(updatedFields)
    }
}

module.exports = CardService