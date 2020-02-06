import { Express } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/user';
import apiRoutes from './routes/giantbomb';

const express = require('express');

const app: Express = express();
const PORT: number = 5000;

const start = (): void => {
  // middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // routes
  app.use('/api', apiRoutes);
  app.use('/user', userRoutes);

  app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
};

export default start;
