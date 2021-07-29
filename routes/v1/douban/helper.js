const request = require('request');
const cheerio = require('cheerio');

/**
 * 获取HTML内容
 * @param {string} url
 * @returns {Promise<string>} html
 */
function getHTML(url) {
  return new Promise((resove, reject) => {
    request(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
        },
      },
      (err, res, body) => {
        if (err) {
          reject(err);
          return;
        }

        if (res.statusCode === 200) {
          resove(body);
        } else {
          reject(new Error('Resource error.'));
        }
      }
    );
  });
}

/**
 * 解析HTML内容为影音记录
 * @param {string} html
 * @returns {Promise<{cover: string, name: string, description: string, excerpt: string}>} movie
 */
function parseHTMLToMovie(html) {
  const $ = cheerio.load(html);
  const movie = {
    cover: $('#mainpic img').eq(0).attr('src'),
    name: $('#content h1')
      .eq(0)
      .text()
      .replace(/\n/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s+/, ''),
    info: $('#info > span.actor')
      .text()
      .replace(/\n/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s+/, ''),
    excerpt: $('#link-report')
      .text()
      .replace(/\n|\s/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s+/, ''),
  };
  return movie;
}

/**
 * 解析HTML内容为书籍记录
 * @param {string} html
 * @returns {Promise<{cover: string, name: string, description: string, excerpt: string}>} book
 */
function parseHTMLToBook(html) {
  const $ = cheerio.load(html);

  const book = {
    cover: $('#mainpic img').eq(0).attr('src'),
    name: $('#wrapper > h1 > span')
      .eq(0)
      .text()
      .replace(/\n/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s+/, ''),
    info: $('#info')
      .text()
      .replace(/\n/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s+/, ''),
    excerpt: $('#link-report')
      .text()
      .replace(/\n/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s+/, ''),
  };
  return book;
}

/**
 * 解析HTML内容为相册记录
 * @param {string} html
 * @returns {Promise<{cover: string, name: string, description: string, excerpt: string}>} subject
 */
function parseHTMLToAlbum(html) {
  const $ = cheerio.load(html);

  const total =
    Number(
      $('.article .photitle span')
        .text()
        .match(/[0-9]*/g)[1]
    ) || 0;
  const album = {
    title:
      $('.info h1')
        .text()
        .match(/.*?\-(.*)/)[1] || '',
    desc: $('.description').text() || '',
    author: {
      name: $('.pic img')[0].attribs.alt || '',
      avatar: $('.pic img')[0].attribs.src || '',
      alt: $('.info li a')[0].attribs.href || '',
    },
  };

  const imgs = $('.photo_wrap img');

  const per = imgs.length || 0;

  const photos = [];

  imgs.each((index) => {
    photos.push(imgs[index].attribs.src);
  });

  return {
    total,
    per,
    album,
    photos,
  };
}

module.exports = {
  getHTML,
  parseHTMLToBook,
  parseHTMLToMovie,
  parseHTMLToAlbum,
};
