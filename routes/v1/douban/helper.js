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
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.57',
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
 * 解析HTML内容为书影音记录
 * @param {string} html
 * @returns {Promise<{cover: string, name: string, description: string, excerpt: string}>} subject
 */
function parseHTMLToSubject(html) {
  const $ = cheerio.load(html);
  const subject = {
    cover: $('#mainpic img:first').attr('src'),
    name: $('#content h1:first').text(),
    description: $('#info > span.actor').text(),
    excerpt: $('#link-report').text(),
  };
  return subject;
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
  parseHTMLToSubject,
  parseHTMLToAlbum,
};
