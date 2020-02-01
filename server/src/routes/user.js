const express = require('express');
const router = express.Router();
const firebase = require('../firebase/firestore');
const checkIfAuthenticated = require('../middleware');

const db = firebase.db;
const firestore = firebase.firestore;

router.get('/list/:key', checkIfAuthenticated, async (req, res) => {
  const key = req.params.key;

  try {
    const gameListsRef = db
      .collection('gamelists')
      .where(firestore.FieldPath.documentId(), '==', key);

    const list = await gameListsRef.get();
    if (list.empty) return res.send({ games: [] });

    const gameList = [];
    list.forEach(x => gameList.push(x.data()));
    const [sortedList] = gameList.sort((a, b) => a.rank - b.rank);
    return res.send(sortedList);
  } catch (err) {
    return res.send({ games: [] });
  }
});

router.get('/list/:key/exists', checkIfAuthenticated, async (req, res) => {
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
});

router.put('/list/:key', checkIfAuthenticated, async (req, res) => {
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
});

module.exports = router;
