const express = require('express');

const { RESPONSE_CODE } = require('./utils');

const router = express.Router();

router.use('/douban', require('./douban'));

router.use(function (req, res) {
  const {
    code = 2000,
    message = (RESPONSE_CODE[code] && RESPONSE_CODE[code].message) || 'Unknown error',
    data = {},
  } = req.app.locals;

  res.json({ code, message, data });
  res.end();
});

module.exports = router;
