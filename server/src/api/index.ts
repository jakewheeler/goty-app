require('dotenv').config();
const axios = require('axios').default;

const BASE_URL = `https://www.giantbomb.com/api/games/?api_key=${process.env.GIANT_BOMB_API_KEY}&format=json`;
const FIELD_LIST = `&field_list=id,name,deck,image,platforms,site_detail_url`;

export async function getGameListByNameAndYear(
  gameName: string,
  releaseYear: string
) {
  const filter = `&filter=name:${gameName},expected_release_year:${releaseYear}`;
  const url = BASE_URL + FIELD_LIST + filter;
  try {
    const gameList = await axios.get(url);
    return gameList.data;
  } catch (err) {
    console.error(err);
  }
}

export async function getGameById(id: string) {
  const filter = `&filter=id:${id}`;
  const url = BASE_URL + FIELD_LIST + filter;
  try {
    const game = await axios.get(url);
    return game.data;
  } catch (err) {
    console.error(err);
  }
}
