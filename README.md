# _QuickCard_
 ## *https://quick-cardv1-client.blakeifitz.vercel.app/*

### This is QuickCard, an application to streamline the flashcard making process.

<img align="left" src="screenshots\notes.png" />
<img align="top" src="screenshots\card.png" />

_As a user:_

- You can create an account to save and access secure decks of flashcards.
- You can create, delete, and edit flashcards using your notes you have already typed up.
- You can look at card by itself and switch between the front and the back.
- You can separate your keyword/phrase and definition pairs by a variety of symbols.
- You can save decks that cannot be accessed by other users.
- You can edit without leaving page.


This is my first PERN application with full CRUD operations. This is the backend of the application and uses PostgresSQL, Express as an application framework, and runs on node.  Deployed on Heroku Hobby Server. There is testing implemented for each endpoint.

This project was created to shorten the time doing of doing a regular, helpful, repetitive job. I was inspired by a computers ability to do repetitive tasks exactly the same every time, and in an extremely short amount of time. For the next version I would like to improve my card creating algorithm, styling, and remove context from state management.



 Here are the following endpoints:
 
 * all endpoints are prefixed with /api

- /auth/login
  - POST to get authenicated 
- /deck
  - GET to get all decks for user
  - POST to create a deck
    - requires body { deck_name, description, created }
- /deck/deck_id
  - GET to get deck by id
  - DELETE to delete deck by id
  - PATCH to modify deck by id
    - requires at least one updated field
- /card
  - GET to get all cards for user
  - POST to create a card
    - requires body {deck Id, keyword, definition }
- /card/card_id
  - GET to get card by id
  - DELETE to delete card by id
  - PATCH to modify card by id
    - requires at least one updated field
- /user
  - POST to create user
    - requires body  { password, user_name, full_name, nickname }
