import express, { Response, Request } from 'express';
import checkIfAuthenticated from '../middleware';
import { db, firestore } from '../firebase/firestore';

const router = express.Router();

router.get(
  '/list/:key',
  checkIfAuthenticated,
  async (req: Request, res: Response) => {
    const key = req.params.key;

    try {
      const gameListsRef = db
        .collection('gamelists')
        .where(firestore.FieldPath.documentId(), '==', key);

      const list = await gameListsRef.get();
      if (list.empty) return res.send({ games: [] });

      const gameList: Object[] = [];
      list.forEach(x => gameList.push(x.data()));
      const [sortedList] = gameList;

      return res.send(sortedList);
    } catch (err) {
      return res.send({ games: [] });
    }
  }
);

router.get(
  '/list/:key/exists',
  checkIfAuthenticated,
  async (req: Request, res: Response) => {
    const key = req.params.key;
    const gameListsRef = db
      .collection('gamelists')
      .where(firestore.FieldPath.documentId(), '==', key);
    try {
      const list = await gameListsRef.get();
      return res.send(!list.empty);
    } catch (err) {
      return res.send(false);
    }
  }
);

router.put(
  '/list/:key',
  checkIfAuthenticated,
  async (req: Request, res: Response) => {
    const key = req.params.key;
    const { gamelist } = req.body;

    if (gamelist.length > 10) {
      return res
        .status(403)
        .send({ error: 'game list can only be a maximum of 10 games' });
    }

    try {
      await db
        .collection('gamelists')
        .doc(key)
        .set(gamelist);
      return res.status(200).send(gamelist);
    } catch (err) {
      return res.status(403).send({ error: 'could not update game list' });
    }
  }
);

export default router;
