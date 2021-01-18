const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Decks Endpoints', function() {
  let db

  const {
    testUsers,
    testDecks,
    testCards,
  } = helpers.makeDecksFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/deck`, () => {
    context(`Given no decks`, () => {
        beforeEach(() =>
        helpers.seedUsers(db, testUsers)
      )
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/deck')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })

    context('Given there are decks in the database', () => {
      beforeEach('insert decks', () =>
        helpers.seedDecksTables(
          db,
         testUsers,
          testDecks,
        )
      )

      it('responds with 200 and all of the decks', () => {
        const expectedDeck = testDecks.map(deck =>
          helpers.makeExpectedDeck(
            deck
          )
        )
        return supertest(app)
          .get('/api/deck')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [expectedDeck[0]])
      })
    })

    context(`Given an XSS attack deck`, () => {
      const testUser = helpers.makeUsersArray()[0]
      const {
        maliciousDeck,
        expectedDeck,
      } = helpers.makeMaliciousDeck(testUser)

      beforeEach('insert malicious deck', () => {
        return helpers.seedMaliciousDeck(
          db,
          testUser,
          maliciousDeck,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/deck`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedDeck.name)
            expect(res.body[0].description).to.eql(expectedDeck.description)
          })
      })
    })
  })

  describe(`GET /api/deck/:deck_id`, () => {
    context(`Given no decks`, () => {
      beforeEach(() =>
        helpers.seedUsers(db, testUsers)
      )

      it(`responds with 404`, () => {
        const deckId = 123456
        return supertest(app)
          .get(`/api/deck/${deckId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: {
            message: `That deck doesn't exist`,
          }
         })
      })
    })

    context('Given there are decks in the database', () => {
      beforeEach('insert decks', () =>
        helpers.seedDecksTables(
          db,
          testUsers,
          testDecks,
          testCards,
        )
      )

      it('responds with 200 and the specified deck', () => {
        const deckId = 2
        const expectedDeck = helpers.makeExpectedDeck(
          testDecks[deckId - 1],
        )

        return supertest(app)
          .get(`/api/deck/${deckId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
          .expect(200, expectedDeck)
      })
    })

    context(`Given an XSS attack deck`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousDeck,
        expectedDeck,
      } = helpers.makeMaliciousDeck(testUser)

      beforeEach('insert malicious deck', () => {
        return helpers.seedMaliciousDeck(
          db,
          testUser,
          maliciousDeck,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/deck/${maliciousDeck.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedDeck.title)
            expect(res.body.content).to.eql(expectedDeck.content)
          })
      })
    })
  })
})