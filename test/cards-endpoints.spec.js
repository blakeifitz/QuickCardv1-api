const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Decks Endpoints', function () {
  let db;

  const { testUsers, testDecks, testCards } = helpers.makeDecksFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`GET /api/card`, () => {
    context(`Given no cards`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/card')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context('Given there are cards in the database', () => {
      beforeEach('insert cards', () =>
        helpers.seedDecksTables(db, testUsers, testDecks, testCards)
      );

      it('responds with 200 and all of the cards', () => {
        const expectedCard = testCards.map((card) =>
          helpers.makeExpectedCard(card)
        );
        return supertest(app)
          .get('/api/card')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [expectedCard[0]]);
      });
    });

    context(`Given an XSS attack card`, () => {
      const testUser = helpers.makeUsersArray()[0];
      const { maliciousCard, expectedCard } = helpers.makeMaliciousCard(
        testUser
      );

      beforeEach('insert malicious card', () => {
        return helpers.seedMaliciousCard(
          db,
          testUser,
          testDecks,
          maliciousCard
        );
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/card`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect((res) => {
            expect(res.body[0].keyword).to.eql(expectedCard.keyword);
            expect(res.body[0].definition).to.eql(expectedCard.definition);
          });
      });
    });
  });

  describe(`GET /api/card/:card_id`, () => {
    context(`Given no cards`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const cardId = 123456;
        return supertest(app)
          .get(`/api/card/${cardId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, {
            error: {
              message: `That card doesn't exist`,
            },
          });
      });
    });

    context('Given there are cards in the database', () => {
      beforeEach('insert cards', () =>
        helpers.seedDecksTables(db, testUsers, testDecks, testCards)
      );

      it('responds with 200 and the specified card', () => {
        const cardId = 2;
        const expectedCard = helpers.makeExpectedCard(testCards[cardId - 1]);

        return supertest(app)
          .get(`/api/card/${cardId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
          .expect(200, expectedCard);
      });
    });

    context(`Given an XSS attack card`, () => {
      const testUser = helpers.makeUsersArray()[0];
      const { maliciousCard, expectedCard } = helpers.makeMaliciousCard(
        testUser
      );

      beforeEach('insert malicious card', () => {
        return helpers.seedMaliciousCard(
          db,
          testUser,
          testDecks,
          maliciousCard
        );
      });
      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/card/${maliciousCard.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            expect(res.body.keyword).to.eql(expectedCard.keyword);
            expect(res.body.definition).to.eql(expectedCard.definition);
          });
      });
    });
  });
});
