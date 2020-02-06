import express from 'express';
import checkIfAuthenticated from '../middleware';
import { getGameListByNameAndYear, getGameById } from '../api';

const router = express.Router();

router.get(
  '/gamelist/:gameName/:listYear',
  checkIfAuthenticated,
  async (req, res) => {
    const gameName = req.params.gameName;
    const listYear = req.params.listYear;
    if (gameName && listYear) {
      try {
        const gameList = await getGameListByNameAndYear(gameName, listYear);
        return res.send(gameList);
      } catch (err) {
        return res.sendStatus(500);
      }
    }
  }
);

router.get('/game/:id', checkIfAuthenticated, async (req, res) => {
  const id = req.params.id;
  if (id && id !== '') {
    try {
      const game = await getGameById(id);
      return res.send(game);
    } catch (err) {
      return res.sendStatus(500);
    }
  }
});

export default router;
