const path = require("path");
const express = require("express");
const xss = require("xss");
const CardService = require("./card-service");
const { requireAuth } = require("../auth/jwt-auth");

const cardRouter = express.Router();
const jsonParser = express.json();

const serializeCard = (card) => ({
  id: card.id,
  keyword: xss(card.keyword),
  definition: xss(card.definition),
  deck: card.deck,
});

cardRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    const user_id = req.user.id;
    CardService.getAllCards(knexInstance, user_id)
      .then((card) => {
        return res.json(card.map(serializeCard));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { deck, keyword, definition } = req.body;
    const newCard = { deck, keyword, definition };

    for (const [key, value] of Object.entries(newCard))
      if ((value || key) == undefined)
        return res.status(400).json({
          error: { message: `Improper Format` },
        });

    newCard.user_id = req.user.id;

    CardService.addCard(knexInstance, newCard)
      .then((card) => {
        res
          .status(201)
          .location(path.join(req.originalUrl, `/${card.id}`))
          .json(serializeCard(card));
      })
      .catch(next);
  });

cardRouter
  .route("/:card_id")
  .all(requireAuth)
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    const user_id = req.user.id;
    CardService.getById(knexInstance, req.params.card_id, user_id)
      .then((card) => {
        if (!card) {
          return res.status(404).json({
            error: { message: "That card doesn't exist" },
          });
        }
        res.card = card;
        next();
      })
      .catch(next);
  })

  .get((req, res, next) => {
    res.json(serializeCard(res.card));
  })

  .delete((req, res, next) => {
    const user_id = req.user.id;
    CardService.deleteCard(req.app.get("db"), req.params.card_id, user_id)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
    const { keyword, definition } = req.body;
    const updatedCard = { keyword, definition };
    const user_id = req.user.id;

    const numberOfValues = Object.values(updatedCard).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Must update at least one input`,
        },
      });
    CardService.updateCard(req.app.get("db"),
     req.params.card_id,
      updatedCard,
      user_id)
      .then((rows) => {
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = cardRouter;
