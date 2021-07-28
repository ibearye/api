const express = require('express');
const { getHTML, parseHTMLToSubject, parseHTMLToAlbum } = require('./helper');

const router = express.Router();

const API = {
  movie: 'https://movie.douban.com/subject/',
  book: 'https://book.douban.com/subject/',
  album: 'https://www.douban.com/photos/album/',
};

router.get('/:type/:id', async (req, res, next) => {
  try {
    const { type, id } = req.params;
    let data;
    if (type === 'album') {
      const { per = 18, page = 1 } = req.query;
      const mStart = (page - 1) * per;
      const html = await getHTML(API['album'] + id + '?m_start=' + mStart);
      data = parseHTMLToAlbum(html);
    } else {
      const html = await getHTML(API[req.params.type] + req.params.subject);
      data = parseHTMLToSubject(html);
    }

    res.app.locals.code = 2000;
    res.app.locals.data = data;
  } catch (err) {
    res.app.locals.code = 4202;
    res.app.locals.data = {};
    res.app.locals.message = err.message;
  }
  next();
});

module.exports = router;
