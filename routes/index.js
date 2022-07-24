const router = require('express').Router();
//import all api routes, index.js is implied and doesnt need to be defined
const apiRoutes = require('./api');
const htmlRoutes = require('./html/html-routes');

//add prefix of /api
router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

router.use((req, res) => {
  res.status(404).send('<h1>😝 404 Error!</h1>');
});

module.exports = router;
re