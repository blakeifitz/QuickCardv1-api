# _QuickCard_
 ## *https://quick-cardv1-client.blakeifitz.vercel.app/*

### This is QuickCard, an application to streamline the flashcard making process.

_As a user:_

- You can create an account to save and access secure decks of flashcards.
- You can create, delete, and edit flashcards using your notes you have already typed up.
- You can look at card by itself and switch between the front and the back.
- You can separate your keyword/phrase and definition pairs by a variety of symbols.
- You can save decks that cannot be accessed by other users.
- You can edit without leaving page.


This is my first PERN application with full CRUD operations. This is the client side of the application and uses React with vanilla css. I am using React-Router for navigation, and a combination of context and state for UI/component management. There is smoke testing implemented for all components. A custom Fav Icon using favicon.io.


This project was created to shorten the time doing of doing a regular, helpful, repetitive job. I was inspired by a computers ability to do repetitive tasks exactly the same every time, and in an extremely short amount of time. For the next version I would like to improve my card creating algorithim, styling, and remove context from state management.



 Here are the following endpoints:
 
 *all endpoints are prefixed with /api

- /auth/login
  - POST to get authenicated 
- /deck
  - GET to get all decks for user
  - POST to create a deck
- /deck/deck_id
  -GET to get deck by id
  -DELETE to delete deck by id
  -PATCH to modify deck by id
- /card
  - GET to get all cards for user
  - POST to create a card
- /card/card_id
  -GET to get card by id
  -DELETE to delete card by id
  - PATCH to modify card by id
- /user
  -POST to create user
