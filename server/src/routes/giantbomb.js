const express = require('express');
const router = express.Router();
const checkIfAuthenticated = require('../middleware');
const api = require('../api');

router.get('/gamelist/:gameName', checkIfAuthenticated, async (req, res) => {
  const gameName = req.params.gameName;
  if (gameName && gameName !== '') {
    try {
      const gameList = await api.getGameListByName(gameName);
      return res.send(gameList);
    } catch (err) {
      return res.sendStatus(500);
    }
  }
});

router.get('/game/:id', checkIfAuthenticated, async (req, res) => {
  const id = req.params.id;
  if (id && id !== '') {
    try {
      const game = await api.getGameById(id);
      return res.send(game);
    } catch (err) {
      return res.sendStatus(500);
    }
  }
});

module.exports = router;
