require('dotenv').config();
import axios, { AxiosResponse } from 'axios';

const BASE_URL: string = `https://www.giantbomb.com/api/games/?api_key=${process.env.GIANT_BOMB_API_KEY}&format=json`;
const FIELD_LIST: string = `&field_list=id,name,deck,image,platforms,site_detail_url`;

export const getGameListByNameAndYear = async (
  gameName: string,
  releaseYear: string
) => {
  const filter: string = `&filter=name:${gameName},expected_release_year:${releaseYear}`;
  const url: string = BASE_URL + FIELD_LIST + filter;
  try {
    const gameList: AxiosResponse<any> = await axios.get(url);
    return gameList.data;
  } catch (err) {
    console.error(err);
  }
};

export const getGameById = async (id: string) => {
  const filter: string = `&filter=id:${id}`;
  const url: string = BASE_URL + FIELD_LIST + filter;
  try {
    const game: AxiosResponse<any> = await axios.get(url);
    return game.data;
  } catch (err) {
    console.error(err);
  }
};
