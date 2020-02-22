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
      dbRef.doc(key).delete();
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

router.get(
  '/years/:key',
  checkIfAuthenticated,
  async (req: Request, res: Response) => {
    const key = req.params.key;
    const years = getYears();
    try {
      const allRecords = await db.collection('gamelists').get(); // get all records
      const userRecords = allRecords.docs
        .map(doc => doc.id)
        .filter(id => id.includes(key)); // get all user records
      const userYears: string[] = userRecords.map(record =>
        record.slice(key.length + 1)
      );
      const yearsData = years.map(year => {
        return {
          year: year,
          hasData: userYears.includes(year.toString()) ? true : false
        };
      });
      return res.send(yearsData);
    } catch (error) {
      return res.status(403).send({ error: 'could not get records' });
    }
  }
);

const getYears = (): number[] => {
  const currentYear = new Date().getFullYear();
  const yearArr = [];
  for (let i = currentYear; i >= 2000; i--) {
    yearArr.push(i);
  }
  return yearArr;
};

export default router;
