const DeckService = {
  getAllDecks(knex, user_id) {
    return knex.from('decks').select('*').where('user_id', user_id);
  },

  addDeck(knex, newDeck) {
    return knex
      .insert(newDeck)
      .into('decks')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id, user_id) {
    return knex
      .from('decks')
      .where({ id: id, user_id: user_id })
      .select('*')
      .first();
  },

  deleteDeck(knex, id, user_id) {
    return knex('decks').where({ id: id, user_id: user_id }).delete();
  },

  updateDeck(knex, id, updatedDeck, user_id) {
    return knex
      .from('decks')
      .where('user_id', user_id)
      .where({ id })
      .update(updatedDeck);
  },
};
module.exports = DeckService;
