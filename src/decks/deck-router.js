const path = require('path');
const express = require('express');
const xss = require('xss');
const DeckService = require('./deck-service');

const deckRouter = express.Router();
const jsonParser = express.json();

const serializeDeck = deck => ({
    id: deck.id,
    deck_name: xss(deck.deck_name),
    description: xss(deck.description),
    created: deck.created
})

deckRouter
.route('/')
.get((req, res, next)=>{
    const knexInstance = req.app.get('db')
    DeckService.getAllDecks(knexInstance)
    .then(decks => {
        return res.json(decks.map(serializeDeck))
    })
    .catch(next)
})

.post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db')
    const { deck_name, description, created } = req.body
    const newDeck = { deck_name, description }

    for(const [key, value] of Object.entries(newDeck))
    if( value == null)
        return res.status(400).json({
            error: {message: `missing ${key}`}
        })
    newDeck.created = created

    DeckService.addDeck(knexInstance, newDeck)
        .then(deck => {
            res.status(201)
            .location(path.join(req.originalUrl, `/${deck.id}`))
            .json(serializeDeck(deck))
        })
        .catch(next)
})

deckRouter

.route('/:deck_id')
.all((req, res, next) =>{
    DeckService.getById(
        req.app.get('db'),
        req.params.deck_id
    )
    .then(deck => {
        if(!deck){
            return res.status(404).json({
                error:{
                    message: `does not exist`
                }
            })
        }
        res.deck = deck
        next()
    })
        .catch(next)
})

.get((req, res, next) =>{
    return res.json(serializeDeck(res.deck))
})

.delete((req, res, next) =>{
    DeckService.deleteDeck(
        req.app.get('db'),
        req.params.deck_id
    )
        .then(() => {
            return res.status(204).end()
        })
        .catch(next)
})

.patch(jsonParser, (req, res, next) => {
    const {deck_name, description} = req.body
    const updatedDeck = {deck_name, description}

    const numberOfValues = Object.values(updatedDeck).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Must update at least one input` 
        }
      })
    DeckService.updateDeck(
        req.app.get('db'),
        req.params.deck_id,
        updatedDeck
    )
    .then(numRowsAffected =>{
       return res.status(204).end()
    })
    .catch(next)
})

module.exports = deckRouter