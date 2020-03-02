const express = require('express');
const router = express.Router();

// @route POST api/clients
// @desc Register a client
// @access Public

router.post('/', (req, res) => {
  res.send('Register a client');
});

module.exports = router;
