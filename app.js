const path = require('path');
const express = require('express');

const app = express();

// 跨域请求
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.json());

app.use('/public', express.static(path.join(__dirname, '/public')));

app.use('/v1', require('./routes/v1'));

app.listen(3000, () => {
  console.log('server is running on port 3000');
});
