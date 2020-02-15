import { Express } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/user';
import apiRoutes from './routes/giantbomb';
import path from 'path';

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

  // if (process.env.NODE_ENV === 'production') {
  //   // Serve any static files
  //   app.use(express.static(path.join(__dirname, 'build')));

  //   // Handle React routing, return all requests to React app
  //   app.get('*', function(_req, res) {
  //     res.sendFile(path.join(__dirname, 'build', 'index.html'));
  //   });
  // }

  app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
};

export default start;
