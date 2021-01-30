require('dotenv').config();

const morgan = require('morgan')
const express = require('express');
const path = require("path");
const app = express();
const port = parseInt(process.env.APP_PORT, 10);


app.use(express.static('../dist'));
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static(path.join('dist')));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

