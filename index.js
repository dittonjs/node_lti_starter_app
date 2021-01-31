require('dotenv').config();
const { Sequelize } = require('sequelize');

const morgan = require('morgan')
const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const { setupLti } = require("./server/lib/lti_support");

const port = parseInt(process.env.APP_PORT, 10);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.html', require('ejs').__express);
app.use(express.static('../dist'));
app.use(morgan('combined'));
app.set('view engine', 'html');

app.use(express.static(path.join('dist')));

setupLti(app);

app.get('/', (req, res) => {
  res.render("index", {
    isLti: false,
  });
});

app.get('/lti_launches', (req, res) => {
  console.log(req.session.launchInfo);
  res.render("index", {
    isLti: true,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const sequelize = new Sequelize('node_lti_starter', null, null, {
  host: 'localhost',
  dialect: 'postgres'
});

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});


