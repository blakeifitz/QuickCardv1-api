const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      nickname: 'TU1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      nickname: 'TU2',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      nickname: 'TU3',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      nickname: 'TU4',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ];
}

function makeDecksArray() {
  return [
    {
      id: 1,
      deck_name: 'First test deck!',
      user_id: 1,
      created: '2029-01-22T16:28:32.615Z',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 2,
      deck_name: 'Second test deck!',
      user_id: 2,
      created: '2029-01-22T16:28:32.615Z',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 3,
      deck_name: 'Third test deck!',
      user_id: 3,
      created: '2029-01-22T16:28:32.615Z',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 4,
      deck_name: 'Fourth test deck!',
      user_id: 3,
      created: '2029-01-22T16:28:32.615Z',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
  ];
}

function makeCardsArray(users, decks) {
  return [
    {
      id: 1,
      keyword: 'First test comment!',
      definition: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      deck: decks[0].id,
      user_id: users[0].id,
    },
    {
      id: 2,
      keyword: 'Second test comment!',
      definition: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      deck: decks[0].id,
      user_id: users[1].id,
    },
    {
      id: 3,
      keyword: 'Third test comment!',
      definition: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      deck: decks[0].id,
      user_id: users[2].id,
    },
    {
      id: 4,
      keyword: 'Fourth test comment!',
      definition: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      deck: decks[0].id,
      user_id: users[3].id,
    },
    {
      id: 5,
      keyword: 'Fifth test comment!',
      definition: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      deck: decks[1].id,
      user_id: users[3].id,
    },
    {
      id: 6,
      keyword: 'Sixth test comment!',
      definition: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      deck: decks[1].id,
      user_id: users[3].id,
    },
    {
      id: 7,
      keyword: 'Seventh test comment!',
      definition: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      deck: decks[3].id,
      user_id: users[3].id,
    },
  ];
}

function makeExpectedDeck(deck) {
  return {
    created: deck.created,
    deck_name: deck.deck_name,
    description: deck.description,
    id: deck.id,
  };
}
function makeExpectedCard(card) {
  return {
    keyword: card.keyword,
    definition: card.definition,
    id: card.id,
    deck: card.deck,
  };
}

function makeExpectedDeckCards(users, deckId, cards) {
  const expectedCards = cards.filter((card) => card.deck === deckId);

  return expectedCards.map((card) => {
    const cardUser = users.find((user) => user.id === card.user_id);
    return {
      id: card.id,
      keyword: card.keyword,
      definition: card.definition,
      user: {
        id: cardUser.id,
        user_name: cardUser.user_name,
        full_name: cardUser.full_name,
        nickname: cardUser.nickname,
        date_created: cardUser.date_created.toISOString(),
        date_modified: cardUser.date_modified || null,
      },
    };
  });
}

function makeMaliciousDeck(user) {
  const maliciousDeck = {
    id: 911,
    created: new Date(),
    deck_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  };
  const expectedDeck = {
    ...makeExpectedDeck([user], maliciousDeck),
    deck_name:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousDeck,
    expectedDeck,
  };
}

function makeMaliciousCard(testUser) {
  const maliciousCard = {
    id: 911,
    keyword: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: testUser.id,
    definition: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    deck: 1,
  };
  const expectedCard = {
    ...makeExpectedCard([testUser], maliciousCard),
    keyword:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    definition: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousCard,
    expectedCard,
  };
}

function makeDecksFixtures() {
  const testUsers = makeUsersArray();
  const testDecks = makeDecksArray(testUsers);
  const testCards = makeCardsArray(testUsers, testDecks);
  return { testUsers, testDecks, testCards };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
          cards,
          decks,
          users
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE decks_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE cards_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('decks_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('cards_id_seq', 0)`),
        ])
      )
  );
}

function seedDecksTables(db, users, decks, cards = []) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await trx.into('users').insert(users);
    await trx.into('decks').insert(decks);
    // update the auto sequence to match the forced id values
    await Promise.all([
      trx.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id]),
      trx.raw(`SELECT setval('decks_id_seq', ?)`, [decks[decks.length - 1].id]),
    ]);
    // only insert cards if there are some, also update the sequence counter
    if (cards.length) {
      await trx.into('cards').insert(cards);
      await trx.raw(`SELECT setval('cards_id_seq', ?)`, [
        cards[cards.length - 1].id,
      ]);
    }
  });
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into('users')
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function seedMaliciousDeck(db, user, deck) {
  return db
    .into('users')
    .insert([user])
    .then(() => db.into('decks').insert([deck]));
}

function seedMaliciousCard(db, testUser, testDecks, card) {
  const testDeck = testDecks[0];
  return db
    .into('users')
    .insert([testUser])
    .then(() => db.into('decks').insert([testDeck]))
    .then(() => db.into('cards').insert(card));
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeAuthHeader,
  makeUsersArray,
  makeDecksArray,
  makeExpectedDeck,
  makeExpectedCard,
  makeExpectedDeckCards,
  makeMaliciousCard,
  makeMaliciousDeck,
  makeCardsArray,
  makeDecksFixtures,
  cleanTables,
  seedDecksTables,
  seedMaliciousCard,
  seedMaliciousDeck,
  seedUsers,
};
