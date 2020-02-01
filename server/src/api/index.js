require('dotenv').config();
const axios = require('axios').default;

const BASE_URL = `https://www.giantbomb.com/api/games/?api_key=${process.env.GIANT_BOMB_API_KEY}&format=json`;
const FIELD_LIST = `&field_list=id,name,deck,image,platforms,site_detail_url`;

async function getGameListByName(gameName) {
  const filter = `&filter=name:${gameName}`;
  const url = BASE_URL + FIELD_LIST + filter;
  try {
    const gameList = await axios.get(url);
    return gameList.data;
  } catch (err) {
    console.error(err);
  }
}

async function getGameById(id) {
  const filter = `&filter=id:${id}`;
  const url = BASE_URL + FIELD_LIST + filter;
  try {
    const game = await axios.get(url);
    return game.data;
  } catch (err) {
    console.error(err);
  }
}

async function getRandomGamesFromLastYear(numberOfGames) {
  const year = new Date().getFullYear() - 1;
  const filter = `&filter=platform:146|35|129|143|88|145|20|86|157|117|138|139|94|17|152,release_date:${year}-01-01|${year}-12-31`;
  const fieldList = `&field_list=name,image,id`;
  const url = BASE_URL + fieldList + filter;
  try {
    const gameList = await axios.get(url);
    const randomGameList = await getRandomGames(
      gameList.data.results,
      numberOfGames
    );
    return randomGameList;
  } catch (err) {
    console.error(err);
  }
}

async function getRandomGames(gameList, numberOfGames = 3) {
  const listLen = gameList.length;
  const randomNodes = Array.from({ length: numberOfGames }, () =>
    Math.floor(Math.random() * listLen)
  );

  const gameObjects = randomNodes.map(result => {
    const game = gameList[result];
    const { id, name } = game;
    const { original_url: img_url } = game.image;
    return { id, name, img_url };
  });

  return gameObjects;
}

module.exports = {
  getGameListByName,
  getGameById,
  getRandomGamesFromLastYear
};
