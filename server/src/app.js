const express = require('express');
const app = express();
const PORT = 5000;
const apiRoutes = require('./routes/giantbomb');
const userRoutes = require('./routes/user');
const bodyParser = require('body-parser');

function start() {
  // middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // routes
  app.use('/api', apiRoutes);
  app.use('/user', userRoutes);

  app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
}

module.exports = { start };
