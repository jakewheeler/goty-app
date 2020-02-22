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

const deleteIfEmpty = async (key: string) => {
  let deleteRecord = false;

  try {
    let dbRef = db.collection('gamelists');
    let query = dbRef.where(firestore.FieldPath.documentId(), '==', key);
    let gameList = await query.get();
    deleteRecord = gameList.docs.map(g => g.data().games.length <= 0)[0];

    if (deleteRecord) {
      let deleteDoc = dbRef.doc(key).delete();
      console.log(deleteDoc);
    }
  } catch (error) {
    console.error(error);
  }
};

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
      deleteIfEmpty(key);
      return res.status(200).send(gamelist);
    } catch (err) {
      return res.status(403).send({ error: 'could not update game list' });
    }
  }
);

router.get('/years/:key', async (req: Request, res: Response) => {
  let key = req.params.key;
  key = '2RoigklRt4cB6wZmO7MtM0qb1qE3';
  try {
    const allRecords = await db.collection('gamelists').get(); // get all records
    const userRecords = allRecords.docs
      .map(doc => doc.id)
      .filter(id => id.includes(key)); // get all user records
    const userYears = userRecords.map(record => {
      return { year: record.slice(key.length + 1), hasData: false };
    });
    return res.send(userYears);
  } catch (error) {
    return res.status(403).send({ error: 'could not get records' });
  }
});

export default router;
